"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, AuthFormData } from "@/lib/schemas";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthFormData>({
        resolver: zodResolver(authSchema),
    });

    const onSubmit = async (data: AuthFormData) => {
        try {
            await createUserWithEmailAndPassword(auth, data.email, data.password);
            router.push("/dashboard"); // Redireciona após o sucesso
        } catch (error: any) {
            console.error("Erro ao cadastrar:", error.code);
            // Aqui trata erros como 'auth/email-already-in-use'
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4 bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Criar Conta</h2>

                <div>
                    <label className="block text-sm font-medium">E-mail</label>
                    <input
                        {...register("email")}
                        className="w-full p-2 border rounded mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Senha</label>
                    <input
                        type="password"
                        {...register("password")}
                        className="w-full p-2 border rounded mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                    {isSubmitting ? "Carregando..." : "Cadastrar"}
                </button>
            </form>
        </div>
    );
}