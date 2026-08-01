import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
  untracked,
  type OnDestroy,
} from '@angular/core';
import { ToastPackage, type IndividualConfig } from '../retoast-config';
import { RetoastService } from '../retoast.service';

@Component({
  selector: '[toast-component]',
  templateUrl: './base-toast.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'toastClasses()',
    '[style.display]': 'displayStyle()',
    '(mouseenter)': 'stickAround()',
    '(mouseleave)': 'delayedHideToast()',
    '(click)': 'tapToast()',
  },
})
export class ToastBase<ConfigPayload = unknown> implements OnDestroy {
  public toastPackage = inject(ToastPackage);
  protected retoastService = inject(RetoastService);
  protected appRef = inject(ApplicationRef);

  public readonly duplicatesCount = signal(0);
  protected hideTime!: number;

  /** width of progress bar */
  public readonly width = signal(-1);
  public readonly state = signal<'inactive' | 'active' | 'removed'>('inactive');
  public readonly displayStyle = computed(() =>
    this.toastPackage.toastRef.state() === 'inactive' ? 'none' : undefined,
  );
  public readonly message = computed(() => this.toastPackage.message);
  public readonly title = computed(() => this.toastPackage.title);
  public readonly options = linkedSignal<IndividualConfig<ConfigPayload>>(
    () => this.toastPackage.config,
  );
  public readonly originalTimeout = computed(() => this.toastPackage.config.timeOut);
  public readonly toastClasses = computed(
    () => `${this.toastPackage.toastType} ${this.toastPackage.config.toastClass}`,
  );

  protected timeout: number | undefined;
  protected intervalId: number | undefined;

  constructor() {
    effect(() => {
      if (this.toastPackage.toastRef.state() === 'active') {
        untracked(() => this.activateToast());
      }
    });

    effect(() => {
      if (this.toastPackage.toastRef.manualClosed()) {
        untracked(() => this.remove());
      }
    });

    let previousTimeoutReset = 0;
    effect(() => {
      const current = this.toastPackage.toastRef.timeoutReset();
      if (current > previousTimeoutReset) {
        previousTimeoutReset = current;
        untracked(() => this.resetTimeout());
      }
    });

    effect(() => {
      this.duplicatesCount.set(this.toastPackage.toastRef.duplicateCount());
    });
  }

  public ngOnDestroy(): void {
    clearInterval(this.intervalId);
    clearTimeout(this.timeout);
  }

  /**
   * activates toast and sets timeout
   */
  protected activateToast() {
    const options = this.options();
    this.state.set('active');

    if (
      !(options.disableTimeOut === true || options.disableTimeOut === 'timeOut') &&
      options.timeOut
    ) {
      this.timeout = window.setTimeout(() => this.remove(), options.timeOut);
      this.hideTime = new Date().getTime() + options.timeOut;
      if (options.progressBar) {
        this.intervalId = window.setInterval(() => this.updateProgress(), 10);
      }
    }
  }

  /**
   * updates progress bar width
   */
  protected updateProgress() {
    const options = this.options();

    if (!options.timeOut) {
      return;
    }
    const now = new Date().getTime();
    const remaining = this.hideTime - now;
    this.width.set((remaining / options.timeOut) * 100);
    if (options.progressAnimation === 'increasing') {
      this.width.update((width) => 100 - width);
    }
    if (this.width() <= 0) {
      this.width.set(0);
    }
    if (this.width() >= 100) {
      this.width.set(100);
    }
  }

  protected resetTimeout() {
    const options = this.options();
    clearTimeout(this.timeout);
    clearInterval(this.intervalId);
    this.state.set('active');

    this.options.update((options) => ({ ...options, timeOut: this.originalTimeout() }));
    
    if (
      !(options.disableTimeOut === true || options.disableTimeOut === 'timeOut') &&
      this.originalTimeout()
    ) {
      this.timeout = window.setTimeout(() => this.remove(), this.originalTimeout());
      this.hideTime = new Date().getTime() + (this.originalTimeout() || 0);
      this.width.set(-1);
      if (options.progressBar) {
        this.intervalId = window.setInterval(() => this.updateProgress(), 10);
      }
    }
  }

  /**
   * tells retoastService to remove this toast after animation time
   */
  public remove() {
    if (this.state() === 'removed') return;

    clearTimeout(this.timeout);
    clearInterval(this.intervalId);
    this.state.set('removed');
    this.timeout = window.setTimeout(
      () => this.toastPackage.toastRef.close(),
      0,
    );
  }

  protected tapToast() {
    if (this.state() === 'removed') return;

    this.toastPackage.triggerTap();
    if (this.options().tapToDismiss) {
      this.remove();
    }
  }

  protected stickAround() {
    if (this.state() === 'removed') return;

    if (this.options().disableTimeOut !== 'extendedTimeOut') {
      clearTimeout(this.timeout);
      this.options.update((options) => ({ ...options, timeOut: 0 }));
      this.hideTime = 0;

      // disable progressBar
      clearInterval(this.intervalId);
      this.width.set(0);
    }
  }

  protected delayedHideToast() {
    const options = this.options();
    if (
      options.disableTimeOut === true ||
      options.disableTimeOut === 'extendedTimeOut' ||
      options.extendedTimeOut === 0 ||
      this.state() === 'removed'
    ) {
      return;
    }
    const extendedTimeOut = options.extendedTimeOut;
    clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => this.remove(), extendedTimeOut);
    this.options.update((options) => ({ ...options, timeOut: extendedTimeOut }));
    this.hideTime = new Date().getTime() + (extendedTimeOut || 0);
    this.width.set(-1);
    if (options.progressBar) {
      this.intervalId = window.setInterval(() => this.updateProgress(), 10);
    }
  }
}
