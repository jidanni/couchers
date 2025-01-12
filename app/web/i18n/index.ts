import resources from "i18n/resources";
import i18n, { InitOptions } from "i18next";
import path from "path";
import { initReactI18next } from "react-i18next";

import { NAMESPACES } from "../i18n/namespaces";

const fallbackLng = {
  default: ["en"],
  zh: ["zh-Hans", "en"],
  "zh-CN": ["zh-Hans", "en"],
  "zh-HK": ["zh-Hant", "zh-Hans", "en"],
  "zh-SG": ["zh-Hans", "zh-Hant", "en"],
  "zh-TW": ["zh-Hant", "zh-Hans", "en"],
};

export const DEFAULT_LOCALE = "en";

export const COOKIE_NAME = "NEXT_LOCALE";

const initOptions: InitOptions = {
  resources,
  fallbackLng,
  defaultNS: "global",
  compatibilityJSON: "v4",
  debug: process.env.NODE_ENV === "development",
  ns: NAMESPACES,
  returnEmptyString: false,
  nonExplicitSupportedLngs: true, // Handle language codes like "zh-CN" and "zh-Hant" fallback to zh gracefully
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
  backend: {
    loadPath: (locale: string, namespace: string) => {
      if (namespace === "global") {
        return path.resolve(
          process.cwd(),
          `resources/locales/${locale.replace("-", "_")}.json`
        );
      }
      return path.resolve(
        process.cwd(),
        `features/${namespace}/locales/${locale.replace("-", "_")}.json`
      );
    },
  },
};

i18n.use(initReactI18next).init(initOptions);

export default i18n;
