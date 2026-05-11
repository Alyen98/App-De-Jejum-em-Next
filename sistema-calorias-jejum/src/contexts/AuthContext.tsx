"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Definimos o que o nosso contexto vai armazenar
type AuthContextType = {
    user: User | null;
    loading: boolean;
};

// Criamos o contexto já com valores iniciais
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // O onAuthStateChanged é o "ouvinte" do Firebase. Ele roda sempre que o login/logout acontece.
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false); // Terminou de checar
        });

        // Limpeza do ouvinte quando o componente for desmontado
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook customizado para facilitar o uso nas outras telas
export const useAuth = () => useContext(AuthContext);