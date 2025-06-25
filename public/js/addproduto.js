import { db, auth } from './index.js';
import { ref, set, get } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const addProductForm = document.getElementById('add-product-form');
  let currentUser = null;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
    } else {
      currentUser = null;
      alert('Você precisa estar logado para adicionar produtos.');
    }
  });

  addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert('Usuário não autenticado.');
      return;
    }

    const nome = document.getElementById('nome').value.trim();
    const categoria = document.getElementById('categoria').value;
    const preco = document.getElementById('preco').value;
    const descricao = document.getElementById('descricao').value.trim();

    if (!nome || !categoria || !preco || !descricao) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const produtoId = await obterProximoId();
    const produtoRef = ref(db, `produtos/produto${produtoId}`);

    try {
      await set(produtoRef, {
        nome,
        categoria,
        preco: Number(preco),
        descricao,
        userId: currentUser.uid,
        userName: currentUser.nome || currentUser.email || 'Usuário sem nome'
      });

      alert('Produto adicionado com sucesso!');
      addProductForm.reset();
    } catch (err) {
      console.error('Erro ao adicionar:', err);
      alert('Erro ao adicionar produto.');
    }
  });

  async function obterProximoId() {
    const snapshot = await get(ref(db, 'produtos'));
    if (!snapshot.exists()) return 1;
    const produtos = snapshot.val();
    const ids = Object.keys(produtos);
    const numeros = ids.map(id => parseInt(id.replace('produto', ''), 10));
    return Math.max(...numeros) + 1;
  }
});
