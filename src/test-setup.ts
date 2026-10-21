import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });
Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { value: function(this: HTMLDialogElement) { this.open = true; }, configurable: true });
Object.defineProperty(HTMLDialogElement.prototype, 'close', { value: function(this: HTMLDialogElement) { this.open = false; }, configurable: true });
beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});
afterEach(() => { cleanup(); localStorage.clear(); window.history.replaceState(null, '', '/'); vi.restoreAllMocks(); });
