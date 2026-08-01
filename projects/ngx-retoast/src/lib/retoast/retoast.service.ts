import {
  ComponentRef,
  Injectable,
  Injector,
  SecurityContext,
  inject,
  signal,
  computed,
  ApplicationRef,
  Type,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { ToastRef } from './toast-ref';
import { GlobalConfig, IndividualConfig, ToastPackage, TOAST_CONFIG } from './retoast-config';
import { ToastBase } from './base-toast/base-toast.component';
import { ToastContainerDirective } from './toast-container.directive';
import { Observable } from 'rxjs';

export interface ActiveToast<C> {
  toastId: number;
  title: string;
  message: string;
  portal: ComponentRef<C>;
  toastRef: ToastRef<C>;
  toastPackage: ToastPackage;
  onShown: Observable<void>;
  onHidden: Observable<void>;
  onTap: Observable<void>;
  onAction: Observable<unknown>;
}

@Injectable({ providedIn: 'root' })
export class RetoastService {
  private readonly _cdkOverlayContainer = inject(OverlayContainer);
  private _customContainer?: HTMLElement;
  private readonly _injector = inject(Injector);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly appRef = inject(ApplicationRef);
  private readonly document = inject(DOCUMENT);

  private readonly _retoastConfig = inject(TOAST_CONFIG);
  public readonly retoastConfig: GlobalConfig = {
    ...this._retoastConfig.config,
    ...this._retoastConfig.default,
    ...(this._retoastConfig.config.iconClasses
      ? {
          ...this._retoastConfig.default.iconClasses,
          ...this._retoastConfig.config.iconClasses,
        }
      : {}),
  };

  public readonly toasts = signal<ActiveToast<unknown>[]>([]);
  public readonly currentlyActive = computed(
    () => this.toasts().filter((t) => !t.toastRef.isInactive()).length,
  );

  private readonly overlayContainers = new Map<string, HTMLElement>();

  public previousToastMessage: string | undefined;
  private index = 0;

  public set overlayContainer(container: ToastContainerDirective | undefined) {
    if (container) {
      this._customContainer = container.getContainerElement();
    } else {
      this._customContainer = undefined;
    }
  }

  public show<C extends ToastBase = ToastBase, ConfigPayload = unknown>(
    message?: string,
    title?: string,
    override: Partial<IndividualConfig<ConfigPayload>> = {},
    type = '',
  ): ActiveToast<C> {
    return this._buildNotification(
      type,
      message,
      title,
      this.applyConfig(override),
    ) as ActiveToast<C>;
  }

  public success<ConfigPayload = unknown>(
    message?: string,
    title?: string,
    override: Partial<IndividualConfig<ConfigPayload>> = {},
  ): ActiveToast<unknown> {
    const type = this.retoastConfig.iconClasses.success || '';
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }

  public error<ConfigPayload = unknown>(
    message?: string,
    title?: string,
    override: Partial<IndividualConfig<ConfigPayload>> = {},
  ): ActiveToast<unknown> {
    const type = this.retoastConfig.iconClasses.error || '';
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }

  public info<ConfigPayload = unknown>(
    message?: string,
    title?: string,
    override: Partial<IndividualConfig<ConfigPayload>> = {},
  ): ActiveToast<unknown> {
    const type = this.retoastConfig.iconClasses.info || '';
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }

  public warning<ConfigPayload = unknown>(
    message?: string,
    title?: string,
    override: Partial<IndividualConfig<ConfigPayload>> = {},
  ): ActiveToast<unknown> {
    const type = this.retoastConfig.iconClasses.warning || '';
    return this._buildNotification(type, message, title, this.applyConfig(override));
  }

  public clearAll() {
    const currentToasts = [...this.toasts()];
    for (const toast of currentToasts) {
      toast.toastRef.manualClose();
    }
  }

  public clearToast(id: number) {
    const toast = this._findToast(id);
    toast?.toastRef.manualClose();
  }

  private _removeToast(toastId: number) {
    const found = this._findToast(toastId);
    if (!found) return false;

    found.toastRef.close();
    this.toasts.update((toasts) => toasts.filter((t) => t.toastId !== toastId));

    if (!this.retoastConfig.maxOpened || this.toasts().length === 0) return true;
    if (this.currentlyActive() >= this.retoastConfig.maxOpened) return true;

    const nextInactive = this.toasts().find((t) => t.toastRef.isInactive());
    if (!nextInactive) return true;

    const container = this.getContainerElement(nextInactive.toastPackage.config.positionClass);
    if (nextInactive.toastPackage.config.toastComponent === ToastBase) {
      nextInactive.toastRef.activate();
      nextInactive.portal.changeDetectorRef.detectChanges();
    } else {
      this.animateFlip(container, () => {
        nextInactive.toastRef.activate();
        nextInactive.portal.changeDetectorRef.detectChanges();
      });
    }

    return true;
  }

  public findDuplicate(title: string | undefined = '', message = ''): ActiveToast<unknown> | null {
    const { duplicateTitleCheck } = this.retoastConfig;

    for (const toast of this.toasts()) {
      const hasDuplicateTitle = duplicateTitleCheck && toast.title === title;

      if ((!duplicateTitleCheck || hasDuplicateTitle) && toast.message === message) {
        return toast;
      }
    }

    return null;
  }

  private applyConfig(override: Partial<IndividualConfig> = {}): GlobalConfig {
    return { ...this.retoastConfig, ...override };
  }

  private _findToast(id: number): ActiveToast<unknown> | undefined {
    return this.toasts().find(({ toastId }) => toastId === id);
  }

  private getContainerElement(positionClass: string): HTMLElement {
    if (this.overlayContainers.has(positionClass)) {
      return this.overlayContainers.get(positionClass)!;
    }

    const container = this.document.createElement('div');
    container.classList.add('toast-container');
    if (positionClass) {
      container.classList.add(...positionClass.split(' '));
    }

    if (this._customContainer) {
      this._customContainer.appendChild(container);
    } else {
      this._cdkOverlayContainer.getContainerElement().appendChild(container);
    }

    this.overlayContainers.set(positionClass, container);
    return container;
  }

  // Animate the toast list to be like Svelte's FLIP. (Smoothly shift list instead of jumping)
  private animateFlip(container: HTMLElement, action: () => void) {
    const children = Array.from(container.children) as HTMLElement[];
    const firstRects = new Map<HTMLElement, DOMRect>();
    children.forEach((child) => firstRects.set(child, child.getBoundingClientRect()));

    action();

    const remainingChildren = Array.from(container.children) as HTMLElement[];
    remainingChildren.forEach((child) => {
      const first = firstRects.get(child);
      if (!first) return;

      const last = child.getBoundingClientRect();
      if (first.width === 0 && first.height === 0) return;
      const deltaY = first.top - last.top;
      const deltaX = first.left - last.left;

      if (deltaX === 0 && deltaY === 0) return;

      child.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      child.style.transition = 'none';

      child.getBoundingClientRect();

      requestAnimationFrame(() => {
        child.style.transform = '';
        child.style.transition = 'transform 150ms ease-in-out';

        const cleanup = () => {
          child.style.transition = '';
          child.removeEventListener('transitionend', cleanup);
        };
        child.addEventListener('transitionend', cleanup);
      });
    });
  }

  private _handleDuplicate(
    title: string | undefined,
    message: string | undefined,
    config: GlobalConfig,
  ): ActiveToast<unknown> | null {
    const duplicate = this.findDuplicate(title, message);

    if (duplicate) {
      duplicate.toastRef.onDuplicate(
        this.retoastConfig.resetTimeoutOnDuplicate && config.timeOut > 0,
        this.retoastConfig.countDuplicates,
      );

      return duplicate;
    }

    return null;
  }

  private _checkMaxOpened(): boolean {
    if (this.retoastConfig.maxOpened && this.currentlyActive() >= this.retoastConfig.maxOpened) {
      if (this.retoastConfig.autoDismiss) {
        this.clearToast(this.toasts()[0].toastId);
        return false;
      }

      return true;
    }

    return false;
  }

  private _attachComponent(
    toastComponent: Type<unknown>,
    toastPackage: ToastPackage,
    outlet: DomPortalOutlet,
  ): ComponentRef<unknown> {
    const providers = [{ provide: ToastPackage, useValue: toastPackage }];
    const toastInjector = Injector.create({ providers, parent: this._injector });
    const componentPortal = new ComponentPortal(toastComponent, null, toastInjector);
    const portal = outlet.attach(componentPortal) as ComponentRef<unknown>;
    portal.changeDetectorRef.detectChanges();
    return portal;
  }

  private _activateToast(ins: ActiveToast<unknown>, config: GlobalConfig, container: HTMLElement) {
    if (config.toastComponent === ToastBase) {
      ins.toastRef.activate();
      ins.portal.changeDetectorRef.detectChanges();
      return;
    }

    this.animateFlip(container, () => {
      ins.toastRef.activate();
      ins.portal.changeDetectorRef.detectChanges();
    });
  }

  private _buildNotification(
    toastType: string,
    message: string | undefined,
    title: string | undefined,
    config: GlobalConfig,
  ): ActiveToast<unknown> {
    if (!config.toastComponent) {
      throw new Error('toastComponent required');
    }

    if (this.retoastConfig.preventDuplicates) {
      const duplicate = this._handleDuplicate(title, message, config);
      if (duplicate) return duplicate;
    }

    this.previousToastMessage = message;
    const keepInactive = this._checkMaxOpened();

    const container = this.getContainerElement(config.positionClass);
    const toastWrapper = this.document.createElement('div');
    if (config.newestOnTop) {
      container.prepend(toastWrapper);
    } else {
      container.appendChild(toastWrapper);
    }

    this.index = this.index + 1;
    let sanitizedMessage: string | undefined | null = message;
    if (message && config.enableHtml) {
      sanitizedMessage = this.sanitizer.sanitize(SecurityContext.HTML, message);
    }

    const outlet = new DomPortalOutlet(toastWrapper, this.appRef, this._injector);

    const toastRef = new ToastRef({
      detach: () => {
        const action = () => {
          outlet.detach();
          toastWrapper.remove();
        };
        if (config.toastComponent === ToastBase) {
          action();
        } else {
          this.animateFlip(container, action);
        }
      },
    });

    const toastPackage = new ToastPackage(
      this.index,
      config,
      sanitizedMessage,
      title,
      toastType,
      toastRef,
    );

    const portal = this._attachComponent(config.toastComponent, toastPackage, outlet);
    toastRef.componentInstance = portal.instance;

    const ins: ActiveToast<unknown> = {
      toastId: this.index,
      title: title || '',
      message: message || '',
      toastRef,
      portal,
      toastPackage,
      onShown: toastRef.onShown,
      onHidden: toastRef.onHidden,
      onTap: toastRef.onTap,
      onAction: toastRef.onAction,
    };

    toastRef.onHidden.subscribe(() => {
      this._removeToast(ins.toastId);
    });

    if (!keepInactive) {
      this._activateToast(ins, config, container);
    }

    this.toasts.update((toasts) => [...toasts, ins]);
    return ins;
  }
}
