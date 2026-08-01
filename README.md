# ngx-retoast

This project was forked from [ngx-toastr](https://github.com/scttcper/ngx-toastr)

## Features

- Toast Component Injection using Angular CDK Overlay
- No use of `@for`. Fewer dirty checks and higher performance
- No use of `@angular/animations`
- Components, Directives, Pipes are strictly Standalone
- AoT compilation and lazy loading compatible
- Component inheritance for custom toasts
- Output toasts to an optional target directive

## Dependencies

Latest version available for each version of Angular

| ngx-retoast | Angular |
| ----------- | ------- |
| 1.0.0       | >= 22.x |

## Install

```bash
npm install ngx-retoast --save
```

## Setup

**step 1:** add css

- copy
  [toast css](https://github.com/EliasVal/ngx-retoast/blob/main/projects/ngx-retoast/src/lib/styles/toastr.css)
  to your project.
- If you are using sass you can import the css.

```scss
// regular style toast
@import 'ngx-retoast/src/lib/styles/toastr';
```

- If you are using angular-cli you can add it to your angular.json

```ts
"styles": [
  "styles.scss",
  "node_modules/ngx-retoast/src/lib/styles/toastr.css" // try adding '../' if you're using angular cli before 6
]
```

**step 2:** add `provideToastr` to your application providers.

```typescript
import { AppComponent } from './src/app.component';
import { provideToastr } from 'ngx-retoast';

bootstrapApplication(AppComponent, {
  providers: [
    provideToastr(), // Toastr providers
  ],
});
```

## Use

```typescript
import { ToastrService } from 'ngx-retoast';
import { inject } from '@angular/core';

@Component({...})
export class YourComponent {
  toastr = inject(ToastrService);

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
}
```

## Options

There are **individual options** and **global options**.

### Individual Options

Passed to `ToastrService.success/error/warning/info/show()`

| Option            | Type                                        | Default           | Description                                                                                                                                     |
| ----------------- | ------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| toastComponent    | Component                                   | Toast             | Angular component that will be used                                                                                                             |
| closeButton       | boolean                                     | false             | Show close button                                                                                                                               |
| timeOut           | number                                      | 5000              | Time to live in milliseconds                                                                                                                    |
| extendedTimeOut   | number                                      | 1000              | Time to close after a user hovers over toast                                                                                                    |
| disableTimeOut    | `boolean \| 'timeOut' \| 'extendedTimeOut'` | false             | Disable both timeOut and extendedTimeOut when set to `true`. Allows specifying which timeOut to disable, either: `timeOut` or `extendedTimeOut` |
| easing            | string                                      | 'ease-in'         | Toast component easing                                                                                                                          |
| easeTime          | string \| number                            | 300               | Time spent easing                                                                                                                               |
| enableHtml        | boolean                                     | false             | Allow html in message                                                                                                                           |
| newestOnTop       | boolean                                     | true              | New toast placement                                                                                                                             |
| progressBar       | boolean                                     | false             | Show progress bar                                                                                                                               |
| progressAnimation | `'decreasing' \| 'increasing'`              | 'decreasing'      | Changes the animation of the progress bar.                                                                                                      |
| toastClass        | string                                      | 'ngx-retoast'     | CSS class(es) for toast                                                                                                                         |
| positionClass     | string                                      | 'toast-top-right' | CSS class(es) for toast container                                                                                                               |
| titleClass        | string                                      | 'toast-title'     | CSS class(es) for inside toast on title                                                                                                         |
| messageClass      | string                                      | 'toast-message'   | CSS class(es) for inside toast on message                                                                                                       |
| tapToDismiss      | boolean                                     | true              | Close on click                                                                                                                                  |
| onActivateTick    | boolean                                     | false             | Fires `changeDetectorRef.detectChanges()` when activated. Helps show toast from asynchronous events outside of Angular's change detection       |

#### Setting Individual Options

success, error, info, warning take `(message, title, ToastConfig)` pass an
options object to replace any default option.

```typescript
this.toastrService.error('everything is broken', 'Major Error', {
  timeOut: 3000,
});
```

### Global Options

All [individual options](#individual-options) can be overridden in the global
options to affect all toasts. In addition, global options include the following
options:

| Option                  | Type    | Default                            | Description                                                                                                   |
| ----------------------- | ------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| maxOpened               | number  | 0                                  | Max toasts opened. Toasts will be queued. 0 is unlimited                                                      |
| autoDismiss             | boolean | false                              | Dismiss current toast when max is reached                                                                     |
| iconClasses             | object  | [see below](#iconclasses-defaults) | Classes used on toastr service methods                                                                        |
| preventDuplicates       | boolean | false                              | Block duplicate messages                                                                                      |
| countDuplicates         | boolean | false                              | Displays a duplicates counter (preventDuplicates must be true). Toast must have a title and duplicate message |
| resetTimeoutOnDuplicate | boolean | false                              | Reset toast timeout on duplicate (preventDuplicates must be true)                                             |
| includeTitleDuplicates  | boolean | false                              | Include the title of a toast when checking for duplicates (by default only message is compared)               |

##### iconClasses defaults

```typescript
iconClasses = {
  error: 'toast-error',
  info: 'toast-info',
  success: 'toast-success',
  warning: 'toast-warning',
};
```

#### Setting Global Options

Pass values to `provideToastr()` to set global options.

```typescript
import { AppComponent } from './src/app.component';
import { provideToastr } from 'ngx-retoast';

bootstrapApplication(AppComponent, {
  providers: [
    provideToastr({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
});
```

### Toastr Service methods return:

```typescript
export interface ActiveToast {
  /** Your Toast ID. Use this to close it individually */
  toastId: number;
  /** the title of your toast. Stored to prevent duplicates if includeTitleDuplicates set */
  title: string;
  /** the message of your toast. Stored to prevent duplicates */
  message: string;
  /** a reference to the component see portal.ts */
  portal: ComponentRef<any>;
  /** a reference to your toast */
  toastRef: ToastRef<any>;
  /** triggered when toast is active */
  onShown: Observable<any>;
  /** triggered when toast is destroyed */
  onHidden: Observable<any>;
  /** triggered on toast click */
  onTap: Observable<any>;
  /** available for your use in custom toast */
  onAction: Observable<any>;
}
```

### Put toasts in your own container

Put toasts in a specific div inside your application. This should probably be
somewhere that doesn't get deleted. Make sure that your container has
an `aria-live="polite"` attribute, so that any time a toast is injected into
the container it is announced by screen readers.

Add a div with `toastContainer` directive on it.

```typescript
import { Component, OnInit, viewChild, inject } from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-retoast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastContainerDirective],
  template: `
    <h1><a (click)="onClick()">Click</a></h1>
    <div aria-live="polite" toastContainer></div>
  `,
})
export class AppComponent implements OnInit {
  toastContainer = viewChild(ToastContainerDirective);
  toastrService = inject(ToastrService);

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer()!;
  }

  onClick() {
    this.toastrService.success('in div');
  }
}
```

## Functions

##### Clear

Remove all or a single toast by optional id

```ts
toastrService.clear(toastId?: number);
```

##### Remove

Remove and destroy a single toast by id

```
toastrService.remove(toastId: number);
```

## Setup Without Animations

If you do not want animations you can override the default
toast component in the global config to use
`ToastNoAnimation` instead of the default one.

```typescript
import { provideNoAnimationToastr } from 'ngx-retoast';

bootstrapApplication(AppComponent, {
  providers: [provideNoAnimationToastr()],
});
```

That's it! No animations.

## Using A Custom Toast

Create your toast component extending Toast. See the default toast component for an example:
https://github.com/EliasVal/ngx-retoast/blob/main/projects/ngx-retoast/src/lib/toastr/toast/toast.component.ts

```typescript
import { provideToastr } from 'ngx-retoast';

bootstrapApplication(AppComponent, {
  providers: [
    provideToastr({
      toastComponent: YourToastComponent, // added custom toast!
    }),
  ],
});
```

## FAQ

1.  ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it
    was checked\
    When opening a toast inside an angular lifecycle wrap it in setTimeout

```typescript
ngOnInit() {
    setTimeout(() => this.toastr.success('sup'))
}
```

2.  Change default icons (check, warning sign, etc)\
    Overwrite the css background-image: https://github.com/EliasVal/ngx-retoast/blob/main/projects/ngx-retoast/src/lib/styles/toastr.css.
3.  How do I use this in an ErrorHandler?\
    See: https://github.com/EliasVal/ngx-retoast/issues/179.
4.  How can I translate messages?\
    See: https://github.com/EliasVal/ngx-retoast/issues/201.
5.  How to handle toastr click/tap action?
    ```ts
    showToaster() {
      this.toastr.success('Hello world!', 'Toastr fun!')
        .onTap
        .pipe(take(1))
        .subscribe(() => this.toasterClickedHandler());
    }

    toasterClickedHandler() {
      console.log('Toastr clicked');
    }
    ```
6.  How to customize styling without overridding defaults?\
    Add multiple CSS classes separated by a space:
    ```ts
    toastClass: 'yourclass ngx-retoast';
    ```
    See: https://github.com/EliasVal/ngx-retoast/issues/594.

## Previous Works

[toastr](https://github.com/CodeSeven/toastr) original toastr\
[angular-toastr](https://github.com/Foxandxss/angular-toastr) AngularJS toastr\
[notyf](https://github.com/caroso1222/notyf) notyf (css)

## License

MIT

---

> GitHub [@EliasVal](https://github.com/EliasVal)
