import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import type { Hotel } from "~/types/hotel";

type HotelCardProps = {
  hotel: Hotel;
};

const BOARD_LABELS: Record<string, string> = {
  ro: "Nur Übernachtung",
  bb: "Frühstück",
  hb: "Halbpension",
  fb: "Vollpension",
  ai: "All Inclusive",
};

export function HotelCard({ hotel }: HotelCardProps) {
  const { t } = useTranslation();

  return (
    <Link
      to={`/suche/detail/${hotel.id}`}
      viewTransition
      className="flex gap-3 border-b border-gray-100 bg-white p-4 active:bg-gray-50"
    >
      <div
        className="h-20 w-20 flex-shrink-0 rounded-lg"
        style={{ backgroundColor: hotel.color }}
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center gap-1">
            <span className="truncate font-semibold text-gray-900">
              {hotel.name}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-sm text-gray-500">
            <span>{"★".repeat(hotel.stars)}</span>
            <span>·</span>
            <span>{hotel.location}</span>
          </div>
          <div className="mt-0.5 text-xs text-gray-400">
            {BOARD_LABELS[hotel.board]} · {hotel.ratingScore}/6 (
            {t("hotelDetail.reviews", { count: hotel.reviewCount })})
          </div>
        </div>
        <div className="mt-1 text-right text-sm font-bold text-primary">
          {t("hotelList.priceFrom", { price: hotel.priceFrom })}
        </div>
      </div>
    </Link>
  );
}
