import { db, auth } from './index.js';
import {
  ref,
  get,
  set,
  update,
  remove
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const galeria = document.getElementById('galeria-produtos');
  let listaProdutos = [];
  let currentUser = null;

  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    carregarProdutos();
  });

  async function carregarProdutos() {
    const produtosRef = ref(db, 'produtos');
    const snapshot = await get(produtosRef);

    if (!snapshot.exists()) {
      galeria.innerHTML = '<p>Nenhum produto cadastrado.</p>';
      return;
    }

    const dados = snapshot.val();
    listaProdutos = Object.entries(dados).map(([id, p]) => ({
      id,
      ...p
    }));

    renderizarProdutos(listaProdutos);
  }

  function renderizarProdutos(produtos) {
    galeria.innerHTML = '';
    produtos.forEach(produto => {
      const podeRemover = currentUser && produto.userId === currentUser.uid;
      const card = document.createElement('div');
      card.className = 'produto-card';
      card.innerHTML = `
        <h2 class="produto-nome">${produto.nome}</h2>
        <p class="produto-descricao">${produto.descricao}</p>
        <p class="produto-preco">R$ ${produto.preco.toFixed(2)}</p>
        <p class="produto-usuario">Adicionado por: ${produto.userName || 'Usuário desconhecido'}</p>
        ${podeRemover ? `<button class="enviar-fale" data-id="${produto.id}" data-action="remover">Remover</button>` : ''}
        <button class="btn-add-carrinho" data-id="${produto.id}" data-action="carrinho">Adicionar ao Carrinho</button>
      `;
      galeria.appendChild(card);
    });
  }

  galeria.addEventListener('click', async (e) => {
    const id = e.target.dataset.id;
    const action = e.target.dataset.action;
    if (!id || !action) return;

    const produto = listaProdutos.find(p => p.id === id);
    if (!produto) {
      alert('Produto não encontrado.');
      return;
    }

    if (action === 'remover') {
      if (!currentUser) {
        alert('Você precisa estar logado para remover produtos.');
        return;
      }

      if (produto.userId !== currentUser.uid) {
        alert('Você só pode remover produtos que adicionou.');
        return;
      }

      const confirmacao = confirm('Remover este produto?');
      if (confirmacao) {
        await remove(ref(db, `produtos/${id}`));
        alert('Removido com sucesso!');
        await carregarProdutos();
      }
    }

    if (action === 'carrinho') {
      if (!currentUser) {
        alert('Você precisa estar logado para adicionar ao carrinho.');
        return;
      }

      const carrinhoRef = ref(db, `usuarios/${currentUser.uid}/carrinho/${produto.id}`);
      const snapshot = await get(carrinhoRef);

      if (snapshot.exists()) {
        const qtdAtual = snapshot.val().quantidade || 1;
        await update(carrinhoRef, { quantidade: qtdAtual + 1 });
      } else {
        await set(carrinhoRef, {
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1
        });
      }

      alert(`"${produto.nome}" adicionado ao carrinho!`);
    }
  });

  function addOrdenacao(id, ordenaFunc) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        const ordenado = [...listaProdutos].sort(ordenaFunc);
        renderizarProdutos(ordenado);
      });
    }
  }

  addOrdenacao('ordenar-alfabetico', (a, b) => a.nome.localeCompare(b.nome));
  addOrdenacao('ordenar-preco-crescente', (a, b) => a.preco - b.preco);
  addOrdenacao('ordenar-preco-decrescente', (a, b) => b.preco - a.preco);
  addOrdenacao('ordenar-recentes', (a, b) => getIdNum(b.id) - getIdNum(a.id));
  addOrdenacao('ordenar-antigos', (a, b) => getIdNum(a.id) - getIdNum(b.id));

  function getIdNum(id) {
    return parseInt(id.replace('produto', '')) || 0;
  }
});
