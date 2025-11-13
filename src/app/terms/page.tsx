import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  const terms = [
    {
      title: "Prohibido ser un noob tóxico.",
      description: "En serio, ni se te ocurra. Si te portas como un troll, enviaremos tu cuenta al gulag digital y la reemplazaremos con un bot que solo sabe decir 'gg ez'."
    },
    {
      title: "No uses trucos, excepto el Konami Code.",
      description: "Usar hacks aquí es como activar el modo fácil en la vida real: patético. Si lo haces, cambiaremos tu avatar por un pollo de goma por toda la eternidad."
    },
    {
      title: "Tus datos son nuestro tesoro.",
      description: "Cuidaremos tu progreso como un dragón cuida su oro. No venderemos tus datos a NPCs sospechosos, pero los usaremos para hacer este hub aún más épico (y para saber cuántas veces has perdido contra ese jefe final)."
    },
    {
      title: "El 'Rage Quit' tiene consecuencias.",
      description: "Si abandonas una partida con rabia, tu teclado te juzgará. Nosotros no, pero podríamos enviarte una notificación pasivo-agresiva que diga 'git gud'."
    },
    {
      title: "Derechos de fanfarronería.",
      description: "Estás legalmente obligado a presumir de cada recompensa que desbloquees. Las capturas de pantalla son obligatorias. El incumplimiento resultará en un título de 'noob' durante 24 horas."
    },
    {
      title: "Responsabilidad del hardware.",
      description: "No nos hacemos responsables si lanzas tu mando contra la pared. Sin embargo, aceptamos donaciones de mandos rotos para nuestro 'Muro de la Furia'."
    },
    {
      title: "La cafeína no es una excusa.",
      description: "Decir 'no he tomado suficiente café' no justifica una mala partida. Mejora tus excusas o mejora tu juego. O ambas."
    },
    {
      title: "Spoilers = Traición.",
      description: "Arruinar la trama de un juego a otros usuarios se castiga con la pena máxima: serás forzado a jugar una versión del juego donde todos los personajes son Jar Jar Binks."
    },
    {
      title: "La vida real es el DLC obligatorio.",
      description: "Recuerda pausar el juego de vez en cuando para completar misiones como 'Sacar la basura' o 'Hablar con humanos'. Son necesarias para desbloquear el logro 'Adulto Funcional'."
    },
    {
      title: "Actualizaciones y Nerfeos.",
      description: "Nos reservamos el derecho de 'nerfear' o 'buffear' cualquier parte de esta plataforma sin previo aviso. Si no te gusta, presenta tu queja al departamento de 'A Nadie le Importa'."
    }
  ];

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-12">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Gamepad2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Términos y Servicios (La Letra Pequeña para Gamers)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {terms.map((term, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg">{index + 1}. {term.title}</h3>
              <p className="text-muted-foreground text-sm">{term.description}</p>
            </div>
          ))}
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
