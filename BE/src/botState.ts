let paused = false;
let currentAbortController: AbortController | null = null;

export function isPaused(): boolean {
  return paused;
}

export function pause(): void {
  paused = true;
  currentAbortController?.abort();
}

export function resume(): void {
  paused = false;
}

export function setAbortController(controller: AbortController | null): void {
  currentAbortController = controller;
}
