import { generateOffers, generateHotels } from "~/utility/mock_data";
import type { Board } from "~/types/hotel";
import type { Route } from "./+types/api.offers.$hotelId";

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

  return Response.json({
    offers,
    hotelName: hotel?.name ?? "Unbekanntes Hotel",
  });
}
