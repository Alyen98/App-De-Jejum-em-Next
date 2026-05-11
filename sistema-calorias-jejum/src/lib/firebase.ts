import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Utilizamos process.env para buscar as chaves do seu arquivo .env.local
// Isso garante que suas credenciais não vão parar no GitHub!
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Padrão do Next.js para evitar inicializar o Firebase múltiplas vezes durante o desenvolvimento
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa o módulo de Autenticação
const auth = getAuth(app);

// Exporta o app e o auth para que as páginas de Login e Cadastro possam usá-los
export { app, auth };