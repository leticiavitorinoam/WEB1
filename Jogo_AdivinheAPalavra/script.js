// script.js - versão robusta
document.addEventListener('DOMContentLoaded', async () => {

  // --- estado ---
  let palavrasFacil = [];
  let palavrasDificil = [];
  let palavrasAtuais = [];
  let palavraAtual = "";
  let exibicao = [];
  let vidas = 6;
  let modo = ""; // "facil" ou "dificil"

  // --- elementos ---
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

  // --- inicialização visual segura ---
  // garante que menu esteja visível e popup escondido no início
  menu.classList.remove('escondido');
  jogo.classList.add('escondido');
  popup.classList.add('escondido');

  // --- carregar JSON com tratamento de erro ---
  try {
    const res = await fetch('fases.json', {cache: "no-store"});
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    palavrasFacil = Array.isArray(data.facil) ? data.facil.map(s => String(s).toUpperCase()) : [];
    palavrasDificil = Array.isArray(data.dificil) ? data.dificil.map(s => String(s).toUpperCase()) : [];

  } catch (err) {
    console.error('Falha ao carregar fases.json, usando listas padrão. Erro:', err);
    // fallback para evitar travar
    palavrasFacil = ['ABACAXI','MELANCIA','BANANA'];
    palavrasDificil = ['CEREJEIRA','FRAMBOESA','GROSELHA'];
  }

  // --- listeners do menu ---
  btnFacil.addEventListener('click', () => iniciarJogo('facil'));
  btnDificil.addEventListener('click', () => iniciarJogo('dificil'));
  btnReiniciar.addEventListener('click', voltarParaMenu);
  popupBtn.addEventListener('click', () => {
    // ao clicar em "Jogar outra" começa próxima palavra do mesmo modo
    popup.classList.add('escondido');
    if (palavrasAtuais.length === 0) {
      voltarParaMenu();
    } else {
      novoJogo();
    }
  });

  // --- iniciar Jogo (após escolher modo) ---
  function iniciarJogo(m) {
    modo = m;
    // copia e embaralha a lista para aquele modo
    const origem = modo === 'facil' ? palavrasFacil.slice() : palavrasDificil.slice();
    palavrasAtuais = origem.slice();
    embaralhar(palavrasAtuais);

    // esconder menu, mostrar jogo
    menu.classList.add('escondido');
    jogo.classList.remove('escondido');

    novoJogo();
  }

  // --- volta para menu (reiniciar fluxo) ---
  function voltarParaMenu() {
    menu.classList.remove('escondido');
    jogo.classList.add('escondido');
    popup.classList.add('escondido');
    palavraHTML.textContent = '';
    tecladoBox.innerHTML = '';
    imgMenino.src = 'assets/menino1.png';
  }

  // --- novoJogo: configura uma palavra ---
  function novoJogo() {
    // proteção se não houver palavras
    if (!Array.isArray(palavrasAtuais) || palavrasAtuais.length === 0) {
      // avisa e volta pro menu
      popupMsg.textContent = 'Sem palavras para esse modo. Volte ao menu.';
      popup.classList.remove('escondido');
      return;
    }

    vidas = 6;
    imgMenino.src = 'assets/menino1.png';

    // pega a primeira palavra da lista embaralhada
    palavraAtual = String(palavrasAtuais[0] || '').toUpperCase();
    // proteção caso palavra seja vazia
    if (!palavraAtual) {
      popupMsg.textContent = 'Palavra inválida. Voltando ao menu.';
      popup.classList.remove('escondido');
      return;
    }

    exibicao = Array.from({length: palavraAtual.length}, () => '_');
    palavraHTML.textContent = exibicao.join(' ');

    criarTeclado();
  }

  // --- cria teclado interativo ---
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

  // --- verifica letra clicada ---
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
      // proteção se imagem não existir: não trava
      imgMenino.src = `assets/menino${passo}.png`;
    }

    palavraHTML.textContent = exibicao.join(' ');

    if (!exibicao.includes('_')) {
      // remove a palavra usada da lista
      palavrasAtuais.shift();
      mostrarPopup(true);
      return;
    }

    if (vidas <= 0) {
      // mostra palavra e considera perdida
      palavraHTML.textContent = palavraAtual.split('').join(' ');
      palavrasAtuais.shift(); // também remove usada
      mostrarPopup(false);
      return;
    }
  }

  // --- exibe popup de fim com mensagem apropriada ---
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

  // --- util: embaralhar array in-place ---
  function embaralhar(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

}); // DOMContentLoaded end
