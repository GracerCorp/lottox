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
];
