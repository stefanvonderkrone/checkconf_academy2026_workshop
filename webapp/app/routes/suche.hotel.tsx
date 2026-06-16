import { useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { AppShell } from "~/components/app_shell";
import { Quickfilter } from "~/components/quickfilter";
import { HotelCard } from "~/components/hotel_card";
import { useAppHeaderStore } from "~/stores/app_header";
import { generateHotels } from "~/utility/mock_data";
import type { Board, Hotel } from "~/types/hotel";
import type { Route } from "./+types/suche.hotel";

const allHotels = generateHotels(200);

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const starsParam = url.searchParams.get("stars");
  const maxPriceParam = url.searchParams.get("maxPrice");
  const boardParam = url.searchParams.get("board") as Board | null;

  let hotels: Hotel[] = allHotels;

  if (starsParam) {
    const stars = Number(starsParam);
    hotels = hotels.filter((h) => h.stars >= stars);
  }
  if (maxPriceParam) {
    const maxPrice = Number(maxPriceParam);
    hotels = hotels.filter((h) => h.priceFrom <= maxPrice);
  }
  if (boardParam) {
    hotels = hotels.filter((h) => h.board === boardParam);
  }

  return { hotels, total: hotels.length };
}

export default function HotelListPage() {
  const { hotels, total } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const { setHeader } = useAppHeaderStore();

  useEffect(() => {
    setHeader({
      title: t("hotelList.title"),
      type: "default",
      icon: "arrow",
    });
  }, [setHeader, t]);

  return (
    <AppShell title={t("hotelList.title")}>
      <Quickfilter />
      <div className="px-4 py-2 text-sm text-gray-500">
        {total > 0
          ? t("hotelList.results", { count: total })
          : t("hotelList.noResults")}
      </div>
      <div>
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </AppShell>
  );
}
