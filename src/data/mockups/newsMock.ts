export const mockArticles = [
  {
    slug: "how-to-win-thai-lottery",
    title: "How to Win Thai Lottery: Tips and Strategies",
    excerpt:
      "Discover the best strategies and tips for picking winning numbers in the Thai Government Lottery.",
    image:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1287&auto=format&fit=crop",
    date: "2024-03-01T00:00:00.000Z",
    category: "Tips",
    author: "Admin",
  },
  {
    slug: "lao-lottery-history",
    title: "A Brief History of the Lao Development Lottery",
    excerpt:
      "Learn about the origins and evolution of the Lao Development Lottery over the years.",
    image:
      "https://images.unsplash.com/photo-1542204637-e67bc7d41e48?q=80&w=1287&auto=format&fit=crop",
    date: "2024-02-28T00:00:00.000Z",
    category: "History",
    author: "Admin",
  },
];

export const mockArticleDetail = {
  ...mockArticles[0],
  content:
    "This is the full content of the article. It would contain many paragraphs detailing strategies, mathematical odds, and anecdotal stories of past winners. \\n\\nThe Thai Government Lottery is drawn twice a month. Participants buy pre-printed tickets...",
  source: "LottoX",
  related: [mockArticles[1]],
};
