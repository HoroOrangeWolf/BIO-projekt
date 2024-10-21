import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import core_pl from "./components/translations/pl/core.json";
import core_en from "./components/translations/en/core.json";
import system_pl from "./components/system/translations/pl/system.json";
import system_en from "./components/system/translations/en/system.json";

i18n.use(initReactI18next).init({
    lng: window.localStorage.lng || "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    },
    resources: {
        en: {
            core: core_en,
            system: system_en,
        },
        pl: {
            core: core_pl,
            system: system_pl,
        }
    }
});