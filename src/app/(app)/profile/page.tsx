
"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile as updateAuthProfile } from 'firebase/auth';

import { useUser, useFirestore, useAuth, FirestorePermissionError, errorEmitter } from '@/firebase';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
  username: z.string().min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres.' }),
});

const avatarEmojis = ["🎮", "👾", "🤖", "👽", "👻", "🎃", "🦁", "🦊", "👑", "🧙", "🧝", "🧑‍🚀", "🦸", "🥷", "💀", "🐲", "🦄", "🧟", "🧛", "🎯", "💎", "🔥", "⚡️", "☠️", "⚔️", "🛡️", "🚀", "🛸"];


export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('🎮');
  const [isPageLoading, setIsPageLoading] = useState(true);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: '' },
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
                });
                setSelectedAvatar(userData.avatar || '🎮');
            } else {
                form.reset({ 
                    username: user.displayName || '',
                });
                setSelectedAvatar('🎮');
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            form.reset({ 
                username: user.displayName || '',
            });
            setSelectedAvatar('🎮');
        }
        setIsPageLoading(false);
      };
      fetchUserData();
    }
  }, [user, form, db]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!user || !db || !auth.currentUser) return;
    setIsLoading(true);

    const newUsername = values.username;
    
    const userDocRef = doc(db, 'users', user.uid);
    const profileData = {
        username: newUsername,
        avatar: selectedAvatar,
    };

    setDoc(userDocRef, profileData, { merge: true })
        .then(async () => {
            if (auth.currentUser?.displayName !== newUsername) {
                await updateAuthProfile(auth.currentUser!, { displayName: newUsername });
            }
            toast({
                title: 'Perfil Actualizado',
                description: 'Tu perfil ha sido actualizado exitosamente.',
                variant: 'success',
            });
        })
        .catch(error => {
            const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: profileData,
            });
            errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => {
            setIsLoading(false);
        });
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
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <div className="flex flex-wrap gap-2">
                        {[...Array(avatarEmojis.length)].map((_, i) => (
                           <Skeleton key={i} className="h-16 w-16 rounded-full" />
                        ))}
                    </div>
                </div>
            </CardContent>
             <CardFooter>
                <Skeleton className="h-10 w-32" />
            </CardFooter>
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
              <div className="space-y-2">
                <FormLabel>Avatar</FormLabel>
                 <div className="flex flex-wrap gap-2">
                  {avatarEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedAvatar(emoji)}
                      className={cn(
                        'h-16 w-16 text-3xl flex items-center justify-center rounded-full bg-muted transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        selectedAvatar === emoji ? 'ring-2 ring-primary ring-offset-2 bg-primary/20' : 'hover:bg-accent'
                      )}
                      aria-label={`Seleccionar ${emoji} como avatar`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
                 <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
