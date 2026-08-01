import { DefaultNoComponentGlobalConfig, GlobalConfig, TOAST_CONFIG } from '../retoast-config';
import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { Toast } from '../toast/toast.component';

export const DefaultGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig,
  toastComponent: Toast,
};

/**
 * @description
 * Provides the `TOAST_CONFIG` token with the given config.
 *
 * @param config The config to configure retoast.
 * @returns The environment providers.
 *
 * @example
 * ```ts
 * import { provideRetoast } from 'ngx-retoast';
 *
 * bootstrap(AppComponent, {
 *   providers: [
 *     provideRetoast({
 *       timeOut: 2000,
 *       positionClass: 'toast-top-right',
 *     }),
 *   ],
 * })
 */
export const provideRetoast = (config: Partial<GlobalConfig> = {}): EnvironmentProviders => {
  const providers: Provider[] = [
    {
      provide: TOAST_CONFIG,
      useValue: {
        default: DefaultGlobalConfig,
        config,
      },
    },
  ];

  return makeEnvironmentProviders(providers);
};
