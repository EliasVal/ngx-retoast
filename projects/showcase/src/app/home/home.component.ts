import { ChangeDetectionStrategy, Component, VERSION, effect, inject, signal } from '@angular/core';
import { GlobalConfig, RetoastService } from 'ngx-retoast';
import { ToastManagerService } from '../toast-manager.service';
import { OptionsComponent } from './options/options.component';
import { TimeoutsComponent } from './timeouts/timeouts.component';
import { TypePositionComponent } from './type-position/type-position.component';
import { ProgressBarComponent } from './progress/progress.component';
import { PreviewPanelComponent } from './preview-panel/preview-panel.component';

const types = ['success', 'error', 'info', 'warning'];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OptionsComponent,
    TimeoutsComponent,
    TypePositionComponent,
    ProgressBarComponent,
    PreviewPanelComponent,
  ],
  host: {
    class: 'min-h-screen bg-base-100',
  },
})
export class HomeComponent {
  protected retoast = inject(RetoastService);
  protected toastManager = inject(ToastManagerService);

  version = VERSION;
  enableBootstrap = false;

  toastOptions = signal<GlobalConfig>(
    (() => {
      const config = { ...this.retoast.retoastConfig };
      delete config.toastComponent;
      return config;
    })(),
  );
  toastType = signal(types[0]);

  constructor() {
    effect(() => {
      // Sync the local options signal to the global Retoast config
      Object.assign(this.retoast.retoastConfig, this.toastOptions());
    });
  }
}
