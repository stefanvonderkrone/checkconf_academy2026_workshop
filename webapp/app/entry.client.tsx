import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { patchHistory, HistoryBus } from "~/utility/history_bus";
import { useChangedSearchStore } from "~/stores/changed_search";
import { useAppHeaderStore } from "~/stores/app_header";
import { appBridge } from "~/utility/native_app/bridge";

patchHistory();

// Track every navigation globally (not per-route) so that pages reached from
// routes without `useChangedSearch` (e.g. the index page) still enter the
// history stack and can receive retroactive search-param updates.
HistoryBus.subscribe((action, loc) => {
  const newLocation = {
    pathname: loc.pathname,
    search: loc.search,
    originalSearch: loc.search,
    key: loc.state?.key ?? "",
    idx: loc.state?.idx ?? 0,
  };

  const store = useChangedSearchStore.getState();
  if (action === "PUSH") store.push(newLocation);
  if (action === "REPLACE") store.replace(newLocation);
  if (action === "POP") store.pop(newLocation);
});

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
