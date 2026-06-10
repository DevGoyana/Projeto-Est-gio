// Função para alternar a visibilidade da senha (Olho aberto / fechado)
function MostrarSenha() {
    const senha = document.getElementById("senha");
    const icone = document.getElementById("iconeSenha");

    if (senha.type === "text") {
        senha.type = "password";
        icone.classList.remove("fa-eye");
        icone.classList.add("fa-eye-slash");
    } else {
        senha.type = "text";
        icone.classList.remove("fa-eye-slash");
        icone.classList.add("fa-eye");
    }
}