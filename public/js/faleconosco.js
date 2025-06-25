import { getDatabase, ref, push, set } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

const db = getDatabase();
const auth = getAuth();

document.querySelector('.form-fale').addEventListener('submit', function(event) {
  event.preventDefault();

  const user = auth.currentUser;

  if (!user) {
    alert('Você precisa estar logado para enviar uma mensagem.');
    return;
  }

  const mensagem = document.querySelector('textarea[name="message"]').value;
  const userId = user.uid;

  const novaMensagemRef = push(ref(db, 'Usuarios/' + user.uid + '/mensagens'));

  set(novaMensagemRef, {
    mensagem: mensagem,
    data: new Date().toISOString()
  }).then(() => {
    alert('Mensagem enviada com sucesso!');
    document.querySelector('.form-fale').reset(); 
  }).catch((error) => {
    console.error('Erro ao enviar mensagem: ', error);
  });
});
