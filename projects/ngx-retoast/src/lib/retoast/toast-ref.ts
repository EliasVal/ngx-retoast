import { signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ToastCloseFn {
  detach(): void;
}

export class ToastRef<T> {
  public componentInstance!: T;

  public readonly state = signal<'inactive' | 'active' | 'closing' | 'closed'>('inactive');
  public readonly manualClosed = signal(false);
  public readonly durationReset = signal<number>(0);
  public readonly duplicateCount = signal<number>(0);

  private readonly _onShown = new Subject<void>();
  public readonly onShown: Observable<void> = this._onShown.asObservable();

  private readonly _onHidden = new Subject<void>();
  public readonly onHidden: Observable<void> = this._onHidden.asObservable();

  private readonly _onTap = new Subject<void>();
  public readonly onTap: Observable<void> = this._onTap.asObservable();

  private readonly _onAction = new Subject<unknown>();
  public readonly onAction: Observable<unknown> = this._onAction.asObservable();

  constructor(private readonly _overlayRef: ToastCloseFn) {}

  public manualClose() {
    this.manualClosed.set(true);
  }

  public close(): void {
    if (this.state() === 'closed') return;
    this.state.set('closing');
    this._overlayRef.detach();
    this.state.set('closed');
    this._onHidden.next();
    this._onHidden.complete();
    this._onShown.complete();
    this._onTap.complete();
    this._onAction.complete();
  }

  public isInactive() {
    return this.state() === 'inactive' || this.state() === 'closed';
  }

  public activate() {
    if (this.state() === 'inactive') {
      this.state.set('active');
      this._onShown.next();
    }
  }

  public onDuplicate(resetDuration: boolean, countDuplicate: boolean) {
    if (resetDuration) {
      this.durationReset.update((v) => v + 1);
    }
    if (countDuplicate) {
      this.duplicateCount.update((v) => v + 1);
    }
  }

  public _triggerTap() {
    this._onTap.next();
  }

  public _triggerAction(action: unknown) {
    this._onAction.next(action);
  }
}
