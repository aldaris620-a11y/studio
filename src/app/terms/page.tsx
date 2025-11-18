import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';
import TermsContent from '@/components/terms-content';


export default function TermsPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-12">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Save className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Términos y Servicios (La Letra Pequeña para Gamers)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TermsContent />
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
