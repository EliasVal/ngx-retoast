import { Component, model } from '@angular/core';
import { disabled, form, FormField } from '@angular/forms/signals';
import type { GlobalConfig } from 'ngx-retoast';

@Component({
  selector: 'app-progress-bar',
  imports: [FormField],
  templateUrl: './progress.component.html',
})
export class ProgressBarComponent {
  options = model.required<GlobalConfig>();
  progressForm = form(this.options, (s) => {
    disabled(s.progressAnimation, { when: ({ valueOf }) => !valueOf(s.progressBar) });
  });

  protected readonly progressAnimations = [
    { value: 'decreasing', id: 'progressBarDecreasing', label: 'Decreasing' },
    { value: 'increasing', id: 'progressBarIncreasing', label: 'Increasing' },
  ];
}
