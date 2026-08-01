import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToastBase } from '../base-toast/base-toast.component';

@Component({
  selector: '[toast-component]',
  templateUrl: '../base-toast/base-toast.component.html',
  styleUrl: 'toast.component.css',
  host: {
    '[style.--animation-easing]': 'params.animationEasing',
    '[style.--animation-duration]': 'params.animationDuration + "ms"',
    '[class.toast-in]': 'state() === "active"',
    '[class.toast-out]': 'state() === "removed"',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast<ConfigPayload = unknown> extends ToastBase<ConfigPayload> {
  protected readonly params = {
    animationDuration: this.toastPackage.config.animationDuration,
    animationEasing: this.toastPackage.config.animationEasing,
  };

  override remove(): void {
    if (this.state() === 'removed') return;

    clearTimeout(this.timeout);
    clearInterval(this.intervalId);
    this.state.set('removed');

    this.timeout = window.setTimeout(
      () => this.toastPackage.toastRef.close(),
      +this.params.animationDuration,
    );
  }
}
