import { STAGE_HEIGHT, STAGE_WIDTH } from '../config';
import type { Rotation } from '../types';

/**
 * Scale (and optionally rotate) the fixed portrait stage to fit the viewport.
 * Rotation is for portrait-mounted TVs whose OS can only output landscape: the stage is fitted against the
 * swapped viewport and turned 90°. Touch hit-testing follows CSS transforms, so taps still land correctly.
 */
export function stageTransform(viewportW: number, viewportH: number, rotation: Rotation) {
  const sideways = rotation === 90 || rotation === 270;
  const fitW = sideways ? viewportH : viewportW;
  const fitH = sideways ? viewportW : viewportH;
  const scale = Math.min(fitW / STAGE_WIDTH, fitH / STAGE_HEIGHT);
  const rotate = rotation === 90 ? ' rotate(90deg)' : rotation === 270 ? ' rotate(-90deg)' : '';
  return { scale, transform: `translate(-50%, -50%)${rotate} scale(${scale})` };
}
