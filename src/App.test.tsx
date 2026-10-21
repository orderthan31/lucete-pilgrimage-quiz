import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('landing scaffold', () => {
  it('renders the event, organizer, and destination', () => {
    const html = renderToStaticMarkup(<App />);
    expect(html).toContain('<h1>2026 루체테 성지순례</h1>');
    expect(html).toContain('영통영덕성당 루체테');
    expect(html).toContain('남양성모성지');
  });

  it('shows both twenty-question categories as not yet available', () => {
    const html = renderToStaticMarkup(<App />);
    expect(html).toContain('성인 퀴즈');
    expect(html).toContain('성당 상식');
    expect(html.match(/20문항 · 준비 중/g)).toHaveLength(2);
    expect(html.match(/<button[^>]*disabled=""/g)).toHaveLength(2);
  });
});
