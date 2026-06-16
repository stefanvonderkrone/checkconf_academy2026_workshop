import { Link, useLoaderData, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { AppShell } from "~/components/app_shell";
import { useChangedSearch } from "~/hooks/use_changed_search";
import { useAppHeaderStore } from "~/stores/app_header";
import { generateHotels } from "~/utility/mock_data";
import type { Route } from "./+types/suche.detail.$id";

const allHotels = generateHotels(200);

export async function loader({ params }: Route.LoaderArgs) {
  const hotel = allHotels.find((h) => h.id === params.id);
  if (!hotel) throw new Response("Not Found", { status: 404 });
  return { hotel };
}

export default function HotelDetailPage() {
  const { hotel } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const { setHeader } = useAppHeaderStore();
  const location = useLocation();

  useChangedSearch();

  useEffect(() => {
    setHeader({
      title: hotel.name,
      type: "overlay",
      icon: "arrow",
    });
  }, [setHeader, hotel.name]);

  return (
    <AppShell title={hotel.name}>
      <div
        className="h-56 w-full"
        style={{ backgroundColor: hotel.color }}
      />

      <div className="px-4 py-5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">{hotel.name}</h2>
          <span className="text-sm text-yellow-500">
            {"★".repeat(hotel.stars)}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
          <span>
            📍 {t("hotelDetail.location")}: {hotel.location}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm">
          <span className="rounded-lg bg-primary/10 px-2 py-1 font-semibold text-primary">
            {hotel.ratingScore}/6
          </span>
          <span className="text-gray-500">
            {t("hotelDetail.reviews", { count: hotel.reviewCount })}
          </span>
        </div>

        <div className="mt-4 text-lg font-bold text-primary">
          {t("hotelDetail.priceFrom", { price: hotel.priceFrom })}
        </div>

        <p className="mt-4 leading-relaxed text-gray-600">
          Erleben Sie unvergessliche Tage im {hotel.name} in {hotel.location}.
          Dieses {hotel.stars}-Sterne-Hotel bietet Ihnen erstklassigen Service
          und eine traumhafte Lage.
        </p>

        <Link
          to={{ pathname: `/suche/angebot/${hotel.id}`, search: location.search }}
          className="mt-6 block rounded-xl bg-blue-900 px-6 py-3 text-center font-semibold text-white shadow-md transition-transform active:scale-[0.98]"
        >
          {t("hotelDetail.showOffers")}
        </Link>
      </div>
    </AppShell>
  );
}
