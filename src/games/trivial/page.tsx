
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

export default function TrivialPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6" />
            Trivial de Miedo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Bienvenido al Trivial de Miedo. ¡El desarrollo de esta página está en progreso!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
