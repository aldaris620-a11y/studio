import type {Metadata} from 'next';
import './globals.css';
import './games/wumpus/wumpus.css';
import { Toaster } from "@/components/ui/toaster"
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Save Point',
  description: 'Sincroniza tu progreso de juego y recompensas sin problemas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased scanlines">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
