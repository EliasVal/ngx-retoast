import { InjectionToken, signal } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { ToastRef } from './toast-ref';

export type ProgressAnimationType = 'increasing' | 'decreasing';
export type DisableTimoutType = boolean | 'timeOut' | 'extendedTimeOut';

export interface IndividualConfig<ConfigPayload = unknown> {
  disableTimeOut: DisableTimoutType;
  timeOut: number;
  closeButton: boolean;
  extendedTimeOut: number;
  progressBar: boolean;
  progressAnimation: ProgressAnimationType;
  enableHtml: boolean;
  toastClass: string;
  positionClass: string;
  titleClass: string;
  messageClass: string;
  easing: string;
  easeTime: string | number;
  tapToDismiss: boolean;
  toastComponent?: ComponentType<unknown>;
  newestOnTop: boolean;
  payload?: ConfigPayload;
}

export interface RetoastIconClasses {
  error: string;
  info: string;
  success: string;
  warning: string;
  [key: string]: string;
}

export interface GlobalConfig<C = unknown> extends IndividualConfig<C> {
  maxOpened: number;
  autoDismiss: boolean;
  iconClasses: Partial<RetoastIconClasses>;
  preventDuplicates: boolean;
  countDuplicates: boolean;
  resetTimeoutOnDuplicate: boolean;
  duplicateTitleCheck: boolean;
}

export class ToastPackage<ConfigPayload = unknown> {
  public readonly tap = signal<number>(0);
  public readonly action = signal<unknown>(undefined);

  constructor(
    public readonly toastId: number,
    public readonly config: IndividualConfig<ConfigPayload>,
    public readonly message: string | null | undefined,
    public readonly title: string | undefined,
    public readonly toastType: string,
    public readonly toastRef: ToastRef<unknown>,
  ) {}

  public triggerTap(): void {
    this.tap.update((v) => v + 1);
    this.toastRef._triggerTap();
    if (this.config.tapToDismiss) {
      this.toastRef.manualClose();
    }
  }

  public triggerAction(action?: unknown): void {
    this.action.set(action);
    this.toastRef._triggerAction(action);
  }
}

export const DefaultNoComponentGlobalConfig: GlobalConfig = {
  maxOpened: 0,
  autoDismiss: false,
  newestOnTop: true,
  preventDuplicates: false,
  countDuplicates: false,
  resetTimeoutOnDuplicate: false,
  duplicateTitleCheck: false,

  iconClasses: {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  },

  closeButton: false,
  disableTimeOut: false,
  timeOut: 5000,
  extendedTimeOut: 1000,
  enableHtml: false,
  progressBar: false,
  toastClass: 'ngx-retoast',
  positionClass: 'toast-top-right',
  titleClass: 'toast-title',
  messageClass: 'toast-message',
  easing: 'ease-in',
  easeTime: 150,
  tapToDismiss: true,
  progressAnimation: 'decreasing',
};

export interface ToastToken {
  default: GlobalConfig;
  config: Partial<GlobalConfig>;
}

export const TOAST_CONFIG = new InjectionToken<ToastToken>('ToastConfig');
