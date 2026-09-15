import './style.css';
import './ui/style.css';
import { createGameUi } from './ui';

const app = document.querySelector<HTMLElement>('#app')!;
const game = createGameUi(app);
if (import.meta.hot) import.meta.hot.dispose(() => game.dispose());
