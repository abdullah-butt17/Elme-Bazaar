const slugify = require('../../utils/slugify');

describe('slugify', () => {
  it('lowercases and hyphenates a simple name', () => {
    expect(slugify('Emerald Silk Kurta')).toBe('emerald-silk-kurta');
  });

  it('strips punctuation', () => {
    expect(slugify("Women's Lawn Suit - Limited Edition!")).toBe(
      'womens-lawn-suit-limited-edition'
    );
  });

  it('collapses multiple spaces/hyphens into one', () => {
    expect(slugify('Bridal   Collection -- 2026')).toBe('bridal-collection-2026');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  -Festive Wear-  ')).toBe('festive-wear');
  });

  it('handles already-clean input unchanged', () => {
    expect(slugify('classic-white-shalwar-kameez')).toBe('classic-white-shalwar-kameez');
  });
});
