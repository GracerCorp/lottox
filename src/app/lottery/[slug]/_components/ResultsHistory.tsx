import React from "react";

interface Props {
  countryName: string;
}

export default function ResultsHistory({ countryName }: Props) {
  // TODO: Fetch and render historical results for the given country
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {countryName.replace(/-/g, " ")} Lottery History
      </h1>
      <p>Historical lottery results will be displayed here.</p>
    </div>
  );
}
