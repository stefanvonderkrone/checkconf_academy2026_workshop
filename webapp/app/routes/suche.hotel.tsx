import { useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { AppShell } from "~/components/app_shell";
import { Quickfilter } from "~/components/quickfilter";
import { HotelCard } from "~/components/hotel_card";
import { useChangedSearch } from "~/hooks/use_changed_search";
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

  useChangedSearch();

  useEffect(() => {
    setHeader({
      title: t("hotelList.title"),
      type: "default",
      icon: "arrow",
    });
  }, [setHeader, t]);

  const virtualizer = useWindowVirtualizer({
    count: hotels.length,
    estimateSize: () => 120,
    overscan: 5,
  });

  return (
    <AppShell title={t("hotelList.title")}>
      <Quickfilter />
      <div className="px-4 py-2 text-sm text-gray-500">
        {total > 0
          ? t("hotelList.results", { count: total })
          : t("hotelList.noResults")}
      </div>
      <div
        style={{ height: virtualizer.getTotalSize(), position: "relative" }}
      >
        {virtualizer.getVirtualItems().map((vItem) => (
          <div
            key={vItem.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${vItem.start}px)`,
            }}
            ref={virtualizer.measureElement}
            data-index={vItem.index}
          >
            <HotelCard hotel={hotels[vItem.index]!} />
          </div>
        ))}
      </div>
    </AppShell>
  );
}
