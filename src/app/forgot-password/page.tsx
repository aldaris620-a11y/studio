
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { useAuth } from "@/firebase";

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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Gamepad2, MailCheck } from "lucide-react";
import { AnimatedLoading } from "@/components/animated-loading";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast({
        title: "Correo Enviado",
        description: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
        variant: "success",
      });
      setEmailSent(true);
    } catch (error: any) {
      let description = "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";
      if (error.code === 'auth/user-not-found') {
        description = "No se encontró ninguna cuenta con este correo electrónico.";
      }
      toast({
        title: "Error",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <AnimatedLoading text="Enviando instrucciones..." />;
  }

  if (emailSent) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
            <Card className="mx-auto w-full max-w-sm text-center">
                <CardHeader>
                    <div className="flex justify-center items-center mb-4">
                        <MailCheck className="h-12 w-12 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">¡Revisa tu Correo!</CardTitle>
                    <CardDescription>
                        Se ha enviado un enlace para restablecer la contraseña a tu dirección de correo electrónico.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link href="/login">Volver a Iniciar Sesión</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }


  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
             <Gamepad2 className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Recuperar Contraseña</CardTitle>
          <CardDescription>
            Introduce tu correo electrónico y te enviaremos un enlace para restablecerla.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar Correo"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            ¿Recordaste tu contraseña?{" "}
            <Link href="/login" className="underline text-primary hover:text-primary/80">
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
