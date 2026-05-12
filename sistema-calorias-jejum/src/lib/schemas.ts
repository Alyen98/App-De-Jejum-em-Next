import { z } from "zod";

export const authSchema = z.object({
    email: z.string().email("Insira um e-mail válido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type AuthFormData = z.infer<typeof authSchema>;

export const mealSchema = z.object({
    id: z.string().optional(),
    description: z.string().min(2, "A descrição deve ter pelo menos 2 caracteres"),
    calories: z.number({ message: "Insira um número válido" }).min(1, "As calorias devem ser maiores que 0"),
    type: z.enum(["café", "almoço", "lanche", "jantar", "ceia"], {
        message: "Selecione o tipo de refeição",
    }),
    date: z.string().nonempty("A data é obrigatória"),
    time: z.string().nonempty("O horário é obrigatório"),
});

export type MealFormData = z.infer<typeof mealSchema>;