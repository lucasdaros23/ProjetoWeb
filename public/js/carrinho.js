import { db, auth } from './index.js';
import {
  ref,
  get,
  remove
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const caixaCarrinho = document.getElementById('caixaCarrinho');

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      caixaCarrinho.innerHTML = '<p>Você precisa estar logado para ver o carrinho.</p>';
      return;
    }

    const carrinhoRef = ref(db, `usuarios/${user.uid}/carrinho`);
    const snapshot = await get(carrinhoRef);

    if (!snapshot.exists()) {
      caixaCarrinho.innerHTML = '<p>Seu carrinho está vazio.</p>';
      return;
    }

    const itens = snapshot.val();
    let total = 0;
    caixaCarrinho.innerHTML = '';

    Object.entries(itens).forEach(([id, item]) => {
      const subtotal = item.preco * item.quantidade;
      total += subtotal;

      const div = document.createElement('div');
      div.className = 'item-carrinho';
      div.innerHTML = `
        <h3>${item.nome}</h3>
        <p>Preço: R$ ${item.preco.toFixed(2)}</p>
        <p>Quantidade: ${item.quantidade}</p>
        <p>Subtotal: R$ ${subtotal.toFixed(2)}</p>
        <button class="remover" data-id="${id}">Remover</button>
        <hr>
      `;
      caixaCarrinho.appendChild(div);
    });

    const totalEl = document.createElement('p');
    totalEl.className = 'total-carrinho';
    totalEl.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
    caixaCarrinho.appendChild(totalEl);
  });

  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('remover')) {
      const id = e.target.dataset.id;
      const user = auth.currentUser;
      if (user && id) {
        await remove(ref(db, `usuarios/${user.uid}/carrinho/${id}`));
        location.reload();
      }
    }
  });
});
