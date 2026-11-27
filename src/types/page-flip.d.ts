/** page-flip 2.0.7 ships no types: only what the sketchbook uses. */
declare module 'page-flip' {
  export class PageFlip {
    constructor(el: HTMLElement, settings: Record<string, unknown>);
    loadFromHTML(items: NodeListOf<Element> | HTMLElement[]): void;
    flipNext(corner?: 'top' | 'bottom'): void;
    flipPrev(corner?: 'top' | 'bottom'): void;
    turnToPage(page: number): void;
    getPageCount(): number;
    on(event: string, cb: (e: { data: number }) => void): this;
    destroy(): void;
  }
}
