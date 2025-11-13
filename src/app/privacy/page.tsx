import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import PrivacyContent from '@/components/privacy-content';


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
        <CardContent className="space-y-6">
          <PrivacyContent />
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
