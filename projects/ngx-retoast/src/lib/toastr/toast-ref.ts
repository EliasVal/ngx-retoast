import { signal } from '@angular/core';
export interface ToastCloseFn {
  detach(): void;
}

export class ToastRef<T> {
  public componentInstance!: T;

  public readonly state = signal<'inactive' | 'active' | 'closing' | 'closed'>('inactive');
  public readonly manualClosed = signal(false);
  public readonly timeoutReset = signal<number>(0);
  public readonly duplicateCount = signal<number>(0);

  constructor(private readonly _overlayRef: ToastCloseFn) {}

  public manualClose() {
    this.manualClosed.set(true);
    this.close();
  }

  public close(): void {
    if (this.state() === 'closed') return;
    this.state.set('closing');
    this._overlayRef.detach();
    this.state.set('closed');
  }

  public isInactive() {
    return this.state() === 'inactive' || this.state() === 'closed';
  }

  public activate() {
    if (this.state() === 'inactive') {
      this.state.set('active');
    }
  }

  public onDuplicate(resetTimeout: boolean, countDuplicate: boolean) {
    if (resetTimeout) {
      this.timeoutReset.update(v => v + 1);
    }
    if (countDuplicate) {
      this.duplicateCount.update(v => v + 1);
    }
  }
}
