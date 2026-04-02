export type Hotel = {
  id: string;
  name: string;
  stars: 1 | 2 | 3 | 4 | 5;
  priceFrom: number;
  board: Board;
  color: string;
  location: string;
  ratingScore: number;
  reviewCount: number;
};

export type Offer = {
  id: string;
  hotelId: string;
  roomName: string;
  price: number;
  board: Board;
  color: string;
  duration: number;
  departureDate: string;
};

export type Board = "ro" | "bb" | "hb" | "fb" | "ai";

export type SearchParams = {
  stars?: number;
  maxPrice?: number;
  board?: Board;
};
