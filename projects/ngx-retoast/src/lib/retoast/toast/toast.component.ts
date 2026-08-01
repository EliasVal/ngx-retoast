import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToastBase } from '../base-toast/base-toast.component';

@Component({
  selector: '[toast-component]',
  templateUrl: '../base-toast/base-toast.component.html',
  styleUrl: 'toast.component.css',
  host: {
    '[style.--animation-easing]': 'params.easing',
    '[style.--animation-duration]': 'params.easeTime + "ms"',
    '[class.toast-in]': 'state() === "active"',
    '[class.toast-out]': 'state() === "removed"',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast<ConfigPayload = unknown> extends ToastBase<ConfigPayload> {
  protected readonly params = {
    easeTime: this.toastPackage.config.easeTime,
    easing: this.toastPackage.config.easing,
  };

  override remove(): void {
    if (this.state() === 'removed') return;

    clearTimeout(this.timeout);
    clearInterval(this.intervalId);
    this.state.set('removed');

    this.timeout = window.setTimeout(
      () => this.toastPackage.toastRef.close(),
      +this.params.easeTime,
    );
  }
}
