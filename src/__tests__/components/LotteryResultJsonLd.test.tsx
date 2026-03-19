import React from "react";
import { render } from "@testing-library/react";
import { LotteryResultJsonLd } from "@/components/seo/LotteryResultJsonLd";

describe("LotteryResultJsonLd", () => {
  it("renders script with application/ld+json type", () => {
    const { container } = render(
      <LotteryResultJsonLd
        lotteryName="Thai Government Lottery"
        countryName="Thailand"
        drawDate="2025-03-16"
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it("generates valid Event schema", () => {
    const { container } = render(
      <LotteryResultJsonLd
        lotteryName="Thai Government Lottery"
        countryName="Thailand"
        drawDate="2025-03-16"
        numbers={["012345"]}
        currency="THB"
        jackpotAmount="6000000"
        url="https://lottox.today/th/government-lottery-glo/2025-03-16"
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data["@type"]).toBe("Event");
    expect(data.name).toContain("Thai Government Lottery");
    expect(data.startDate).toBe("2025-03-16");
    expect(data.description).toContain("012345");
    expect(data.offers.priceCurrency).toBe("THB");
  });

  it("omits offers when no jackpotAmount", () => {
    const { container } = render(
      <LotteryResultJsonLd
        lotteryName="Loto 6"
        countryName="Japan"
        drawDate="2025-03-15"
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.offers).toBeUndefined();
  });
});
