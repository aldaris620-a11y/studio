
"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, getDoc, setDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { updateProfile as updateAuthProfile } from 'firebase/auth';

import { useUser, useFirestore, useAuth } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const profileSchema = z.object({
  fullName: z.string().min(3, { message: "El nombre completo debe tener al menos 3 caracteres." }),
  username: z.string().min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres.' }),
  gender: z.enum(["masculino", "femenino", "otro"], { required_error: "Debes seleccionar un género." }),
});

const avatarImages = PlaceHolderImages.filter(img => img.id.startsWith('avatar-'));

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: '', fullName: '' },
  });

  useEffect(() => {
    if (user && db) {
      const fetchUserData = async () => {
        setIsPageLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                form.reset({ 
                    username: userData.username || user.displayName || '',
                    fullName: userData.fullName || '',
                    gender: userData.gender || 'otro'
                });
                setSelectedAvatar(userData.avatar || 'avatar-1');
            } else {
                // If profile doesn't exist, use auth data and set a default avatar
                form.reset({ 
                    username: user.displayName || '',
                    fullName: '',
                    gender: 'otro'
                });
                setSelectedAvatar('avatar-1');
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            form.reset({ 
                username: user.displayName || '',
                fullName: '',
                gender: 'otro'
            });
            setSelectedAvatar('avatar-1');
        }
        setIsPageLoading(false);
      };
      fetchUserData();
    }
  }, [user, form, db]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!user || !db || !auth.currentUser) return;
    setIsLoading(true);

    // Check if new username is already taken by another user
    if (form.getValues('username') !== values.username) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", values.username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            let isTaken = false;
            querySnapshot.forEach(doc => {
                if (doc.id !== user.uid) {
                    isTaken = true;
                }
            });
            if (isTaken) {
                toast({
                    title: 'Falló la Actualización',
                    description: 'Este nombre de usuario ya está en uso. Por favor, elige otro.',
                    variant: 'destructive',
                });
                setIsLoading(false);
                return;
            }
        }
    }


    try {
      // Update Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        id: user.uid,
        username: values.username,
        fullName: values.fullName,
        gender: values.gender,
        avatar: selectedAvatar,
      }, { merge: true });

      // Update Firebase Auth profile
      if (auth.currentUser.displayName !== values.username) {
        await updateAuthProfile(auth.currentUser, {
          displayName: values.username,
        });
      }

      toast({
        title: 'Perfil Actualizado',
        description: 'Tu perfil ha sido actualizado exitosamente.',
      });
    } catch (error: any) {
      toast({
        title: 'Falló la Actualización',
        description: error.message || 'Ocurrió un error.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  if (isPageLoading) {
    return (
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tu Perfil</h1>
          <p className="text-muted-foreground mb-8">Administra la información de tu perfil público.</p>
          <Card>
            <CardHeader>
                <CardTitle>Ajustes del Perfil</CardTitle>
                <CardDescription>Actualiza tu nombre de usuario y elige tu avatar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/2" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <div className="flex gap-4">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <Skeleton className="h-24 w-24 rounded-full" />
                    </div>
                </div>
                <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
        </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Tu Perfil</h1>
      <p className="text-muted-foreground mb-8">Administra la información de tu perfil público.</p>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Ajustes del Perfil</CardTitle>
              <CardDescription>Actualiza tu información y elige tu avatar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre completo" {...field} className="max-w-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu genial gamertag" {...field} className="max-w-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Género</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex items-center space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="masculino" id="masculino" />
                          </FormControl>
                           <Label htmlFor="masculino" className="p-2 rounded-md border-2 border-transparent hover:border-primary data-[state=checked]:border-primary cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-45)">
                                <circle cx="12" cy="12" r="5"/>
                                <path d="M17 7h-6m0 0v6"/>
                            </svg>
                          </Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="femenino" id="femenino" />
                          </FormControl>
                           <Label htmlFor="femenino" className="p-2 rounded-md border-2 border-transparent hover:border-primary data-[state=checked]:border-primary cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="10" r="5"/>
                                <path d="M12 15v6"/>
                                <path d="M9 18h6"/>
                            </svg>
                          </Label>
                        </FormItem>
                         <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="otro" id="otro" />
                          </FormControl>
                           <Label htmlFor="otro" className="p-2 rounded-md border-2 border-transparent hover:border-primary data-[state=checked]:border-primary cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                          </Label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>Avatar</FormLabel>
                <div className="flex flex-wrap gap-4">
                  {avatarImages.map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedAvatar(image.id)}
                      className={cn(
                        'rounded-full ring-offset-background transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        selectedAvatar === image.id ? 'ring-2 ring-primary ring-offset-2' : ''
                      )}
                    >
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        width={96}
                        height={96}
                        className="h-24 w-24 rounded-full border-2 border-transparent object-cover hover:border-primary"
                        data-ai-hint={image.imageHint}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardContent>
                 <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
