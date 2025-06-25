import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';
import { auth } from './index.js';

document.addEventListener('DOMContentLoaded', () => {
    const adminEmail = "administrador@adm.com";
    const adminBtn = document.getElementById('admin-btn');
    const sairBtn = document.getElementById('sair-btn');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (user.email === adminEmail) {
                adminBtn.style.display = 'block';
            } else {
                adminBtn.style.display = 'none';
            }
        } else {
            window.location.href = 'login.html';
        }
    });

    if (sairBtn) {
        sairBtn.addEventListener('click', () => {
            signOut(auth).then(() => {
                alert('Você foi deslogado com sucesso.');
                window.location.href = 'login.html';
            }).catch((error) => {
                console.error('Erro ao deslogar:', error);
            });
        });
    }

    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            window.location.href = 'adm.html';
        });
    }
});
