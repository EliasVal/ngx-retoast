import { Component, VERSION, ChangeDetectionStrategy, inject } from '@angular/core';
import { GlobalConfig, RetoastService } from 'ngx-retoast';
import { FormsModule } from '@angular/forms';
import { ToastManagerService } from '../toast-manager.service';

const types = ['success', 'error', 'info', 'warning'];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class HomeComponent {
  protected toastr = inject(RetoastService);
  protected toastManager = inject(ToastManagerService);

  options: GlobalConfig;
  title = '';
  message = '';
  type = types[0];
  version = VERSION;
  enableBootstrap = false;

  constructor() {
    this.options = this.toastr.retoastConfig;
  }

  fixNumber<K extends keyof GlobalConfig>(field: K): void {
    this.options[field] = Number(this.options[field]) as never;
  }

  setInlineClass(enableInline: boolean) {
    if (enableInline) {
      this.options.positionClass = 'inline';
    } else {
      this.options.positionClass = 'toast-top-right';
    }
  }
}
