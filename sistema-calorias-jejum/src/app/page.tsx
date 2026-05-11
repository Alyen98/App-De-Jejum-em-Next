export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8 font-(family-name:--font-geist-sans)]">
      <main className="grow flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Sistema de Registro de Calorias e Jejum</h1>
        <p className="mt-4 text-gray-600">Ambiente de desenvolvimento configurado.</p>
      </main>

      <footer className="w-full text-center py-4 border-t border-gray-200 mt-8">
        <p className="text-xs text-gray-500 max-w-2xl mx-auto">
          Aviso: este sistema é um exercício acadêmico. As informações aqui presentes preferem uma abordagem neutra e informativa. A aplicação não substitui, em hipótese alguma, a orientação médica ou nutricional de um profissional qualificado.
        </p>
      </footer>
    </div>
  );
}