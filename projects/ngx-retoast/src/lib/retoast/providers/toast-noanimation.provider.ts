import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { DefaultNoComponentGlobalConfig, GlobalConfig, TOAST_CONFIG } from '../retoast-config';
import { ToastBase as ToastNoAnimation } from '../base-toast/base-toast.component';

export const DefaultNoAnimationsGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig,
  toastComponent: ToastNoAnimation,
};

export const provideNoAnimationRetoast = (
  config: Partial<GlobalConfig> = {},
): EnvironmentProviders => {
  const providers: Provider[] = [
    {
      provide: TOAST_CONFIG,
      useValue: {
        default: DefaultNoAnimationsGlobalConfig,
        config,
      },
    },
  ];

  return makeEnvironmentProviders(providers);
};

export { ToastNoAnimation };
