"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile as updateAuthProfile } from 'firebase/auth';

import { useAuth } from '@/hooks/use-auth';
import { db, auth } from '@/lib/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
});

const avatarImages = PlaceHolderImages.filter(img => img.id.startsWith('avatar-'));

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: '' },
  });

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        setIsPageLoading(true);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          form.reset({ username: userData.displayName || user.displayName });
          setSelectedAvatar(userData.avatar || 'avatar-1');
        }
        setIsPageLoading(false);
      };
      fetchUserData();
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!user) return;
    setIsLoading(true);
    try {
      // Update Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        displayName: values.username,
        avatar: selectedAvatar,
      });

      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateAuthProfile(auth.currentUser, {
          displayName: values.username,
          // You'd typically upload the avatar and get a URL here
        });
      }

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || 'An error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  if (isPageLoading) {
    return (
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground mb-8">Manage your public profile information.</p>
          <Card>
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your username and choose your avatar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
      <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
      <p className="text-muted-foreground mb-8">Manage your public profile information.</p>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your username and choose your avatar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your cool gamer tag" {...field} className="max-w-sm" />
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
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
