/**
 * Basic HTML sanitizer that strips dangerous tags and attributes
 * to prevent XSS when using dangerouslySetInnerHTML.
 *
 * Allowed: p, br, strong, em, b, i, u, s, a, ul, ol, li, h1-h6,
 *          blockquote, img, pre, code, hr, div, span, table, thead,
 *          tbody, tr, th, td, figure, figcaption, sup, sub
 *
 * Stripped: script, iframe, object, embed, form, input, textarea,
 *          select, button, style, link, meta, base, on* attributes
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove iframe, object, embed, form, input, textarea, select, button, style, link, meta, base
  const dangerousTags = [
    "iframe", "object", "embed", "form", "input", "textarea",
    "select", "button", "style", "link", "meta", "base",
  ];
  for (const tag of dangerousTags) {
    // Self-closing and content tags
    sanitized = sanitized.replace(
      new RegExp(`<${tag}\\b[^>]*\\/?>([\\s\\S]*?<\\/${tag}>)?`, "gi"),
      "",
    );
  }

  // Remove on* event handler attributes (onclick, onerror, onload, etc.)
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, "");

  // Remove javascript: protocol in href/src
  sanitized = sanitized.replace(/(href|src)\s*=\s*["']?\s*javascript\s*:/gi, "$1=\"\"");

  // Remove data: protocol in src (except data:image for inline images)
  sanitized = sanitized.replace(/src\s*=\s*["']?\s*data:(?!image\/)/gi, 'src="');

  return sanitized;
}
