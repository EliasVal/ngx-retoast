import { Component, model, signal, effect, untracked, OnInit } from '@angular/core';
import { FormField, form, disabled } from '@angular/forms/signals';
import { GlobalConfig } from 'ngx-retoast';

@Component({
  selector: 'app-timeouts',
  imports: [FormField],
  templateUrl: './timeouts.component.html',
})
export class TimeoutsComponent implements OnInit {
  options = model.required<GlobalConfig>();

  localModel = signal({
    timeOut: 0,
    extendedTimeOut: 0,
    disableTimeOut: 'false',
    maxOpened: 0,
    autoDismiss: false,
    easeTime: 0 as string | number,
  });

  timeoutsForm = form(this.localModel, (s) => {
    // Disable timeout based on disableTimeOut config
    disabled(s.timeOut, {
      when: ({ valueOf }) =>
        valueOf(s.disableTimeOut) === 'true' || valueOf(s.disableTimeOut) === 'timeOut',
    });

    // Disable extended timeout based on disableTimeOut config
    disabled(s.extendedTimeOut, {
      when: ({ valueOf }) =>
        valueOf(s.disableTimeOut) === 'true' || valueOf(s.disableTimeOut) === 'extendedTimeOut',
    });
  });

  disableTimeOuts = [
    { value: 'true', id: 'disableTimeOut1', labelCode: 'disableTimeOut = true', extra: '' },
    { value: 'false', id: 'disableTimeOut2', labelCode: 'disableTimeOut = false', extra: '' },
    { value: 'timeOut', id: 'disableTimeOut3', labelCode: 'timeOut', extra: ' only' },
    {
      value: 'extendedTimeOut',
      id: 'disableTimeOut4',
      labelCode: 'extendedTimeOut',
      extra: ' only',
    },
  ];

  initialized = false;

  ngOnInit() {
    const opts = untracked(this.options);
    this.localModel.set({
      timeOut: opts.timeOut,
      extendedTimeOut: opts.extendedTimeOut,
      disableTimeOut: String(opts.disableTimeOut),
      maxOpened: opts.maxOpened,
      autoDismiss: opts.autoDismiss,
      easeTime: opts.easeTime,
    });
    this.initialized = true;
  }

  constructor() {
    // Sync from local form to global options
    effect(() => {
      const local = this.localModel();
      if (!this.initialized) return;

      let disableTimeOutParsed = false;
      if (local.disableTimeOut === 'true') disableTimeOutParsed = true;
      if (local.disableTimeOut === 'false') disableTimeOutParsed = false;

      this.options.update((o) => ({
        ...o,
        timeOut: local.timeOut,
        extendedTimeOut: local.extendedTimeOut,
        disableTimeOut: disableTimeOutParsed,
        maxOpened: local.maxOpened,
        autoDismiss: local.autoDismiss,
        easeTime: local.easeTime,
      }));
    });
  }
}
