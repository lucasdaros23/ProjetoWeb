import { auth } from './index.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        const loginLink = document.querySelector('a[href="login.html"]');

        if (user) {
            if (window.location.pathname.endsWith('login.html')) {
                window.location.href = "../html/inicio.html";
            }
        } else {
            if (loginLink) {
                loginLink.addEventListener('click', (event) => {
                    event.preventDefault();
                    window.location.href = "../src/login.html";
                });
            } else {
                console.error('O link de login não foi encontrado.');
            }
        }
    });
});
