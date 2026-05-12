"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mealSchema, MealFormData } from "@/lib/schemas";
import { useAuth } from "@/contexts/AuthContext";

export default function MealsCRUD() {
    const { user } = useAuth();
    const [meals, setMeals] = useState<MealFormData[]>([]);
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<MealFormData>({
        resolver: zodResolver(mealSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            time: new Date().toTimeString().slice(0, 5),
        }
    });

    // Carrega os dados locais ao iniciar
    useEffect(() => {
        if (user) {
            const storedMeals = localStorage.getItem(`meals_${user.uid}`);
            if (storedMeals) {
                setMeals(JSON.parse(storedMeals));
            }
        }
    }, [user]);

    // Salva no localStorage sempre que o array de refeições mudar
    useEffect(() => {
        if (user && meals.length > 0) {
            localStorage.setItem(`meals_${user.uid}`, JSON.stringify(meals));
        } else if (user && meals.length === 0) {
            localStorage.removeItem(`meals_${user.uid}`); // Limpa se estiver vazio
        }
    }, [meals, user]);

    const onSubmit = (data: MealFormData) => {
        if (editingId) {
            // Editar existente
            setMeals(meals.map(meal => meal.id === editingId ? { ...data, id: editingId } : meal));
            setEditingId(null);
        } else {
            // Criar novo
            const newMeal = { ...data, id: crypto.randomUUID() };
            setMeals([...meals, newMeal]);
        }
        reset({ date: data.date, time: data.time }); // Mantém data e hora atuais para facilitar múltiplos registros
    };

    const handleEdit = (meal: MealFormData) => {
        setEditingId(meal.id!);
        setValue("description", meal.description);
        setValue("calories", meal.calories);
        setValue("type", meal.type);
        setValue("date", meal.date);
        setValue("time", meal.time);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este registro?")) {
            setMeals(meals.filter(meal => meal.id !== id));
        }
    };

    const filteredMeals = meals.filter(meal => meal.date === filterDate);
    const totalCalories = filteredMeals.reduce((acc, meal) => acc + meal.calories, 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lado Esquerdo: Formulário */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4">{editingId ? "Editar Refeição" : "Nova Refeição"}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-black">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descrição do Alimento</label>
                        <input {...register("description")} className="w-full p-2 border rounded mt-1" placeholder="Ex: Tapioca com queijo" />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Calorias (kcal)</label>
                            <input type="number" {...register("calories")} className="w-full p-2 border rounded mt-1" />
                            {errors.calories && <p className="text-red-500 text-xs mt-1">{errors.calories.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo</label>
                            <select {...register("type")} className="w-full p-2 border rounded mt-1 bg-white">
                                <option value="">Selecione...</option>
                                <option value="café">Café da Manhã</option>
                                <option value="almoço">Almoço</option>
                                <option value="lanche">Lanche</option>
                                <option value="jantar">Jantar</option>
                                <option value="ceia">Ceia</option>
                            </select>
                            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Data</label>
                            <input type="date" {...register("date")} className="w-full p-2 border rounded mt-1" />
                            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hora</label>
                            <input type="time" {...register("time")} className="w-full p-2 border rounded mt-1" />
                            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                            {editingId ? "Salvar Alterações" : "Adicionar Refeição"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={() => { setEditingId(null); reset(); }}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Lado Direito: Listagem */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Consumo do Dia</h2>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="p-1 border rounded text-sm text-black"
                    />
                </div>

                <div className="grow overflow-y-auto space-y-3">
                    {filteredMeals.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center mt-10">Nenhum registro encontrado para esta data.</p>
                    ) : (
                        filteredMeals.map((meal) => (
                            <div key={meal.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                                <div>
                                    <p className="font-semibold text-gray-800 capitalize">{meal.description}</p>
                                    <p className="text-xs text-gray-500 capitalize">{meal.type} • {meal.time}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-blue-600">{meal.calories} kcal</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(meal)} className="text-gray-400 hover:text-blue-500 text-sm">Editar</button>
                                        <button onClick={() => handleDelete(meal.id!)} className="text-gray-400 hover:text-red-500 text-sm">Excluir</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Total Consumido:</span>
                    <span className="text-xl font-bold text-gray-900">{totalCalories} kcal</span>
                </div>
            </div>
        </div>
    );
}