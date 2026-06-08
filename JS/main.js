function abrirLogin() {

    document.body.classList.add("fade-out");

    setTimeout(() => {
        window.location.href = "/ADMIN/admin.html";
    }, 500);

}

/* Barra deslizante da navbar */

const links = document.querySelectorAll(".navbar a");
const indicator = document.querySelector(".indicator");

function moveIndicator(element){

    if(!element) return;

    const li = element.parentElement;

    indicator.style.width = `${element.offsetWidth}px`;
    indicator.style.left = `${li.offsetLeft}px`;

}
/* Estado inicial */
window.addEventListener("load", () => {

    const ativo = document.querySelector(".navbar a.ativo");

    if(ativo){
        moveIndicator(ativo);
    }

});

/* Hover */

links.forEach(link => {

    link.addEventListener("mouseenter", () => {

        moveIndicator(link);

    });

});

/* Volta para o item ativo ao sair da navbar */

document.querySelector(".navbar").addEventListener("mouseleave", () => {

    const ativo = document.querySelector(".navbar a.ativo");

    moveIndicator(ativo);

});

/* Clique */

links.forEach(link => {

    link.addEventListener("click", () => {

        links.forEach(item => {
            item.classList.remove("ativo");
        });

        link.classList.add("ativo");

        moveIndicator(link);

    });

});
const secoes = document.querySelectorAll("section");

window.addEventListener("scroll", () => {

    let atual = "";

    secoes.forEach(secao => {

        const topo = secao.offsetTop - 150;

        if(scrollY >= topo){
            atual = secao.getAttribute("id");
        }

    });

    links.forEach(link => {

        link.classList.remove("ativo");

        if(link.getAttribute("href") === `#${atual}`){

            link.classList.add("ativo");
            moveIndicator(link);

        }

    });

});