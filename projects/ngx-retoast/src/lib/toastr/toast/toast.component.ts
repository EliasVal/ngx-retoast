import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef } from '@angular/core';
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
  protected readonly params = { easeTime: this.toastPackage.config.easeTime, easing: this.toastPackage.config.easing };
  private readonly cdr = inject(ChangeDetectorRef);

  override remove(): void {
    if (this.state() === 'removed') return;

    clearTimeout(this.timeout);
    this.state.set('removed');
    this.cdr.detectChanges(); // Force DOM update to apply toast-out class without NgZone
    
    this.timeout = window.setTimeout(
      () => this.toastrService.remove(this.toastPackage.toastId),
      +this.params.easeTime,
    );
  }
}
