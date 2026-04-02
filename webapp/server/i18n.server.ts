import { createInstance } from "i18next";
import FsBackend from "i18next-fs-backend";
import { resolve } from "node:path";

export const createI18nServer = async (lng: string) => {
  const instance = createInstance();
  await instance.use(FsBackend).init({
    lng,
    fallbackLng: "de",
    supportedLngs: ["de", "en"],
    ns: ["translation"],
    defaultNS: "translation",
    backend: {
      loadPath: resolve("./app/locales/{{lng}}/{{ns}}.json"),
    },
  });
  return instance;
};
