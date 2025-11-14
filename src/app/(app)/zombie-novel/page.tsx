import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookHeart } from 'lucide-react';

export default function ZombieNovelPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookHeart className="h-6 w-6" />
            Apocalipsis Z: Novela Visual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Bienvenido a Apocalipsis Z. ¡El desarrollo de esta página está en progreso!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
