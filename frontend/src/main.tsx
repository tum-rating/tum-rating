import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {I18nextProvider} from "react-i18next";

import enTranslation from './i18n/en.json';
import deTranslation from './i18n/de.json';
import plTranslation from './i18n/pl.json';
i18n
    .use(LanguageDetector)
    .init({
        resources: {
            en: { translation: enTranslation },
            de: { translation: deTranslation },
            pl: { translation: plTranslation },
        },
        fallbackLng: 'en', // Default language fallback
        debug: true, // Set to false in production
        interpolation: {
            escapeValue: false, // React handles this
        },
    });


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <I18nextProvider i18n={i18n}>
            <App/>
        </I18nextProvider>
    </React.StrictMode>,
)
