"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { Gamepad2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.replace('/login');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || !user) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
                <Gamepad2 className="h-12 w-12 animate-pulse text-primary" />
                <p className="mt-4 text-lg font-semibold text-foreground">
                    Asegurando Conexión...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
