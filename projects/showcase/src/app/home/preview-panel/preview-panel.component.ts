import { Component, inject, input, signal } from '@angular/core';
import { ToastManagerService } from '../../toast-manager.service';
import { GlobalConfig } from 'ngx-retoast';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-preview-panel',
  templateUrl: './preview-panel.component.html',
  imports: [FormField],
  host: {
    class: 'lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20 flex flex-col gap-6',
  },
})
export class PreviewPanelComponent {
  private readonly toastManager = inject(ToastManagerService);

  public toastOptions = input.required<GlobalConfig>();
  public toastType = input.required<string>();

  content = signal({
    title: '',
    message: '',
  });

  contentForm = form(this.content);

  openToast() {
    this.toastManager.openToastAnimation(this.toastOptions(), this.toastType(), {
      message: this.content().message,
      title: this.content().title,
    });
  }

  openToastNoAnimation() {
    this.toastManager.openToastNoAnimation(this.toastOptions(), this.toastType(), {
      message: this.content().message,
      title: this.content().title,
    });
  }

  clearLastToast() {
    this.toastManager.clearLastToast();
  }

  clearToasts() {
    this.toastManager.clearToasts();
  }
}
