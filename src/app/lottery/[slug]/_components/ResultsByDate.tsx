import React from "react";

interface Props {
  countryName: string;
  date: string;
}

export default function ResultsByDate({ countryName, date }: Props) {
  // TODO: Fetch and render results for the given country on the specific date
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {countryName.replace(/-/g, " ")} Lottery Results for {date}
      </h1>
      <p>Results for the selected date will be displayed here.</p>
    </div>
  );
}
