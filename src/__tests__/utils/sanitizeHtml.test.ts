import { describe, expect, it } from 'vitest';
import { sanitizeHtml } from '../../lib/utils/sanitizeHtml';

describe('sanitizeHtml', () => {
  it('should return empty string if input is falsy', () => {
    expect(sanitizeHtml('')).toBe('');
    expect(sanitizeHtml(null as unknown as string)).toBe('');
  });

  it('should preserve safe HTML tags', () => {
    const safeHtml = '<p>Hello <strong>World</strong></p><br/><ul><li>List item</li></ul>';
    expect(sanitizeHtml(safeHtml)).toBe(safeHtml);
  });

  it('should remove script tags and their contents', () => {
    const malicious = '<p>Safe</p><script>alert("xss")</script><span>Also safe</span>';
    expect(sanitizeHtml(malicious)).toBe('<p>Safe</p><span>Also safe</span>');
  });

  it('should remove dangerous tags', () => {
    const malicious = '<iframe></iframe><object></object><style>body { color: red; }</style><p>Safe</p>';
    expect(sanitizeHtml(malicious)).toBe('<p>Safe</p>');
  });

  it('should remove on* event handlers', () => {
    const malicious = '<button onclick="alert(\'xss\')">Click me</button><a href="#" onmouseover="malicious()">Link</a>';
    // 'button' tag is also stripped entirely by the dangerous tags rule
    expect(sanitizeHtml(malicious)).toBe('<a href="#">Link</a>');
  });

  it('should neutralize javascript: protocols in href and src', () => {
    const maliciousArray = [
      '<a href="javascript:void(0)">Link</a>',
      '<a href="  javascript:void(0)">Link</a>',
      '<img src="javascript:void(0)" />'
    ];
    // The current sanitizeHtml implementation replaces "href="javascript:" with 'href=""', leaving the rest
    expect(sanitizeHtml(maliciousArray[0])).toBe('<a href=""void(0)">Link</a>');
    expect(sanitizeHtml(maliciousArray[1])).toBe('<a href=""void(0)">Link</a>');
    expect(sanitizeHtml(maliciousArray[2])).toBe('<img src=""void(0)" />');
  });

  it('should strip data: protocols unless it is an image', () => {
    const malicious = '<iframe src="data:text/html;base64,PHNjcmlwdD5hbGVydCgveHNzLyk8L3NjcmlwdD4="></iframe>';
    const safeImage = '<img src="data:image/png;base64,iVBORw0KGg" />';
    
    // iframe is removed entirely
    expect(sanitizeHtml(malicious)).toBe('');
    expect(sanitizeHtml(safeImage)).toBe(safeImage);
  });
});
