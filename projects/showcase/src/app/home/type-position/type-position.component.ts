import { Component, model } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { GlobalConfig } from 'ngx-retoast';

@Component({
  selector: 'app-type-position',
  imports: [FormField],
  templateUrl: './type-position.component.html',
})
export class TypePositionComponent {
  toastType = model.required<string>();
  options = model.required<GlobalConfig>();

  typeForm = form(this.toastType);
  positionForm = form(this.options);

  types = [
    { value: 'success', id: 'typesuccess', label: 'Success' },
    { value: 'info', id: 'typeinfo', label: 'Info' },
    { value: 'warning', id: 'typewarning', label: 'Warning' },
    { value: 'error', id: 'typeerror', label: 'Error' },
  ];

  positions = [
    { value: 'toast-top-right', id: 'toast-top-right', label: 'Top Right' },
    { value: 'toast-bottom-right', id: 'toast-bottom-right', label: 'Bottom Right' },
    { value: 'toast-bottom-left', id: 'toast-bottom-left', label: 'Bottom Left' },
    { value: 'toast-top-left', id: 'toast-top-left', label: 'Top Left' },
    { value: 'toast-top-full-width', id: 'top-full-width', label: 'Top Full Width' },
    { value: 'toast-bottom-full-width', id: 'bottom-full-width', label: 'Bottom Full Width' },
    { value: 'toast-top-center', id: 'toast-top-center', label: 'Top Center' },
    { value: 'toast-bottom-center', id: 'toast-bottom-center', label: 'Bottom Center' },
  ];
}
