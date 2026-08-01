import { Component, model, signal, effect, untracked, OnInit } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { GlobalConfig } from 'ngx-retoast';

@Component({
  selector: 'app-timeouts',
  imports: [FormField],
  templateUrl: './timeouts.component.html',
})
export class TimeoutsComponent implements OnInit {
  options = model.required<GlobalConfig>();

  localModel = signal({
    duration: 0,
    resumeDuration: 0,
    maxOpened: 0,
    autoDismiss: false,
    animationDuration: 0,
  });

  timeoutsForm = form(this.localModel);

  initialized = false;

  ngOnInit() {
    const opts = untracked(this.options);
    this.localModel.set({
      duration: opts.duration,
      resumeDuration: opts.resumeDuration,
      maxOpened: opts.maxOpened,
      autoDismiss: opts.autoDismiss,
      animationDuration: opts.animationDuration,
    });
    this.initialized = true;
  }

  constructor() {
    // Sync from local form to global options
    effect(() => {
      const local = this.localModel();
      if (!this.initialized) return;

      this.options.update((o) => ({
        ...o,
        duration: local.duration,
        resumeDuration: local.resumeDuration,
        maxOpened: local.maxOpened,
        autoDismiss: local.autoDismiss,
        animationDuration: local.animationDuration,
      }));
    });
  }
}
