# Plan: News Article Content Rendering

1. **Update `TipTapRenderer`**:
   - Add `codeBlock` rendering support inside `TipTapRenderer`. Ensure we preserve whitespace and line breaks (using `whitespace-pre-wrap`) to make the text readable.
2. **Create a `renderContent` helper function in `NewsArticleContent.tsx`**:
   - Try `JSON.parse` on the `content` string.
   - If successful and `type === 'doc'`, return `<TipTapRenderer node={parsed} />`.
   - If `JSON.parse` fails, fallback to rendering the string as legacy HTML by using `dangerouslySetInnerHTML={{ __html: content }}`.
3. **Apply the helper to the UI**:
   - Replace `{content}` inside the `<div className="prose-custom mb-12">...</div>` with `{renderContent(content)}`.
4. **Test & Lint**:
   - Ensure there are no TypeScript or lint warnings resulting from the `any` types or JSON parsing.
