import {createRoot} from 'react-dom/client';
import './index.css';
import {App, AppWithCustomUI} from './App';

createRoot(document.getElementById('root')!).render(<AppWithCustomUI />);
