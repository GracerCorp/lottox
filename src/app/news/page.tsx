export default function NewsPage() {
  const articles = [
    {
      title: "Powerball Jackpot Hits $463 Million",
      date: "April 20, 2024",
      category: "USA",
    },
    {
      title: "New Thai Lottery Rules for 2024",
      date: "April 19, 2024",
      category: "Thailand",
    },
    {
      title: "EuroMillions Winner Claims Prize anonymously",
      date: "April 18, 2024",
      category: "Europe",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Lottery News</h1>
      <div className="grid gap-6">
        {articles.map((news, i) => (
          <div
            key={i}
            className="bg-navy-800 p-6 rounded-xl border border-white/5 hover:border-gold-500/20 transition-colors"
          >
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
              <span className="text-gold-400 font-bold">{news.category}</span>
              <span>•</span>
              <span>{news.date}</span>
            </div>
            <h2 className="text-xl font-bold text-white hover:text-gold-400 cursor-pointer">
              {news.title}
            </h2>
            <p className="text-gray-400 mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
