import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn() utility function', () => {
  it('should merge basic class names', () => {
    const result = cn('class1', 'class2', 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('should handle conditional classes with falsy values', () => {
    const result = cn(
      'base-class',
      false && 'false-class',
      null && 'null-class',
      undefined && 'undefined-class',
      0 && 'zero-class',
      '' && 'empty-class',
      true && 'true-class'
    );
    expect(result).toBe('base-class true-class');
  });

  it('should resolve Tailwind conflicts (last class wins)', () => {
    // padding conflict: p-4 should be overridden by p-2
    const paddingResult = cn('p-4', 'p-2');
    expect(paddingResult).toBe('p-2');

    // margin conflict: m-8 should be overridden by m-4
    const marginResult = cn('m-8', 'm-4');
    expect(marginResult).toBe('m-4');

    // text color conflict: text-red-500 should be overridden by text-blue-500
    const colorResult = cn('text-red-500', 'text-blue-500');
    expect(colorResult).toBe('text-blue-500');

    // background conflict
    const bgResult = cn('bg-white', 'bg-black');
    expect(bgResult).toBe('bg-black');
  });

  it('should handle empty input gracefully', () => {
    const emptyResult = cn();
    expect(emptyResult).toBe('');

    const emptyStringResult = cn('');
    expect(emptyStringResult).toBe('');

    const nullResult = cn(null);
    expect(nullResult).toBe('');

    const undefinedResult = cn(undefined);
    expect(undefinedResult).toBe('');

    const falsyResult = cn(false, null, undefined, '');
    expect(falsyResult).toBe('');
  });

  it('should handle complex conditional combinations', () => {
    const isActive = true;
    const isDisabled = false;
    const size = 'large';
    const variant = 'primary';

    const result = cn(
      'base-component',
      isActive && 'active',
      isDisabled && 'disabled',
      !isDisabled && 'enabled',
      size === 'large' && 'text-lg',
      size === 'small' && 'text-sm',
      variant === 'primary' && 'bg-blue-500',
      variant === 'secondary' && 'bg-gray-500',
      {
        'hover:opacity-80': true,
        'cursor-not-allowed': isDisabled,
        'cursor-pointer': !isDisabled,
      }
    );

    expect(result).toContain('base-component');
    expect(result).toContain('active');
    expect(result).toContain('enabled');
    expect(result).toContain('text-lg');
    expect(result).toContain('bg-blue-500');
    expect(result).toContain('hover:opacity-80');
    expect(result).toContain('cursor-pointer');
    expect(result).not.toContain('disabled');
    expect(result).not.toContain('text-sm');
    expect(result).not.toContain('bg-gray-500');
    expect(result).not.toContain('cursor-not-allowed');
  });
});
