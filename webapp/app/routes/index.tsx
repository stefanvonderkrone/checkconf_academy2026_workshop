import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useAppHeaderStore } from "~/stores/app_header";

export default function IndexPage() {
  const { t } = useTranslation();
  const { setHeader } = useAppHeaderStore();

  useEffect(() => {
    setHeader({ title: t("home.greeting"), type: "default", icon: "arrow" });
  }, [setHeader, t]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 text-center text-gray-900">
        <h1 className="text-4xl font-bold tracking-tight">
          {t("home.title")}
        </h1>
        <p className="mt-4 text-lg text-gray-600">{t("home.subtitle")}</p>
        <Link
          to="/suche/hotel"
          className="mt-8 rounded-2xl bg-blue-900 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95"
        >
          {t("home.searchButton")}
        </Link>
      </div>
    </div>
  );
}
