import { ComponentRef, Injectable, Injector, SecurityContext, inject, signal, computed } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { ToastRef } from './toast-ref';

import {
  GlobalConfig,
  IndividualConfig,
  ToastPackage,
  ToastToken,
  TOAST_CONFIG,
} from './toastr-config';
import type { ToastBase } from './base-toast/base-toast.component';

export interface ActiveToast<C> {
  toastId: number;
  title: string;
  message: string;
  portal: ComponentRef<C>;
  toastRef: ToastRef<C>;
}

@Injectable({ providedIn: 'root' })
export class ToastrService {
  private overlay = inject(Overlay);
  private _injector = inject(Injector);
  private sanitizer = inject(DomSanitizer);

  toastrConfig: GlobalConfig;
  
  toasts = signal<ActiveToast<unknown>[]>([]);
  currentlyActive = computed(() => this.toasts().filter(t => !t.toastRef.isInactive()).length);
  

  previousToastMessage: string | undefined;
  private index = 0;

  constructor() {
    const token = inject<ToastToken>(TOAST_CONFIG);
    this.toastrConfig = {
      ...token.default,
      ...token.config,
    };
    if (token.config.iconClasses) {
      this.toastrConfig.iconClasses = {
        ...token.default.iconClasses,
        ...token.config.iconClasses,
      };
    }
  }

  show<C extends ToastBase = ToastBase, ConfigPayload = unknown>(
    message?: string,
    title?: string,
    override: Partial<IndividualConfig<ConfigPayload>> = {},
    type = '',
  ) {
    return this._buildNotification(
      type,
      message,
      title,
      this.applyConfig(override),
    ) as ActiveToast<C> | null;
  }

  success<ConfigPayload = unknown>(
    message?: string,
    title?: string,
    override: Partial<IndividualConfig<ConfigPayload>> = {},
  ) {
    const type = this.toastrConfig.iconClasses.success || '';
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }

  error<ConfigPayload = unknown>(
    message?: string,
    title?: string,
    override: Partial<IndividualConfig<ConfigPayload>> = {},
  ) {
    const type = this.toastrConfig.iconClasses.error || '';
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }

  info<ConfigPayload = unknown>(
    message?: string,
    title?: string,
    override: Partial<IndividualConfig<ConfigPayload>> = {},
  ) {
    const type = this.toastrConfig.iconClasses.info || '';
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }

  warning<ConfigPayload = unknown>(
    message?: string,
    title?: string,
    override: Partial<IndividualConfig<ConfigPayload>> = {},
  ) {
    const type = this.toastrConfig.iconClasses.warning || '';
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }

  clear(toastId?: number) {
    for (const toast of this.toasts()) {
      if (toastId !== undefined) {
        if (toast.toastId === toastId) {
          toast.toastRef.manualClose();
          return;
        }
      } else {
        toast.toastRef.manualClose();
      }
    }
  }

  remove(toastId: number) {
    const found = this._findToast(toastId);
    if (!found) {
      return false;
    }
    found.activeToast.toastRef.close();
    this.toasts.update(toasts => toasts.filter(t => t.toastId !== toastId));
    
    if (this.toastrConfig.maxOpened && this.toasts().length > 0) {
      if (this.currentlyActive() < this.toastrConfig.maxOpened) {
        const nextInactive = this.toasts().find(t => t.toastRef.isInactive());
        if (nextInactive) {
          nextInactive.toastRef.activate();
        }
      }
    }
    return true;
  }

  findDuplicate(title = '', message = '', resetOnDuplicate: boolean, countDuplicates: boolean) {
    const { includeTitleDuplicates } = this.toastrConfig;
    for (const toast of this.toasts()) {
      const hasDuplicateTitle = includeTitleDuplicates && toast.title === title;
      if ((!includeTitleDuplicates || hasDuplicateTitle) && toast.message === message) {
        toast.toastRef.onDuplicate(resetOnDuplicate, countDuplicates);
        return toast;
      }
    }
    return null;
  }

  private applyConfig(override: Partial<IndividualConfig> = {}): GlobalConfig {
    return { ...this.toastrConfig, ...override };
  }

  private _findToast(toastId: number): { index: number; activeToast: ActiveToast<unknown> } | null {
    const toasts = this.toasts();
    for (let i = 0; i < toasts.length; i++) {
      if (toasts[i].toastId === toastId) {
        return { index: i, activeToast: toasts[i] };
      }
    }
    return null;
  }

  private _buildNotification(
    toastType: string,
    message: string | undefined,
    title: string | undefined,
    config: GlobalConfig,
  ): ActiveToast<unknown> | null {
    if (!config.toastComponent) {
      throw new Error('toastComponent required');
    }

    const duplicate = this.findDuplicate(
      title,
      message,
      this.toastrConfig.resetTimeoutOnDuplicate && config.timeOut > 0,
      this.toastrConfig.countDuplicates,
    );
    
    if (
      ((this.toastrConfig.includeTitleDuplicates && title) || message) &&
      this.toastrConfig.preventDuplicates &&
      duplicate !== null
    ) {
      return duplicate;
    }

    this.previousToastMessage = message;
    let keepInactive = false;
    if (this.toastrConfig.maxOpened && this.currentlyActive() >= this.toastrConfig.maxOpened) {
      keepInactive = true;
      if (this.toastrConfig.autoDismiss) {
        this.clear(this.toasts()[0].toastId);
      }
    }

    const overlayRef = this.overlay.create({
      panelClass: ['toast-container', config.positionClass],
    });

    this.index = this.index + 1;
    let sanitizedMessage: string | undefined | null = message;
    if (message && config.enableHtml) {
      sanitizedMessage = this.sanitizer.sanitize(SecurityContext.HTML, message);
    }

    const toastRef = new ToastRef(overlayRef);
    const toastPackage = new ToastPackage(
      this.index,
      config,
      sanitizedMessage,
      title,
      toastType,
      toastRef,
    );

    const providers = [{ provide: ToastPackage, useValue: toastPackage }];
    const toastInjector = Injector.create({ providers, parent: this._injector });

    const componentPortal = new ComponentPortal(config.toastComponent, null, toastInjector);
    const portal = overlayRef.attach(componentPortal);
    toastRef.componentInstance = portal.instance;
    
    const ins: ActiveToast<unknown> = {
      toastId: this.index,
      title: title || '',
      message: message || '',
      toastRef,
      portal,
    };

    if (!keepInactive) {
      setTimeout(() => {
        ins.toastRef.activate();
      });
    }

    this.toasts.update(toasts => [...toasts, ins]);
    return ins;
  }
}
