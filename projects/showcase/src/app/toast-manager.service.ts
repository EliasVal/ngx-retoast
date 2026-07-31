import { inject, Injectable } from '@angular/core';

import {
  ToastNoAnimation,
  ToastrService,
  type ActiveToast,
  type GlobalConfig,
  type IndividualConfig,
} from 'ngx-retoast';
import { quotes, type Quote } from './quotes';

@Injectable({ providedIn: 'root' })
export class ToastManagerService {
  private toastr = inject(ToastrService);
  private lastInserted: number[] = [];

  public openToastAnimation(options?: GlobalConfig, type?: string, quote?: Quote) {
    const _options = { ...(options ?? this.toastr.toastrConfig) };

    return this.openToast(_options, quote, _options.iconClasses[type ?? 'success']);
  }

  public openToastNoAnimation(options?: GlobalConfig, type?: string, quote?: Quote) {
    const _options = { ...(options ?? this.toastr.toastrConfig) };

    return this.openToast(
      {
        ..._options,
        toastComponent: ToastNoAnimation,
      },
      quote,
      _options.iconClasses[type ?? 'success'],
    );
  }

  public clearToasts() {
    this.toastr.clear();
  }

  public clearLastToast() {
    this.toastr.clear(this.lastInserted.pop());
  }

  private openToast<C extends ToastNoAnimation>(
    options?: IndividualConfig,
    quote?: Quote,
    type?: string,
  ): ActiveToast<C> | undefined {
    const { message, title } = this.getMessage(quote);
    const inserted = this.toastr.show<C>(
      message || 'Success',
      title,
      options ?? this.toastr.toastrConfig,
      type,
    );

    if (!inserted) throw new Error('Failed to create toast');
    this.lastInserted.push(inserted.toastId);
    return inserted;
  }

  private getMessage(quote?: Partial<Quote>): Quote {
    if (!quote?.title && !quote?.message) {
      return quotes[Math.floor(Math.random() * quotes.length)];
    }

    return quote;
  }
}

