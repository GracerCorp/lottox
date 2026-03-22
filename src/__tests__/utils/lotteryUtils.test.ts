import { describe, expect, it } from 'vitest';
import {
  getPrizeNumber,
  getPrizeAmount,
  getPrizeName,
  formatDateDisplay,
  formatDateShort,
  slugify,
} from '../../lib/utils/lotteryUtils';

describe('getPrizeNumber', () => {
  const prizes = [
    { prizeName: 'Prize 1', category: 'prize_1', winningNumbers: ['123456'], order: 1 },
    { prizeName: '3 Front', category: 'running_number_front_3', winningNumbers: ['111', '222'], order: 2 },
    { prizeName: 'Single', category: 'single', number: '999', order: 3 },
  ];

  it('finds by prizeName', () => {
    expect(getPrizeNumber({ prizes }, ['Prize 1'])).toEqual(['123456']);
  });

  it('finds by category', () => {
    expect(getPrizeNumber({ prizes }, [], ['running_number_front_3'])).toEqual(['111', '222']);
  });

  it('falls back to order when name/category miss', () => {
    expect(getPrizeNumber({ prizes }, ['NoMatch'], [], 3)).toEqual(['999']);
  });

  it('wraps scalar number in array', () => {
    expect(getPrizeNumber({ prizes }, ['Single'], ['single'])).toEqual(['999']);
  });

  it('returns undefined when nothing matches', () => {
    expect(getPrizeNumber({ prizes }, ['Missing'])).toBeUndefined();
  });

  it('returns undefined for empty/missing prizes', () => {
    expect(getPrizeNumber({}, ['Prize 1'])).toBeUndefined();
    expect(getPrizeNumber({ prizes: null as any }, ['Prize 1'])).toBeUndefined();
  });

  it('handles fallbackOrder miss gracefully', () => {
    expect(getPrizeNumber({ prizes }, ['NoMatch'], [], 99)).toBeUndefined();
  });
});

describe('getPrizeAmount', () => {
  const prizes = [
    { prizeName: 'Prize 1', category: 'prize_1', amount: '6000000', order: 1 },
    { prizeName: 'Prize 2', category: 'prize_2', prizeAmount: '200000', order: 2 },
    { prizeName: 'Prize 3', category: 'prize_3', reward: '80000', order: 3 },
  ];

  it('returns amount by name', () => {
    expect(getPrizeAmount({ prizes }, ['Prize 1'])).toBe('6000000');
  });

  it('returns prizeAmount by category', () => {
    expect(getPrizeAmount({ prizes }, [], ['prize_2'])).toBe('200000');
  });

  it('returns reward as fallback field', () => {
    expect(getPrizeAmount({ prizes }, ['Prize 3'])).toBe('80000');
  });

  it('falls back to order', () => {
    expect(getPrizeAmount({ prizes }, ['NoMatch'], [], 3)).toBe('80000');
  });

  it('returns undefined when nothing matches', () => {
    expect(getPrizeAmount({ prizes }, ['Missing'])).toBeUndefined();
  });

  it('returns undefined for empty prizes', () => {
    expect(getPrizeAmount({}, ['Prize 1'])).toBeUndefined();
  });
});

describe('getPrizeName', () => {
  const t = {
    results: {
      prize_2_digits: '2 Digits',
      prize_3_digits: '3 Digits',
      prize_4_digits: '4 Digits',
      prize_modern_5: 'Modern 5',
      prize_1_thai: 'First Prize',
      prize2rank: 'Second Prize',
      prize3rank: 'Third Prize',
      prize4rank: 'Fourth Prize',
      prize5rank: 'Fifth Prize',
      running_number_front_3: 'Front 3',
      running_number_back_3: 'Back 3',
      running_number_back_2: 'Back 2',
      nearby_prize_1: 'Nearby 1',
    },
  };

  it('maps Lao categories', () => {
    expect(getPrizeName('', 'prize_2_digits', t)).toBe('2 Digits');
    expect(getPrizeName('', 'prize_3_digits', t)).toBe('3 Digits');
    expect(getPrizeName('', 'prize_4_digits', t)).toBe('4 Digits');
    expect(getPrizeName('', 'prize_modern_5', t)).toBe('Modern 5');
  });

  it('maps Thai categories', () => {
    expect(getPrizeName('', 'prize_1', t)).toBe('First Prize');
    expect(getPrizeName('', 'prize_2', t)).toBe('Second Prize');
    expect(getPrizeName('', 'prize_3', t)).toBe('Third Prize');
    expect(getPrizeName('', 'prize_4', t)).toBe('Fourth Prize');
    expect(getPrizeName('', 'prize_5', t)).toBe('Fifth Prize');
  });

  it('maps running number categories', () => {
    expect(getPrizeName('', 'running_number_front_3', t)).toBe('Front 3');
    expect(getPrizeName('3 Front', '', t)).toBe('Front 3');
    expect(getPrizeName('', 'running_number_back_3', t)).toBe('Back 3');
    expect(getPrizeName('3 Back', '', t)).toBe('Back 3');
    expect(getPrizeName('', 'running_number_back_2', t)).toBe('Back 2');
    expect(getPrizeName('2 Back', '', t)).toBe('Back 2');
  });

  it('maps nearby prize', () => {
    expect(getPrizeName('', 'nearby_prize_1', t)).toBe('Nearby 1');
  });

  it('falls back to raw name when no mapping matches', () => {
    expect(getPrizeName('Custom Prize', 'custom_cat', t)).toBe('Custom Prize');
  });

  it('handles name-based matching (pName) when category is empty', () => {
    expect(getPrizeName('prize_2_digits', '', t)).toBe('2 Digits');
    expect(getPrizeName('prize_1', '', t)).toBe('First Prize');
  });
});

describe('formatDateDisplay', () => {
  it('formats in English', () => {
    const result = formatDateDisplay('2026-03-01', 'en');
    expect(result).toBe('Sunday, March 1, 2026');
  });

  it('formats in Thai with Buddhist year', () => {
    const result = formatDateDisplay('2026-03-01', 'th');
    expect(result).toContain('2569'); // 2026 + 543
    expect(result).toContain('มีนาคม');
  });

  it('returns raw string for invalid date', () => {
    expect(formatDateDisplay('not-a-date', 'en')).toBe('not-a-date');
  });

  it('returns dash for dash input', () => {
    expect(formatDateDisplay('-', 'en')).toBe('-');
  });

  it('returns empty for empty input', () => {
    expect(formatDateDisplay('', 'en')).toBe('');
  });
});

describe('formatDateShort', () => {
  it('formats short in English', () => {
    const result = formatDateShort('2026-03-15', 'en');
    expect(result).toBe('Mar 15, 2026');
  });

  it('formats short in Thai', () => {
    const result = formatDateShort('2026-03-15', 'th');
    expect(result).toBe('15 มี.ค.');
  });

  it('returns raw string for invalid date', () => {
    expect(formatDateShort('bad', 'en')).toBe('bad');
  });

  it('handles empty/dash', () => {
    expect(formatDateShort('', 'en')).toBe('');
    expect(formatDateShort('-', 'en')).toBe('-');
  });
});

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Thai Government Lottery')).toBe('thai-government-lottery');
  });

  it('strips special characters', () => {
    expect(slugify('Lottery (GLO) #1')).toBe('lottery-glo-1');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });
});
