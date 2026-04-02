import type { Board, Hotel, Offer } from "~/types/hotel";

const HOTEL_NAMES = [
  "Sunset Beach Resort", "Blue Horizon", "Grand Palace Hotel", "Marina Bay Suites",
  "Costa del Sol Inn", "Alpine Lodge", "Mediterranean Dreams", "Coral Reef Resort",
  "Golden Sands Hotel", "Riviera Palace", "Tropical Paradise", "Ocean View Lodge",
  "Royal Garden Hotel", "Crystal Bay Resort", "Palm Beach Club", "Emerald Coast Inn",
  "Seaside Retreat", "Mountain View Hotel", "Laguna Beach Resort", "Silver Shore Hotel",
  "Atlantis Suites", "Island Breeze Resort", "Harbour View Hotel", "Sunset Cove Inn",
  "Diamond Beach Resort", "Azure Coast Hotel", "Paradise Bay Lodge", "Starlight Resort",
  "Moonlight Bay Hotel", "Sunrise Beach Club", "Pearl Harbor Inn", "Sandcastle Resort",
  "Lighthouse Hotel", "Dolphin Bay Suites", "Flamingo Beach Resort", "Seashell Inn",
  "Nautilus Hotel", "Pelican Beach Resort", "Stardust Lodge", "Sapphire Bay Hotel",
  "Oasis Resort", "Mariner's Cove Inn", "Beachcomber Hotel", "Trident Bay Resort",
  "Windmill Lodge", "Mosaic Beach Hotel", "Velvet Sands Resort", "Driftwood Inn",
  "Aquamarine Hotel", "Jade Beach Resort",
];

const LOCATIONS = [
  "Mallorca", "Kreta", "Türkische Riviera", "Hurghada", "Fuerteventura",
  "Gran Canaria", "Rhodos", "Teneriffa", "Antalya", "Korfu",
];

const COLORS = [
  "#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6",
  "#1abc9c", "#e67e22", "#2980b9", "#27ae60", "#c0392b",
];

const BOARDS: Board[] = ["ro", "bb", "hb", "fb", "ai"];

const ROOM_NAMES = [
  "Doppelzimmer Standard", "Doppelzimmer Superior", "Junior Suite",
  "Suite Deluxe", "Einzelzimmer", "Familienzimmer", "Doppelzimmer Meerblick",
  "Penthouse Suite", "Studio Apartment", "Bungalow",
];

export function generateHotels(count = 200): Hotel[] {
  const hotels: Hotel[] = [];
  for (let i = 0; i < count; i++) {
    hotels.push({
      id: `hotel-${i + 1}`,
      name: HOTEL_NAMES[i % HOTEL_NAMES.length]!,
      stars: ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5,
      priceFrom: 200 + (i * 37) % 1800,
      board: BOARDS[i % BOARDS.length]!,
      color: COLORS[i % COLORS.length]!,
      location: LOCATIONS[i % LOCATIONS.length]!,
      ratingScore: Math.round((1 + ((i * 13) % 50) / 10) * 10) / 10,
      reviewCount: 10 + ((i * 7) % 990),
    });
  }
  return hotels;
}

export function generateOffers(hotelId: string, count = 50): Offer[] {
  const seed = parseInt(hotelId.replace("hotel-", ""), 10) || 1;
  const offers: Offer[] = [];
  for (let i = 0; i < count; i++) {
    const dayOffset = (seed * 3 + i * 7) % 180;
    const date = new Date(2026, 5, 1);
    date.setDate(date.getDate() + dayOffset);
    offers.push({
      id: `offer-${hotelId}-${i + 1}`,
      hotelId,
      roomName: ROOM_NAMES[(seed + i) % ROOM_NAMES.length]!,
      price: 300 + ((seed * 17 + i * 41) % 2000),
      board: BOARDS[(seed + i) % BOARDS.length]!,
      color: COLORS[(seed + i) % COLORS.length]!,
      duration: 3 + ((seed + i) % 12),
      departureDate: date.toISOString().split("T")[0]!,
    });
  }
  return offers;
}
