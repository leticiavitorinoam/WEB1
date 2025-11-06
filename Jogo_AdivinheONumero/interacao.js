let numeroSecreto;
let vidas;
let nivelSelecionado = 10;
let maxNumero = 100;

let numeroChute = document.getElementById("num1");
let resultado = document.getElementById("txtResultado");
let btnChutar = document.getElementById("btChutar");
let txtStatus = document.getElementById("status");
let btnVoltar = document.getElementById("btVoltar");
let voltarContainer = document.getElementById("voltar-container");
let msgNumero = document.getElementById("msgNumero");

let telaInicial = document.getElementById("tela-inicial");
let telaJogo = document.getElementById("tela-jogo");

// Aplica o fade inicial
window.addEventListener("load", () => {
    telaInicial.classList.add("mostrar");
});

// Botões de níveis
document.getElementById("nivel-facil").addEventListener("click", function() {
    nivelSelecionado = 10;
    maxNumero = 100;
    msgNumero.innerHTML = "<strong>O número secreto está entre 1 e 100.</strong>";
    mudarTela(telaInicial, telaJogo);
});

document.getElementById("nivel-medio").addEventListener("click", function() {
    nivelSelecionado = 5;
    maxNumero = 100;
    msgNumero.innerHTML = "<strong>O número secreto está entre 1 e 100.</strong>";
    mudarTela(telaInicial, telaJogo);
});

document.getElementById("nivel-dificil").addEventListener("click", function() {
    nivelSelecionado = 10;
    maxNumero = 200;
    msgNumero.innerHTML = "<strong>O número secreto está entre 1 e 200.</strong>";
    mudarTela(telaInicial, telaJogo);
});

btnChutar.addEventListener("click", chutou);
btnVoltar.addEventListener("click", voltarMenu);

numeroChute.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        chutou(); 
    }
});

btnChutar.disabled = true;
numeroChute.disabled = true;

function mudarTela(telaAtual, proximaTela) {
    telaAtual.classList.remove("mostrar");
    setTimeout(() => {
        telaAtual.style.display = "none";
        proximaTela.style.display = "block";
        setTimeout(() => proximaTela.classList.add("mostrar"), 50);
        novoJogo();
    }, 800);
}

function novoJogo() {
    btnChutar.disabled = false;
    numeroChute.disabled = false;
    voltarContainer.style.display = "none";

    numeroSecreto = parseInt(Math.random() * maxNumero) + 1;
    vidas = nivelSelecionado;
    atualizarVidas();

    numeroChute.value = "";
    resultado.innerHTML = "";
    numeroChute.focus();
}

function chutou() {
    let num = Number(numeroChute.value);

    if (isNaN(num) || num < 1 || num > maxNumero) {
        alert(`O palpite tem que estar entre 1 e ${maxNumero}!`);
        numeroChute.value = "";
        numeroChute.focus();
        return;
    }

    if (num == numeroSecreto) {
        resultado.innerHTML += `<strong>🎉 Parabéns, você acertou!</strong><br>`;
        fimDeJogo();
    } else if (num > numeroSecreto) {
        resultado.innerHTML += `Palpite: ${num} - O número é Menor!<br>`;
        vidas--;
    } else if (num < numeroSecreto) {
        resultado.innerHTML += `Palpite: ${num} - O número é Maior!<br>`;
        vidas--;
    }

    atualizarVidas();
    numeroChute.value = "";
    numeroChute.focus();
}

function atualizarVidas() {
    txtStatus.innerHTML = "";
    for (let i = 1; i <= vidas; i++) {
        txtStatus.innerHTML += "♥ ";
    }
    if (vidas == 0) {
        resultado.innerHTML += `<strong>💀 Você perdeu! O número era ${numeroSecreto}.</strong>`;
        fimDeJogo();
    }
}

function fimDeJogo() {
    btnChutar.disabled = true;
    numeroChute.disabled = true;
    voltarContainer.style.display = "block";
}

function voltarMenu() {
    telaJogo.classList.remove("mostrar");
    setTimeout(() => {
        telaJogo.style.display = "none";
        telaInicial.style.display = "block";
        setTimeout(() => telaInicial.classList.add("mostrar"), 50);
        resultado.innerHTML = "";
    }, 800);
}

