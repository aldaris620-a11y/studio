"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { useUser, useAuth, useFirestore } from '@/firebase';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida.'),
    newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres.'),
});

const deleteSchema = z.object({
    confirmPassword: z.string().min(1, 'Se requiere la contraseña para eliminar tu cuenta.'),
});

export default function SettingsPage() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  const deleteForm = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
    defaultValues: { confirmPassword: '' },
  });

  async function handlePasswordChange(values: z.infer<typeof passwordSchema>) {
    if (!user || !user.email) return;

    setIsPasswordLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, values.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, values.newPassword);
      
      toast({
        title: 'Éxito',
        description: 'Tu contraseña ha sido cambiada exitosamente.',
      });
      passwordForm.reset();
    } catch (error: any) {
      toast({
        title: 'Error al Cambiar la Contraseña',
        description: error.message || 'Por favor, verifica tu contraseña actual e inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsPasswordLoading(false);
    }
  }

  async function handleDeleteAccount(values: z.infer<typeof deleteSchema>) {
    if (!user || !user.email) return;

    setIsDeleteLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, values.confirmPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', user.uid));
      
      // Delete user from Firebase Auth
      await deleteUser(user);

      toast({
        title: 'Cuenta Eliminada',
        description: 'Tu cuenta y todos los datos asociados han sido eliminados permanentemente.',
      });

      router.push('/login');
    } catch (error: any) {
      toast({
        title: 'Error al Eliminar la Cuenta',
        description: error.message || 'Ocurrió un error. Por favor, verifica tu contraseña.',
        variant: 'destructive',
      });
    } finally {
        setIsDeleteLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Ajustes de Cuenta</h1>
      <p className="text-muted-foreground mb-8">Administra los ajustes y datos de tu cuenta.</p>
      
      <div className="space-y-8">
        <Card>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
              <CardHeader>
                <CardTitle>Cambiar Contraseña</CardTitle>
                <CardDescription>Actualiza tu contraseña aquí. Es una buena práctica usar una contraseña fuerte y única.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña Actual</FormLabel>
                    <FormControl><Input type="password" {...field} className="max-w-sm" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva Contraseña</FormLabel>
                    <FormControl><Input type="password" {...field} className="max-w-sm" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
              <CardContent>
                <Button type="submit" disabled={isPasswordLoading}>{isPasswordLoading ? 'Cambiando...' : 'Cambiar Contraseña'}</Button>
              </CardContent>
            </form>
          </Form>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Eliminar Cuenta</CardTitle>
            <CardDescription>Elimina permanentemente tu cuenta y todo tu contenido. Esta acción no es reversible.</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Eliminar Mi Cuenta</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <Form {...deleteForm}>
                  <form onSubmit={deleteForm.handleSubmit(handleDeleteAccount)}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás absolutely seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y borrará tus datos de nuestros servidores.
                        Por favor, escribe tu contraseña para confirmar.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <FormField control={deleteForm.control} name="confirmPassword" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl><Input type="password" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction type="submit" disabled={isDeleteLoading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {isDeleteLoading ? 'Eliminando...' : 'Eliminar Cuenta'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </form>
                </Form>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
