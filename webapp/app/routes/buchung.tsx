import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "~/components/app_shell";
import { useAppHeaderStore } from "~/stores/app_header";

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { setHeader } = useAppHeaderStore();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setHeader({
      title: t("checkout.title"),
      type: "overlay",
      icon: "cross",
    });
  }, [setHeader, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AppShell title={t("checkout.title")}>
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4 text-5xl">✅</div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("checkout.success")}
          </h2>
          <p className="mt-3 text-gray-600">{t("checkout.successMessage")}</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={t("checkout.title")}>
      <form onSubmit={handleSubmit} className="space-y-5 px-4 py-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {t("checkout.firstName")}
          </label>
          <input
            type="text"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {t("checkout.lastName")}
          </label>
          <input
            type="text"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {t("checkout.email")}
          </label>
          <input
            type="email"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-primary py-3 text-center font-semibold text-white shadow-md transition-transform active:scale-[0.98]"
        >
          {t("checkout.submit")}
        </button>
      </form>
    </AppShell>
  );
}
