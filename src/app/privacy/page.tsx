import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';


export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-12">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Política de Privacidad (La Versión Rápida)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">¿Qué datos guardamos?</h3>
              <p className="text-muted-foreground text-sm">
                Tu correo, tu nombre de usuario y qué tan bueno (o malo) eres en los juegos. Básicamente, lo esencial para que puedas presumir de tus logros.
              </p>
            </div>
             <div>
              <h3 className="font-semibold text-lg">¿Vendemos tus datos a aliens o corporaciones malvadas?</h3>
              <p className="text-muted-foreground text-sm">
                No. A menos que nos ofrezcan una nave espacial o la cura para el lag. Es broma... a medias. Tus datos están a salvo con nosotros.
              </p>
            </div>
             <div>
              <h3 className="font-semibold text_lg">¿Usamos cookies?</h3>
              <p className="text-muted-foreground text-sm">
                Sí, pero solo las del tipo digital, no las de chocolate. Sirven para que no tengas que iniciar sesión cada 5 minutos.
              </p>
            </div>
             <div>
              <h3 className="font-semibold text-lg">¿Puedes borrar tu cuenta?</h3>
              <p className="text-muted-foreground text-sm">
                Claro, pero todos tus récords se irán contigo al vacío digital. Será como si nunca hubieras existido. Sin presiones.
              </p>
            </div>

            <div className="text-center pt-4">
             <Link href="/signup">
                <Button>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Registro
                </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
