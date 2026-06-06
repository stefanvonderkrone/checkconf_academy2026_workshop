import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { patchHistory, setDirectionSetter } from "~/utility/view_transitions";
import { HistoryBus } from "~/utility/history_bus";
import { useViewTransitionStore } from "~/stores/view_transition";
import { useAppHeaderStore } from "~/stores/app_header";
import { appBridge } from "~/utility/native_app/bridge";

patchHistory(HistoryBus);
setDirectionSetter(useViewTransitionStore.getState().setDirection);
useAppHeaderStore.subscribe((state) => {
  appBridge.replaceHeaderContent(state.header.type, state.header.title);
  appBridge.showNavigationIcon(state.header.icon);
});

await i18next
  .use(initReactI18next)
  .use(HttpBackend)
  .use(LanguageDetector)
  .init({
    fallbackLng: "de",
    supportedLngs: ["de", "en"],
    ns: ["translation"],
    defaultNS: "translation",
    backend: { loadPath: "/api/locales/{{lng}}/{{ns}}" },
    detection: { order: ["cookie", "navigator"], caches: ["cookie"] },
  });

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
