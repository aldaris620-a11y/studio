"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { AnimatedLoading } from "./animated-loading";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.replace('/login');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || !user) {
        return <AnimatedLoading text="Asegurando Conexión..." />;
    }

    return <>{children}</>;
}
