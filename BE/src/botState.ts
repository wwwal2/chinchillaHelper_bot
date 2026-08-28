let paused = false;

export function isPaused(): boolean {
  return paused;
}

export function pause(): void {
  paused = true;
}

export function resume(): void {
  paused = false;
}
