import { useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { AppShell } from "~/components/app_shell";
import { Quickfilter } from "~/components/quickfilter";
import { OfferCard } from "~/components/offer_card";
import { useAppHeaderStore } from "~/stores/app_header";
import { generateOffers, generateHotels } from "~/utility/mock_data";
import type { Board } from "~/types/hotel";
import type { Route } from "./+types/suche.angebot.$hotelId";

const allHotels = generateHotels(200);

export async function loader({ params, request }: Route.LoaderArgs) {
  const { hotelId } = params;
  const hotel = allHotels.find((h) => h.id === hotelId);
  const url = new URL(request.url);
  const boardParam = url.searchParams.get("board") as Board | null;
  const maxPriceParam = url.searchParams.get("maxPrice");

  let offers = generateOffers(hotelId, 50);

  if (boardParam) {
    offers = offers.filter((o) => o.board === boardParam);
  }
  if (maxPriceParam) {
    const maxPrice = Number(maxPriceParam);
    offers = offers.filter((o) => o.price <= maxPrice);
  }

  return {
    offers,
    hotelName: hotel?.name ?? "Unbekanntes Hotel",
    total: offers.length,
  };
}

export default function OfferListPage() {
  const { offers, hotelName, total } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const { setHeader } = useAppHeaderStore();

  useEffect(() => {
    setHeader({
      title: `${t("offerList.title")} – ${hotelName}`,
      type: "overlay",
      icon: "arrow",
    });
  }, [setHeader, t, hotelName]);

  return (
    <AppShell title={`${t("offerList.title")} – ${hotelName}`}>
      <Quickfilter />
      <div className="px-4 py-2 text-sm text-gray-500">
        {total > 0
          ? t("offerList.results", { count: total })
          : t("offerList.noResults")}
      </div>
      <div>
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </AppShell>
  );
}
