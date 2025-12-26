import { describe, it, expect } from 'vitest';

describe('Test Environment Setup', () => {
  it('should have vitest configured properly', () => {
    expect(true).toBe(true);
  });

  it('should have access to vitest globals', () => {
    expect(typeof describe).toBe('function');
    expect(typeof it).toBe('function');
    expect(typeof expect).toBe('function');
  });

  it('should have jsdom environment available', () => {
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
  });
});
