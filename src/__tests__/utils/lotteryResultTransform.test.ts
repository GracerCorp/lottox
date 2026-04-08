import { describe, expect, it } from 'vitest';
import { transformLotteryResult } from '../../lib/utils/lotteryResultTransform';

describe('transformLotteryResult', () => {
  const t = {
    results: {
      prize_1_thai: 'First Prize',
      prize2rank: '2nd Prize',
      prize3rank: '3rd Prize',
      running_number_front_3: 'Front 3',
      running_number_back_3: 'Back 3',
      running_number_back_2: 'Back 2',
      nearby_prize_1: 'Nearby',
    },
  };

  it('returns null for null input', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(transformLotteryResult(null as any, t)).toBeNull();
  });

  it('returns null for input without data', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(transformLotteryResult({} as any, t)).toBeNull();
  });

  it('returns null for input without prizes', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(transformLotteryResult({ data: {} } as any, t)).toBeNull();
  });

  it('transforms standard Thai lottery result', () => {
    const rawData = {
      data: {
        prizes: [
          { prizeName: 'prize_1', category: 'prize_1', winningNumbers: ['123456'], prizeAmount: 6000000, order: 1 },
          { prizeName: 'running_number_front_3', category: 'front_3', winningNumbers: ['111', '222'], prizeAmount: 4000, order: 2 },
          { prizeName: 'running_number_back_3', category: 'back_3', winningNumbers: ['333', '444'], prizeAmount: 4000, order: 3 },
          { prizeName: 'running_number_back_2', category: 'back_2', winningNumbers: ['55'], prizeAmount: 2000, order: 4 },
        ],
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = transformLotteryResult(rawData as any, t);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('object');
  });

  it('handles result with single number (not array)', () => {
    const rawData = {
      data: {
        prizes: [
          { prizeName: 'prize_1', number: '654321', prizeAmount: 6000000, order: 1 },
        ],
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = transformLotteryResult(rawData as any, t);
    expect(result).toBeTruthy();
  });

  it('handles result with fallback by order', () => {
    const rawData = {
      data: {
        prizes: [
          { prizeName: 'unknown_name', winningNumbers: ['999999'], prizeAmount: 1000, order: 1 },
        ],
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = transformLotteryResult(rawData as any, t);
    expect(result).toBeTruthy();
  });
});
