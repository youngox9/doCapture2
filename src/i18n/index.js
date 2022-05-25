import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from "react-i18next";
import { dispatch } from "@/utils";
import { setLanguages } from "@/reducers/global";
import store from "@/store";

const EXCEL_ID = "1MNj6xaT8d8CJ3VljSn2qifLSiBGT6aejMcEE5W9-aMM";
const EXCEL_URL = `https://docs.google.com/spreadsheets/d/${EXCEL_ID}/gviz/tq?tqx=out:json`;

// const temp = require(EXCEL_URL);

// console.log(temp);
function parseData(data) {
    const json = JSON.parse(data.substr(47).slice(0, -2)) || {};
    const rows = json?.table?.rows || [];
    const [thead = [], ...tbody] = rows.map(obj => obj.c.filter(o => o?.v).map(o => o?.v || ""));
    const [key, ...langs] = thead;
    const temp = tbody.map(obj => obj.reduce((p, o, idx) => ({ ...p, [thead[idx]]: o }), {}));
    const messages = langs.reduce((prev, lang) => ({
        ...prev,
        [lang]: {
            ...temp.reduce((p, obj) => ({
                ...p,
                [obj[key]]: obj[lang]
            }), {}),
        }
    }), {});
    return messages;
}

// console.log(store.getState()?.global?.lang);
i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: store.getState()?.global?.lang || 'en_us',
        interpolation: {
            escapeValue: true,
        },
        react: {
            bindStore: 'languageChanged loaded added removed',
            bindI18n: 'languageChanged loaded added removed',
            useSuspense: true,
            bindI18nStore: '',
            transEmptyNodeValue: '',
        }
    }, (err, t) => {
        if (err) return console.log('something went wrong loading', err);
    });

async function getResource() {
    const res = await fetch(EXCEL_URL);
    const text = await res.text();
    const data = parseData(text);
    const langs = Object.keys(data);
    langs.map(k => {
        i18next.addResourceBundle(k, 'translation', data[k]);
    });
    i18next.reloadResources();
    // i18next.changeLanguage('en_us');
    dispatch(setLanguages(langs));
}

getResource();

export default i18next;
