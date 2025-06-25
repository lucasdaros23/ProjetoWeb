import { auth } from './index.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const createUserButton = document.getElementById('btGravar');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('senha');

  if (createUserButton && emailInput && passwordInput) {
    createUserButton.addEventListener('click', function (event) {
      event.preventDefault();
      createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
        .then(() => {
          alert('Cadastro bem-sucedido');
        })
        .catch((error) => {
          console.error(error.code);
          console.error(error.message);
          alert('Falha ao cadastrar, verifique o erro no console.');
        });
    });
  } else {
    console.error('Um ou mais elementos não foram encontrados no DOM');
  }
});
