"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Gamepad2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
                <Gamepad2 className="h-12 w-12 animate-pulse text-primary" />
                <p className="mt-4 text-lg font-semibold text-foreground">
                    Securing Connection...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
