import { auth, db } from './index.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';
import { ref, set } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js';

const form = document.getElementById("meuForm");
const varNome = document.getElementById("nome");
const varEmail = document.getElementById("email");
const varSenha = document.getElementById("senha");
const botao = document.getElementById("btGravar");

form.addEventListener("submit", function(event) {
  event.preventDefault();
  botao.disabled = true;

  const nome = varNome.value.trim();
  const email = varEmail.value.trim();
  const senha = varSenha.value;

  createUserWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      const user = userCredential.user;
      return set(ref(db, "Usuarios/" + user.uid), {
        nome: nome,
        Email: email,
        Senha: senha
      });
    })
    .then(() => {
      alert("Usuário cadastrado com sucesso!");
      form.reset();
    })
    .catch((error) => {
      console.error("Erro ao cadastrar:", error.code, error.message);
      alert("Erro: " + error.message);
    })
    .finally(() => {
      botao.disabled = false;
    });
});
