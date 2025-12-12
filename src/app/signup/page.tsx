
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth, useFirestore, FirestorePermissionError, errorEmitter } from "@/firebase";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Save, ShieldCheck, Home } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import TermsContent from "@/components/terms-content";
import PrivacyContent from "@/components/privacy-content";
import { AnimatedLoading } from "@/components/animated-loading";

const formSchema = z.object({
  username: z.string().min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
  confirmPassword: z.string().min(6, { message: "La confirmación de contraseña debe tener al menos 6 caracteres." }),
  terms: z.boolean().default(false).refine(value => value === true, {
    message: "Debes aceptar los términos y condiciones.",
  }),
  privacy: z.boolean().default(false).refine(value => value === true, {
    message: "Debes aceptar la política de privacidad.",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
  path: ["confirmPassword"],
});


export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const auth = useAuth();
  const db = useFirestore();
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
      privacy: false,
    },
  });

  function handleAcceptTerms() {
    form.setValue('terms', true, { shouldValidate: true });
    setTermsModalOpen(false);
  }

  function handleAcceptPrivacy() {
    form.setValue('privacy', true, { shouldValidate: true });
    setPrivacyModalOpen(false);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Update Auth profile first
      await updateProfile(user, { displayName: values.username });
      
      const profileData = {
        id: user.uid,
        username: values.username,
        avatar: "🎮", // Default avatar
      };

      const userDocRef = doc(db, 'users', user.uid);
      
      // Set Firestore document
      await setDoc(userDocRef, profileData);
      
      setIsNavigating(true);
      router.push("/dashboard");

    } catch (error: any) {
      let title = "Falló el Registro";
      let description = "Ocurrió un error inesperado durante el registro. Por favor, inténtalo de nuevo.";
      
      if (error?.code === 'auth/email-already-in-use') {
        description = "Este correo electrónico ya está en uso. Por favor, intenta con otro.";
      } else if (error.name === 'FirebaseError') {
        // This is likely a Firestore permission error if auth creation succeeded.
        const permissionError = new FirestorePermissionError({
            path: `users/${auth.currentUser?.uid || 'unknown-uid'}`,
            operation: 'create',
            requestResourceData: {
                id: auth.currentUser?.uid || 'unknown-uid',
                username: values.username,
                avatar: '🎮'
            }
        });
        errorEmitter.emit('permission-error', permissionError);
        // The global listener will throw the error, so we don't need a toast here.
        setIsLoading(false);
        return; 
      }
      
      toast({
        title: title,
        description: description,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }


  const handleNavigation = (path: string) => {
    setIsNavigating(true);
    router.push(path);
  };

  if (isNavigating) {
    return <AnimatedLoading />;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-12">
       <Button asChild variant="outline" className="absolute top-4 left-4" onClick={() => handleNavigation('/')}>
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Inicio
        </Link>
      </Button>
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
             <Save className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Crea tu Save Point</CardTitle>
          <CardDescription>
            Crea una cuenta para empezar a sincronizar tus juegos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="JugadorUno" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="jugador@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Acepto los {" "}
                        <Dialog open={termsModalOpen} onOpenChange={setTermsModalOpen}>
                          <DialogTrigger asChild>
                            <span className="underline text-primary hover:text-primary/80 cursor-pointer">
                              Términos de Servicio
                            </span>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] md:max-w-xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Save className="h-6 w-6" />
                                Términos y Servicios (La Letra Pequeña para Gamers)
                              </DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="h-96 pr-4">
                              <TermsContent />
                            </ScrollArea>
                            <DialogFooter>
                              <Button type="button" onClick={handleAcceptTerms}>
                                Acepto mi destino
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </FormLabel>
                       <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        He leído y acepto la {" "}
                        <Dialog open={privacyModalOpen} onOpenChange={setPrivacyModalOpen}>
                          <DialogTrigger asChild>
                            <span className="underline text-primary hover:text-primary/80 cursor-pointer">
                             Política de Privacidad
                            </span>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] md:max-w-xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <ShieldCheck className="h-6 w-6" />
                                Política de Privacidad (La Versión Rápida)
                              </DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="h-96 pr-4">
                              <PrivacyContent />
                            </ScrollArea>
                             <DialogFooter>
                              <Button type="button" onClick={handleAcceptPrivacy}>
                                Acepto mi destino
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </FormLabel>
                       <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creando Cuenta..." : "Crear Cuenta"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <button onClick={() => handleNavigation('/login')} className="underline text-primary hover:text-primary/80">
              Inicia sesión
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
