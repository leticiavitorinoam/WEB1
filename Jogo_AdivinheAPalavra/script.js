
document.addEventListener('DOMContentLoaded', async () => {

  let palavrasFacil = [];
  let palavrasDificil = [];
  let palavrasAtuais = [];
  let palavraAtual = "";
  let exibicao = [];
  let vidas = 6;
  let modo = ""; 

  const menu = document.getElementById("menu");
  const jogo = document.getElementById("jogo");
  const popup = document.getElementById("popup");
  const popupMsg = document.getElementById("popup-msg");
  const popupBtn = document.getElementById("popup-btn");

  const btnFacil = document.getElementById("nivel-facil");
  const btnDificil = document.getElementById("nivel-dificil");
  const btnReiniciar = document.getElementById("btn_reiniciar");

  const imgMenino = document.getElementById("img-menino");
  const palavraHTML = document.getElementById("palavra");
  const tecladoBox = document.getElementById("box-teclado");

  menu.classList.remove('escondido');
  jogo.classList.add('escondido');
  popup.classList.add('escondido');

  try {
    const res = await fetch('fases.json', {cache: "no-store"});
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    palavrasFacil = Array.isArray(data.facil) ? data.facil.map(s => String(s).toUpperCase()) : [];
    palavrasDificil = Array.isArray(data.dificil) ? data.dificil.map(s => String(s).toUpperCase()) : [];

  } catch (err) {
    console.error('Falha ao carregar fases.json, usando listas padrão. Erro:', err);

    palavrasFacil = ['ABACAXI','MELANCIA','BANANA'];
    palavrasDificil = ['CEREJEIRA','FRAMBOESA','GROSELHA'];
  }


  btnFacil.addEventListener('click', () => iniciarJogo('facil'));
  btnDificil.addEventListener('click', () => iniciarJogo('dificil'));
  btnReiniciar.addEventListener('click', voltarParaMenu);
  popupBtn.addEventListener('click', () => {

    popup.classList.add('escondido');
    if (palavrasAtuais.length === 0) {
      voltarParaMenu();
    } else {
      novoJogo();
    }
  });

 
  function iniciarJogo(m) {
    modo = m;

    const origem = modo === 'facil' ? palavrasFacil.slice() : palavrasDificil.slice();
    palavrasAtuais = origem.slice();
    embaralhar(palavrasAtuais);

    menu.classList.add('escondido');
    jogo.classList.remove('escondido');

    novoJogo();
  }

  function voltarParaMenu() {
    menu.classList.remove('escondido');
    jogo.classList.add('escondido');
    popup.classList.add('escondido');
    palavraHTML.textContent = '';
    tecladoBox.innerHTML = '';
    imgMenino.src = 'assets/menino1.png';
  }


  function novoJogo() {

    if (!Array.isArray(palavrasAtuais) || palavrasAtuais.length === 0) {

      popupMsg.textContent = 'Sem palavras para esse modo. Volte ao menu.';
      popup.classList.remove('escondido');
      return;
    }

    vidas = 6;
    imgMenino.src = 'assets/menino1.png';

    palavraAtual = String(palavrasAtuais[0] || '').toUpperCase();
    if (!palavraAtual) {
      popupMsg.textContent = 'Palavra inválida. Voltando ao menu.';
      popup.classList.remove('escondido');
      return;
    }

    exibicao = Array.from({length: palavraAtual.length}, () => '_');
    palavraHTML.textContent = exibicao.join(' ');

    criarTeclado();
  }


  function criarTeclado() {
    tecladoBox.innerHTML = '';
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (const l of letras) {
      const b = document.createElement('button');
      b.textContent = l;
      b.className = 'tecla';
      b.disabled = false;
      b.addEventListener('click', () => verificarLetra(l, b));
      tecladoBox.appendChild(b);
    }
  }

  function verificarLetra(letra, botao) {
    if (!botao || botao.disabled) return;
    botao.disabled = true;

    let acertou = false;
    for (let i = 0; i < palavraAtual.length; i++) {
      if (palavraAtual[i] === letra) {
        exibicao[i] = letra;
        acertou = true;
      }
    }

    if (!acertou) {
      vidas--;
      const passo = Math.min(7, 7 - vidas);
      imgMenino.src = `assets/menino${passo}.png`;
    }

    palavraHTML.textContent = exibicao.join(' ');

    if (!exibicao.includes('_')) {
      palavrasAtuais.shift();
      mostrarPopup(true);
      return;
    }

    if (vidas <= 0) {
      palavraHTML.textContent = palavraAtual.split('').join(' ');
      palavrasAtuais.shift(); 
      mostrarPopup(false);
      return;
    }
  }

  function mostrarPopup(vitoria) {
    if (vitoria === true) {
      popupMsg.textContent = `Você acertou! 🎉 — ${palavraAtual}`;
    } else if (vitoria === false) {
      popupMsg.textContent = `Você perdeu. A palavra era: ${palavraAtual}`;
    } else {
      popupMsg.textContent = String(vitoria || '');
    }
    popup.classList.remove('escondido');
  }

  function embaralhar(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

});
