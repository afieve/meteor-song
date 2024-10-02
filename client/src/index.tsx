import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MeteoriteDataContextProvider } from './context/MeteoriteDataContextProvider';
import { ClassificationsDataContextProvider } from './context/ClassificationsDataContextProvider';
import { Provider } from 'react-redux';
import { store } from './store/store';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    // <React.StrictMode>
    <MeteoriteDataContextProvider>
        <ClassificationsDataContextProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </ClassificationsDataContextProvider>
    </MeteoriteDataContextProvider>
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
