import { describe, expect, it } from 'vitest';
import { stageTransform } from './stageTransform';

describe('stageTransform', () => {
  it('fits a portrait screen without rotation', () => {
    expect(stageTransform(1080, 1920, 0)).toEqual({ scale: 1, transform: 'translate(-50%, -50%) scale(1)' });
  });

  it('letterboxes when the aspect ratio differs', () => {
    expect(stageTransform(1080, 3840, 0).scale).toBe(1); // limited by width
    expect(stageTransform(4000, 1920, 0).scale).toBe(1); // limited by height
  });

  it('fills a landscape screen sideways when rotated right', () => {
    // Portrait-mounted TV whose OS still outputs 1920×1080 landscape.
    expect(stageTransform(1920, 1080, 90)).toEqual({
      scale: 1,
      transform: 'translate(-50%, -50%) rotate(90deg) scale(1)',
    });
  });

  it('rotates the other way for 270', () => {
    expect(stageTransform(3840, 2160, 270)).toEqual({
      scale: 2,
      transform: 'translate(-50%, -50%) rotate(-90deg) scale(2)',
    });
  });
});
