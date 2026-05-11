"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Se terminou de carregar e não tem usuário, expulsa para o login
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Enquanto o Firebase decide se o usuário está logado ou não, mostramos um loading
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-gray-500">Carregando dados do usuário...</p>
            </div>
        );
    }

    // Se não tem usuário, retorna null para não "piscar" a tela do dashboard antes do redirecionamento
    if (!user) return null;

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    return (
        <div className="min-h-screen p-8">
            <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-8">
                <h1 className="text-2xl font-bold">Meu Painel</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{user.email}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100 transition-colors"
                    >
                        Sair
                    </button>
                </div>
            </header>

            <main>
                <p className="text-gray-600">Aqui entrarão os gráficos de resumo semanal e os cards de registro.</p>
            </main>
        </div>
    );
}