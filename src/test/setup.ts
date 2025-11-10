// Test setup: jest-dom matchers and IntersectionObserver mock
import '@testing-library/jest-dom';

type IOCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;

class IntersectionObserverMock implements IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '0px';
  thresholds: ReadonlyArray<number> = [0];
  private _callback: IOCallback;
  private _elements: Element[] = [];

  constructor(callback: IOCallback, options?: IntersectionObserverInit) {
    this._callback = callback;
    if (options?.rootMargin) this.rootMargin = options.rootMargin;
    if (typeof options?.threshold === 'number') this.thresholds = [options.threshold];
  }

  observe = (target: Element) => {
    this._elements.push(target);
  };
  unobserve = (target: Element) => {
    this._elements = this._elements.filter(el => el !== target);
  };
  disconnect = () => {
    this._elements = [];
  };
  takeRecords = () => [];

  // Helper to trigger intersection
  triggerIntersect = (isIntersecting = true) => {
    const entries = this._elements.map(el => ({
      isIntersecting,
      target: el,
      intersectionRatio: isIntersecting ? 1 : 0,
      time: Date.now(),
      boundingClientRect: el.getBoundingClientRect(),
      intersectionRect: el.getBoundingClientRect(),
      rootBounds: null,
    })) as unknown as IntersectionObserverEntry[];
    this._callback(entries, this);
  };
}

// Install mock
// @ts-ignore
global.IntersectionObserver = IntersectionObserverMock as any;

// Expose a global helper for tests to call
// @ts-ignore
global.__triggerIntersection__ = function () {
  const observers = (global as any).__observers__ as IntersectionObserverMock[] | undefined;
  if (observers && observers.length) {
    observers.forEach(o => (o as IntersectionObserverMock).triggerIntersect(true));
  }
};

// Track created observers
const originalIO = global.IntersectionObserver as any;
// @ts-ignore
global.IntersectionObserver = function (...args: any[]) {
  const inst = new originalIO(...args);
  // @ts-ignore
  if (!(global as any).__observers__) (global as any).__observers__ = [];
  // @ts-ignore
  (global as any).__observers__.push(inst);
  return inst;
};