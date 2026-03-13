import { hydrateRoot } from 'react-dom/client';
import '../style.css';
import App from './app';

const root = document.getElementById('root');

if (root) {
  hydrateRoot(root, <App />);
}