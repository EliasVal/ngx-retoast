import { signal } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

export class ToastRef<T> {
  componentInstance!: T;

  state = signal<'inactive' | 'active' | 'closing' | 'closed'>('inactive');
  manualClosed = signal(false);
  timeoutReset = signal<number>(0);
  duplicateCount = signal<number>(0);

  constructor(private _overlayRef: OverlayRef) {}

  manualClose() {
    this.manualClosed.set(true);
    this.close();
  }

  close(): void {
    if (this.state() === 'closed') return;
    this.state.set('closing');
    this._overlayRef.detach();
    this.state.set('closed');
  }

  isInactive() {
    return this.state() === 'inactive' || this.state() === 'closed';
  }

  activate() {
    if (this.state() === 'inactive') {
      this.state.set('active');
    }
  }

  onDuplicate(resetTimeout: boolean, countDuplicate: boolean) {
    if (resetTimeout) {
      this.timeoutReset.update(v => v + 1);
    }
    if (countDuplicate) {
      this.duplicateCount.update(v => v + 1);
    }
  }
}
