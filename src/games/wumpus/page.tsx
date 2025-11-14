
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skull } from 'lucide-react';

export default function WumpusPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skull className="h-6 w-6" />
            Caza del Wumpus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Bienvenido a Caza del Wumpus. ¡El desarrollo de esta página está en progreso!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
