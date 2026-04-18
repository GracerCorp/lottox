import { http, HttpResponse } from "msw";

export const mockCountries = {
  countries: [
    {
      id: 1,
      name: "Thailand",
      code: "th",
      is_active: true,
      _count: { lotteries: 1 },
    },
  ],
};

export const handlers = [
  http.get("*/api/countries", () => {
    return HttpResponse.json(mockCountries);
  }),
  http.get("*/api/regions", () => {
    return HttpResponse.json({
      regions: [
        { id: "southeast-asia", name: "Southeast Asia", countries: ["th", "la", "vn", "sg", "my", "id", "ph"] },
        { id: "east-asia", name: "East Asia", countries: ["jp", "tw", "hk"] },
      ],
    });
  }),
  http.get("https://ipapi.co/json/", () => {
    return HttpResponse.json({
      country_code: "TH",
      country_name: "Thailand",
      city: "Bangkok",
      region: "Bangkok",
    });
  }),
  http.post("*/api/analytics/track", () => {
    return HttpResponse.json({ success: true }, { status: 201 });
  }),
];

