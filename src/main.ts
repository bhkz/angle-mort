import './style.css';

const app = document.querySelector<HTMLElement>('#app');

if (!app) {
  throw new Error('Élément #app introuvable.');
}

const title = document.createElement('h1');
title.textContent = 'Angle Mort';
app.append(title);
