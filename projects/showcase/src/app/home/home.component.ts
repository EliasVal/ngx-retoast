import { Component, VERSION, ChangeDetectionStrategy, inject, viewChildren } from '@angular/core';
import { GlobalConfig, ToastrService } from 'ngx-retoast';
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
  protected toastr = inject(ToastrService);
  protected toastManager = inject(ToastManagerService);

  options: GlobalConfig;
  title = '';
  message = '';
  type = types[0];
  version = VERSION;
  enableBootstrap = false;


  constructor() {
    this.options = this.toastr.toastrConfig;
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

  setInlinePosition(index: number) {
  }
}

