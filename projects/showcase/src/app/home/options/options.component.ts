import { Component, linkedSignal, model } from '@angular/core';
import { FormField, form, disabled } from '@angular/forms/signals';
import { GlobalConfig } from 'ngx-retoast';

@Component({
  selector: 'app-options',
  imports: [FormField],
  templateUrl: './options.component.html',
})
export class OptionsComponent {
  options = model.required<GlobalConfig>();

  optionsForm = form(this.options, (s) => {
    // Disable countDuplicates, resetTimeoutOnDuplicate, duplicateTitleCheck if preventDuplicates is false
    disabled(s.countDuplicates, { when: ({ valueOf }) => !valueOf(s.preventDuplicates) });
    disabled(s.resetTimeoutOnDuplicate, { when: ({ valueOf }) => !valueOf(s.preventDuplicates) });
    disabled(s.duplicateTitleCheck, { when: ({ valueOf }) => !valueOf(s.preventDuplicates) });
  });

  protected readonly checkboxes = linkedSignal(() => [
    {
      field: this.optionsForm.enableHtml,
      id: 'enableHtml',
      label: 'Enable HTML (message)',
      extraClass: '',
    },
    {
      field: this.optionsForm.tapToDismiss,
      id: 'tapToDismiss',
      label: 'Tap to dismiss',
      extraClass: '',
    },
    {
      field: this.optionsForm.closeButton,
      id: 'closeButton',
      label: 'Close button',
      extraClass: '',
    },
    {
      field: this.optionsForm.preventDuplicates,
      id: 'preventDuplicates',
      label: 'Prevent duplicates',
      extraClass: '',
    },
    {
      field: this.optionsForm.countDuplicates,
      id: 'countDuplicates',
      label: 'Count duplicates',
      extraClass: 'ml-2',
    },
    {
      field: this.optionsForm.resetTimeoutOnDuplicate,
      id: 'resetTimeoutOnDuplicate',
      label: 'Reset timeout on duplicate',
      extraClass: 'ml-2',
    },
    {
      field: this.optionsForm.duplicateTitleCheck,
      id: 'duplicateTitleCheck',
      label: 'Include title in duplicate checks',
      extraClass: 'ml-2',
    },
    {
      field: this.optionsForm.newestOnTop,
      id: 'newestOnTop',
      label: 'New toasts on top',
      extraClass: '',
    },
  ]);
}
