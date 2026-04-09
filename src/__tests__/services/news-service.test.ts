import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { newsService } from "@/lib/services/newsService";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    articles: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe("News Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should gracefully handle non-JSON string content in getNews", async () => {
    const rawContent = "This is simply text, not JSON at all";
    
    (prisma.$transaction as Mock).mockResolvedValueOnce([
      1,
      [{ slug: "bad-json", title: "Fail", content: rawContent }] as unknown[]
    ]);

    const result = await newsService.getNews({});
    expect(result.articles[0].titleEn).toBe("Fail");
  });

  it("should correctly handle non-JSON string content in getNewsDetail", async () => {
    const rawContent = "This is simply text, not JSON at all";
    
    (prisma.articles.findUnique as Mock).mockResolvedValueOnce({
      slug: "bad-json-detail", 
      title: "Fail", 
      content: rawContent,
      user: { name: "Test Author" },
      raw_html: "Some HTML",
      images: [],
      tags: []
    } as unknown);

    const result = await newsService.getNewsDetail("bad-json-detail");
    expect(result.titleEn).toBe("Fail");
    expect(result.content).toBe("Some HTML");
  });

  it("should correctly parse valid JSON in getNewsDetail", async () => {
    const validJson = JSON.stringify({
      titleEn: "Valid JSON Title",
      contentEn: "Valid HTML"
    });
    
    (prisma.articles.findUnique as Mock).mockResolvedValueOnce({
      slug: "good-json", 
      title: "Orig", 
      content: validJson,
      user: { name: "Test Author" },
      raw_html: "Orig HTML",
      images: [],
      tags: []
    } as unknown);

    const result = await newsService.getNewsDetail("good-json");
    expect(result.titleEn).toBe("Valid JSON Title");
    expect(result.contentEn).toBe("Valid HTML");
  });

  it("should avoid parsing explicitly object-typed content", async () => {
    const objContent = { titleEn: "Object Title" };
    
    (prisma.articles.findUnique as Mock).mockResolvedValueOnce({
      slug: "object-json", 
      title: "Orig", 
      content: objContent, 
      user: null,
      images: [],
      tags: []
    } as unknown);

    const result = await newsService.getNewsDetail("object-json");
    expect(result.titleEn).toBe("Object Title");
    expect(result.author).toBe("Admin");
  });

  it("should log a warning when JSON.parse fails", async () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    
    (prisma.articles.findUnique as Mock).mockResolvedValueOnce({
      slug: "spy-json", 
      title: "Orig", 
      content: "Not JSON {",
      user: null,
      images: [],
      tags: []
    } as unknown);

    await newsService.getNewsDetail("spy-json");
    
    expect(consoleSpy).toHaveBeenCalledWith("[getNewsDetail] Failed to parse content for article spy-json");
    consoleSpy.mockRestore();
  });
});

