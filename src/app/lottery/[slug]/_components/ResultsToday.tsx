import React from "react";

interface Props {
  countryName: string;
}

export default function ResultsToday({ countryName }: Props) {
  // TODO: Fetch and render today's results for the given country
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {countryName.replace(/-/g, " ")} Lottery Results Today
      </h1>
      <p>Results for today will be displayed here.</p>
    </div>
  );
}
