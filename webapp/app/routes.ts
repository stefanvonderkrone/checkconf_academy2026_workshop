import { index, route, prefix, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),

  ...prefix("suche", [
    route("hotel", "routes/suche.hotel.tsx"),
    route("detail/:id", "routes/suche.detail.$id.tsx"),
    route("angebot/:hotelId", "routes/suche.angebot.$hotelId.tsx"),
  ]),

  route("buchung", "routes/buchung.tsx"),

  ...prefix("api", [
    route("hotels", "routes/api.hotels.ts"),
    route("offers/:hotelId", "routes/api.offers.$hotelId.ts"),
    route("locales/:lng/:ns", "routes/api.locales.$lng.$ns.ts"),
  ]),

  route("health", "routes/health.ts"),
] satisfies RouteConfig;
