import { generateHotels } from "~/utility/mock_data";
import type { Board } from "~/types/hotel";
import type { Route } from "./+types/api.hotels";

const allHotels = generateHotels(200);

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const starsParam = url.searchParams.get("stars");
  const maxPriceParam = url.searchParams.get("maxPrice");
  const boardParam = url.searchParams.get("board") as Board | null;

  let hotels = allHotels;

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

  return Response.json({ hotels, total: hotels.length });
}
