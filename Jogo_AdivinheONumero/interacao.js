let numeroSecreto;
let vidas;

let numeroChute = document.getElementById("num1");
let resultado = document.getElementById("txtResultado");
let btnIniciar = document.getElementById("btIniciar");
let btnChutar = document.getElementById("btChutar");
let txtStatus = document.getElementById("status");


btnIniciar.addEventListener("click", novoJogo);
btnChutar.addEventListener("click", chutou);

numeroChute.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    chutou(); 
  }
});


btnChutar.disabled = true;
numeroChute.disabled = true;


function novoJogo() {
    btnChutar.disabled = false;
    numeroChute.disabled = false;

    numeroSecreto = parseInt(Math.random() * 100) + 1;
    vidas = 10;
    numvidas();

    numeroChute.value = "";
    resultado.innerHTML = "";
    numeroChute.focus();
}

function chutou() {
    let num = Number(numeroChute.value);
    if (num < 1 || num > 100) {
        alert("O número tem que estar entre 1 e 100! Perdeu uma vida!")
        vidas--;
    } else if (num == numeroSecreto) {
        resultado.innerHTML += "Parabéns, você acertou!"
    } else if (num > numeroSecreto) {
        resultado.innerHTML += "Palpite: " + num;
        resultado.innerHTML += " - O número é Menor!<br>"
        vidas--;

    } else if (num < numeroSecreto) {
        resultado.innerHTML += "Palpite: " + num;
        resultado.innerHTML += " - O número é Maior!<br>"
        vidas--;
    }
    numvidas();
    numeroChute.value = "";
    numeroChute.focus();

}
function numvidas() {
    txtStatus.innerHTML = "";
    for (let i = 1; i <= vidas; i++) {
        txtStatus.innerHTML += "+ "
    }
    if (vidas == 0) {
        resultado.innerHTML += "Você perdeu!"
        btnChutar.disabled = true;
        numeroChute.disabled = true;
    }

}