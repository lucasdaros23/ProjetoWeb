import { auth } from './index.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

function aplicarTemaSalvo() {
  const themeLink = document.getElementById('theme-link');
  const temaSalvo = localStorage.getItem('tema');

  if (themeLink && temaSalvo) {
    themeLink.setAttribute('href', temaSalvo);
  }
}

function loadCabecalho() {
  const cabecalhoElemento = document.querySelector('.cabecalho');
  if (!cabecalhoElemento) {
    console.error('Elemento .cabecalho não encontrado');
    return;
  }

  aplicarTemaSalvo();

  onAuthStateChanged(auth, (user) => {
    let texto = `
      <a href="../index.html">Início</a>
      <a href="produtos.html">Produtos</a>
      <a href="sobre.html">Sobre nós</a>
      <a href="contato.html">Fale conosco</a>`;

    if (user) {
      texto += `
        <a href="carrinho.html">Carrinho</a>
        <button id="sair-btn" class="btn-sair">Sair</button>`;
    } else {
      texto += `<a href="login.html">Login</a>`;
    }

    texto += `<button id="contraste-btn" class="btn-contraste">Alto Contraste</button>`;

    cabecalhoElemento.innerHTML = texto;

    const sairBtn = document.getElementById('sair-btn');
    if (sairBtn) {
      sairBtn.addEventListener('click', () => {
        signOut(auth)
          .then(() => {
            alert('Você foi deslogado com sucesso.');
            window.location.href = 'login.html';
          })
          .catch((error) => {
            console.error('Erro ao deslogar:', error);
          });
      });
    }

    const contrasteBtn = document.getElementById('contraste-btn');
    const themeLink = document.getElementById('theme-link');

    if (contrasteBtn && themeLink) {
      contrasteBtn.addEventListener('click', () => {
        const atual = themeLink.getAttribute('href');
        const novoTema = atual === '../css/style.css'
          ? '../css/contraste.css'
          : '../css/style.css';

        themeLink.setAttribute('href', novoTema);
        localStorage.setItem('tema', novoTema);
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', loadCabecalho);
