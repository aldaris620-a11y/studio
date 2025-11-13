
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";

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
  FormDescription,
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
import { Gamepad2, ShieldCheck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import TermsContent from "@/components/terms-content";
import PrivacyContent from "@/components/privacy-content";

const formSchema = z.object({
  username: z.string().min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres." }),
  fullName: z.string().min(3, { message: "El nombre completo debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
  confirmPassword: z.string().min(6, { message: "La confirmación de contraseña debe tener al menos 6 caracteres." }),
  gender: z.enum(["masculino", "femenino", "otro"], { required_error: "Debes seleccionar un género." }),
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
  const auth = useAuth();
  const db = useFirestore();
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullName: "",
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

    // Check if username already exists
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", values.username));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        toast({
          title: "Falló el Registro",
          description: "Este nombre de usuario ya está en uso. Por favor, elige otro.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    } catch (error) {
       toast({
        title: "Falló el Registro",
        description: "Error al verificar el nombre de usuario.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }


    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: values.username });

      // Create user document in Firestore
      const userProfileRef = doc(db, 'users', user.uid);
      await setDoc(userProfileRef, {
        id: user.uid,
        username: values.username,
        fullName: values.fullName,
        gender: values.gender,
        avatar: "avatar-1", // Default avatar
      });

      router.push("/dashboard");
    } catch (error: any) {
      let description = "Ocurrió un error inesperado.";
      if (error.code === 'auth/email-already-in-use') {
        description = "Este correo electrónico ya está en uso. Por favor, intenta con otro.";
      }
      toast({
        title: "Falló el Registro",
        description: description,
        variant: "destructive",
      });
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-12">
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
             <Gamepad2 className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Únete al Centro</CardTitle>
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
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                           <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="4"/>
                                <path d="M16 8h-2m4 0h-2"/>
                                <path d="m15 7 1-1"/>
                                <path d="m15 9 1 1"/>
                                <path d="M9 16.7A5 5 0 0 1 9 7.3"/>
                            </svg>
                          </Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="femenino" id="femenino" />
                          </FormControl>
                           <Label htmlFor="femenino" className="p-2 rounded-md border-2 border-transparent hover:border-primary data-[state=checked]:border-primary cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="10" r="4"/>
                                <path d="M12 14v8"/>
                                <path d="M9 20h6"/>
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
                                <Gamepad2 className="h-6 w-6" />
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
            <Link href="/login" className="underline text-primary hover:text-primary/80">
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    