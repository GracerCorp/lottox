# Research: News Article Content Rendering

## Current State
- The UI in `NewsArticleContent.tsx` currently renders the `content` string directly inside a `div`.
- For new articles (like the recent post about Willy), the content is saved as a JSON string from a rich text editor (e.g., TipTap), structured like: `{"type":"doc","content":[{"type":"codeBlock", ...}]}`.
- Because it's rendered as a plain string, React just displays the raw JSON text literally.
- There is a `TipTapRenderer` component already existing in `NewsArticleContent.tsx`, but it's not being utilized for the main `content` field.
- Furthermore, `TipTapRenderer` is missing support for the `codeBlock` node type, which is used in the provided JSON string. This means even if we pass it to `TipTapRenderer`, it wouldn't format newlines correctly.

## Objective
Make the article content display correctly and readably by parsing the JSON and rendering it using the `TipTapRenderer`, while also adding support for `codeBlock` formatting and line breaks.

## Proposed Strategy
1. **Parse Content**: Update `NewsArticleContent.tsx` to safely parse the `content` string.
2. **Conditional Rendering**: 
   - If it's valid TipTap JSON (i.e., has `type: "doc"`), render it using `<TipTapRenderer node={parsedContent} />`.
   - If parsing fails or it's plain text/HTML, render it safely as HTML to support legacy articles.
3. **Enhance TipTapRenderer**: Add a `case "codeBlock":` inside `TipTapRenderer` to render it using `<pre className="whitespace-pre-wrap">...</pre>` or similar so that line breaks (`\n`) are preserved and the text is easy to read.
