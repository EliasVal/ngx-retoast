import { inject, Injectable } from '@angular/core';

import {
  ToastNoAnimation,
  RetoastService,
  type ActiveToast,
  type GlobalConfig,
  type IndividualConfig,
} from 'ngx-retoast';
import { quotes, type Quote } from './quotes';

@Injectable({ providedIn: 'root' })
export class ToastManagerService {
  private retoast = inject(RetoastService);
  private lastInserted: number[] = [];

  public openToastAnimation(options?: GlobalConfig, type?: string, quote?: Quote) {
    const _options = { ...(options ?? this.retoast.retoastConfig) };

    return this.openToast(_options, quote, _options.iconClasses[type ?? 'success']);
  }

  public openToastNoAnimation(options?: GlobalConfig, type?: string, quote?: Quote) {
    const _options = { ...(options ?? this.retoast.retoastConfig) };

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
    this.retoast.clearAll();
  }

  public clearLastToast() {
    this.retoast.clearToast(this.lastInserted.pop()!);
  }

  private openToast<C extends ToastNoAnimation>(
    options?: IndividualConfig,
    quote?: Quote,
    type?: string,
  ): ActiveToast<C> | undefined {
    const { message, title } = this.getMessage(quote);
    const inserted = this.retoast.show<C>(
      message || 'Success',
      title,
      options ?? this.retoast.retoastConfig,
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
