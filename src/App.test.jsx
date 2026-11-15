import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const src = fs.readFileSync(path.resolve(__dirname, 'App.jsx'), 'utf8');

describe('App content', () => {
  it('every local logo referenced by App exists in /public', () => {
    // Paths are relative (no leading slash) so the build works under a GitHub Pages sub-path.
    const refs = [...src.matchAll(/['`]((?:logos|icons|images)\/[^'`$]+)['`]/g)].map((m) => m[1]);
    expect(refs.length).toBeGreaterThan(5);
    for (const ref of refs) {
      expect(fs.existsSync(path.resolve(__dirname, '..', 'public', ref)), ref).toBe(true);
    }
  });

  it('PlayzAnime and Zykof are not labelled as Emberfig work', () => {
    for (const id of ['playzanime', 'zykof']) {
      const start = src.indexOf(`id: '${id}'`);
      const block = src.slice(start, src.indexOf('}', src.indexOf('links:', start)));
      expect(block).not.toMatch(/Emberfig/);
    }
  });
});
