// ==========================================
// 1. IMPORTAÇÕES DOS MÓDULOS DO FIREBASE
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";

// Importações do Firebase Authentication
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

// Importações do Banco de Dados Realtime (Database)
import { 
    getDatabase, 
    ref, 
    set, 
    get, 
    child, 
    update 
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

// ==========================================
// 2. CONFIGURAÇÃO E INICIALIZAÇÃO
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyDY0MUFqLNdikiBYeIlPPEYvCl-1AOkTh4",
    authDomain: "projeto-estagio-6be49.firebaseapp.com",
    projectId: "projeto-estagio-6be49",
    storageBucket: "projeto-estagio-6be49.firebasestorage.app",
    messagingSenderId: "163566937029",
    appId: "1:163566937029:web:a3da954efaab039ef261ac",
    measurementId: "G-P455NRXN24"
};

// Inicializa os serviços passando a configuração do app
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

// ==========================================
// 3. FUNÇÕES DE AUTENTICAÇÃO E BANCO DE DADOS
// ==========================================

// Função global para cadastrar o usuário
window.cadastrar = async function() {
    // Captura o nome de usuário simples digitado no HTML
    const usuarioSimples = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;
    const mensagem = document.getElementById("mensagem");

    // Validação simples antes de enviar para o servidor
    if (!usuarioSimples || !senha) {
        if (mensagem) {
            mensagem.innerText = "Por favor, preencha o usuário e a senha!";
            mensagem.style.color = "#ffffff";
            mensagem.style.backgroundColor = "#2D4F2B";
            mensagem.style.padding = "6px";
            mensagem.style.borderRadius = "7px";
        } else {
            alert("Por favor, preencha o usuário e a senha!");
        }
        return;
    }

    // TRUQUE DO SUFIXO: Transforma o usuário simples em formato de email para o Auth
    const emailMascarado = `${usuarioSimples}@portal.local`;

    try {
        // 1. Tenta criar a credencial de acesso na aba Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, emailMascarado, senha);
        const user = userCredential.user;
        
        // 2. Salva o Usuário e a Senha em texto comum no Realtime Database
        // Ele cria um nó 'administradores/ID_DO_USUARIO' com as informações de cadastro
        await set(ref(database, 'administradores/' + user.uid), {
            usuario: usuarioSimples,
            senha: senha,
            emailCriado: emailMascarado,
            dataCadastro: new Date().toLocaleString("pt-BR")
        });

        // Mensagem de sucesso estilizada na tela
        if (mensagem) {
            mensagem.innerText = `Usuário ${usuarioSimples} cadastrado com sucesso!`;
            mensagem.style.color = "#D28F01";
            mensagem.style.backgroundColor = "#2D4F2B";
            mensagem.style.padding = "6px";
            mensagem.style.borderRadius = "7px";
        } else {
            alert(`Usuário ${usuarioSimples} criado e salvo com sucesso!`);
        }

        // Limpa os campos após o sucesso
        document.getElementById("usuario").value = "";
        document.getElementById("senha").value = "";

        // Redireciona para o index.html após o cadastro bem-sucedido
        setTimeout(() => {
            window.location.href = "../../index.html";
        }, 2000); // Aguarda 2 segundos para o usuário ver a mensagem de sucesso

    } catch (error) {
        console.error("Erro ao cadastrar e salvar:", error);
        
        // Se o usuário já existe, tenta fazer login em vez de mostrar erro
        if (error.code === "auth/email-already-in-use") {
            try {
                // Tenta fazer login com as credenciais fornecidas
                const loginCredential = await signInWithEmailAndPassword(auth, emailMascarado, senha);
                
                // Se conseguiu fazer login, mostra mensagem de sucesso
                if (mensagem) {
                    mensagem.innerText = `Bem-vindo ${usuarioSimples}! Acessando sua conta...`;
                    mensagem.style.color = "#D28F01";
                    mensagem.style.backgroundColor = "#2D4F2B";
                    mensagem.style.padding = "6px";
                    mensagem.style.borderRadius = "7px";
                } else {
                    alert(`Bem-vindo ${usuarioSimples}!`);
                }

                // Limpa os campos
                document.getElementById("usuario").value = "";
                document.getElementById("senha").value = "";

                // Redireciona para o index.html
                setTimeout(() => {
                    window.location.href = "../../index.html";
                }, 2000);

            } catch (loginError) {
                // Se o login falhar (senha errada), mostra erro
                console.error("Erro ao fazer login:", loginError);
                if (mensagem) {
                    if (loginError.code === "auth/wrong-password" || loginError.code === "auth/invalid-credential") {
                        mensagem.innerText = "Usuário existe, mas a senha está incorreta!";
                    } else {
                        mensagem.innerText = `Erro ao acessar: ${loginError.message}`;
                    }
                    mensagem.style.color = "#ffffff";
                    mensagem.style.backgroundColor = "#b32424";
                    mensagem.style.padding = "6px";
                    mensagem.style.borderRadius = "7px";
                } else {
                    alert(`Erro: ${loginError.message}`);
                }
            }
        } else if (mensagem) {
            // Tratamentos amigáveis de mensagens de erro na tela para outros erros
            if (error.code === "auth/weak-password" || error.message.includes("weak")) {
                mensagem.innerText = "A senha deve ter pelo menos 6 caracteres";
            } else {
                mensagem.innerText = `Erro: ${error.message}`;
            }
            mensagem.style.color = "#ffffff";
            mensagem.style.backgroundColor = "#b32424";
            mensagem.style.padding = "6px";
            mensagem.style.borderRadius = "7px";
        } else {
            alert(`Erro: ${error.message}`);
        }
    }
};