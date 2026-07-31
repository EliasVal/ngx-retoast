import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
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
  readonly params = { easeTime: this.toastPackage.config.easeTime, easing: 'ease-in' };
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  override remove(): void {
    if (this.state() === 'removed') return;

    clearTimeout(this.timeout);
    this.state.set('removed');
    this.elementRef.nativeElement.classList.add('toast-out');
    this.timeout = window.setTimeout(
      () => this.toastrService.remove(this.toastPackage.toastId),
      +this.params.easeTime,
    );
  }
}
