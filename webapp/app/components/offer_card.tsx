import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import type { Offer } from "~/types/hotel";

type OfferCardProps = {
  offer: Offer;
};

const BOARD_LABELS: Record<string, string> = {
  ro: "Nur Übernachtung",
  bb: "Frühstück",
  hb: "Halbpension",
  fb: "Vollpension",
  ai: "All Inclusive",
};

export function OfferCard({ offer }: OfferCardProps) {
  const { t } = useTranslation();

  return (
    <Link
      to="/buchung"
      viewTransition
      className="flex gap-3 border-b border-gray-100 bg-white p-4 active:bg-gray-50"
    >
      <div
        className="h-16 w-16 flex-shrink-0 rounded-lg"
        style={{ backgroundColor: offer.color }}
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <span className="font-semibold text-gray-900">{offer.roomName}</span>
          <div className="mt-0.5 text-sm text-gray-500">
            {BOARD_LABELS[offer.board]} ·{" "}
            {t("offerList.nights", { count: offer.duration })}
          </div>
          <div className="mt-0.5 text-xs text-gray-400">
            {offer.departureDate}
          </div>
        </div>
        <div className="mt-1 text-right">
          <span className="text-lg font-bold text-primary">
            {offer.price} €
          </span>
          <span className="ml-1 text-xs text-gray-400">
            {t("offerList.perPerson")}
          </span>
        </div>
      </div>
    </Link>
  );
}
