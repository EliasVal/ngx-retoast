# ngx-retoast

A modern, high-performance Angular toast notification library.

This project is a complete rewrite and modernization of the popular `ngx-toastr` library, designed specifically for modern Angular applications. It removes legacy dependencies and embraces the latest Angular features for maximum performance and simplicity.

## Requirements

- Angular >= 20.2
- Zoneless Only

## Features

- No @angular/animations
- A11y Friendly: ARIA live regions and accessibility best practices built-in
- Customizable: Create custom toasts through component inheritance

## Installation

```bash
npm install ngx-retoast
```

## Setup

### 1. Add Styles

You need to include the default CSS to your project.

If you are using Angular CLI, add it to your `angular.json`:

```json
"styles": [
  "src/styles.scss",
  "node_modules/ngx-retoast/styles/retoast.css"
]
```

Or import it directly in your global stylesheet:

```scss
@import 'ngx-retoast/retoast.css';
```

### 2. Provide Retoast

Add the `provideRetoast` function to your application bootstrap providers.

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRetoast } from 'ngx-retoast';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRetoast({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
};
```

## Usage

Inject the `RetoastService` in your components to show notifications.

```typescript
import { Component, inject } from '@angular/core';
import { RetoastService } from 'ngx-retoast';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: `<button (click)="showSuccess()">Show Toast</button>`,
})
export class DemoComponent {
  private retoast = inject(RetoastService);

  showSuccess() {
    this.retoast.success('Your changes have been saved!', 'Success');
  }
}
```

## Advanced Usage

### Handling Toast Events

The `RetoastService` methods return an `ActiveToast` object which contains `onShown`, `onHidden`, `onTap`, and `onAction` events:

```typescript
import { Component, inject } from '@angular/core';
import { RetoastService } from 'ngx-retoast';

@Component({
  // ...
})
export class DemoComponent {
  private retoast = inject(RetoastService);

  showInteractiveToast() {
    const toast = this.retoast.info('Click me for more details', 'Update Available');

    if (toast) {
      toast.onTap.subscribe(() => {
        console.log('User clicked the toast!');
      });

      toast.onHidden.subscribe(() => {
        console.log('Toast was closed');
      });
    }
  }
}
```

### Custom Toast Container

You can render toasts in a specific container instead of the body. This is useful for scoped layouts. Add the `toastContainer` directive to your target element and pass it to the service.

```typescript
import { Component, OnInit, viewChild, inject } from '@angular/core';
import { ToastContainerDirective, RetoastService } from 'ngx-retoast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastContainerDirective],
  template: ` <div aria-live="polite" toastContainer></div> `,
})
export class AppComponent implements OnInit {
  toastContainer = viewChild(ToastContainerDirective);
  retoastService = inject(RetoastService);

  ngOnInit() {
    this.retoastService.overlayContainer = this.toastContainer()!;
  }
}
```

## API Reference

### RetoastService Methods

All toast methods accept an optional `IndividualConfig` object to override global settings for a specific toast.

- `success(message, title?, config?)`
- `error(message, title?, config?)`
- `info(message, title?, config?)`
- `warning(message, title?, config?)`
- `show(message, title?, config?, type?)`
- `clear(toastId?)` - Clears all toasts, or a specific toast if an ID is provided.
- `remove(toastId)` - Removes a specific toast.

### Global & Individual Options

Options can be provided globally via `provideRetoast(options)` or individually per toast.

| Option              | Type                        | Default           | Description                                       |
| :------------------ | :-------------------------- | :---------------- | :------------------------------------------------ |
| `timeOut`           | number                      | 5000              | Time to live in milliseconds.                     |
| `extendedTimeOut`   | number                      | 1000              | Time to close after a user hovers over the toast. |
| `disableTimeOut`    | boolean / string            | false             | Disable timeOut, extendedTimeOut, or both.        |
| `closeButton`       | boolean                     | false             | Show a close button.                              |
| `progressBar`       | boolean                     | false             | Show a progress bar indicating time remaining.    |
| `progressAnimation` | 'decreasing' / 'increasing' | 'decreasing'      | Animation direction of the progress bar.          |
| `enableHtml`        | boolean                     | false             | Allow HTML in the message string.                 |
| `newestOnTop`       | boolean                     | true              | Place new toasts at the top of the stack.         |
| `tapToDismiss`      | boolean                     | true              | Close the toast when clicked.                     |
| `toastClass`        | string                      | 'ngx-retoast'     | Base CSS class for the toast.                     |
| `positionClass`     | string                      | 'toast-top-right' | CSS class for the toast container position.       |
| `titleClass`        | string                      | 'toast-title'     | CSS class for the toast title.                    |
| `messageClass`      | string                      | 'toast-message'   | CSS class for the toast message.                  |
| `easing`            | string                      | 'ease-in'         | CSS easing function for animations.               |
| `easeTime`          | string / number             | 300               | Animation duration in milliseconds.               |
| `toastComponent`    | Component                   | Toast             | The Angular component to use for rendering.       |

### Global Only Options

These options can only be set globally via `provideRetoast(options)`.

| Option                    | Type    | Default | Description                                                       |
| :------------------------ | :------ | :------ | :---------------------------------------------------------------- |
| `maxOpened`               | number  | 0       | Max toasts opened simultaneously. 0 is unlimited.                 |
| `autoDismiss`             | boolean | false   | Automatically dismiss the oldest toast when maxOpened is reached. |
| `preventDuplicates`       | boolean | false   | Block duplicate messages from being shown.                        |
| `countDuplicates`         | boolean | false   | Display a counter on duplicate toasts.                            |
| `resetTimeoutOnDuplicate` | boolean | false   | Reset the timeout when a duplicate is received.                   |
| `includeTitleDuplicates`  | boolean | false   | Include the title when checking for duplicates.                   |

## Custom Toast Component

To create a custom toast, extend the `ToastBase` class and configure `ngx-retoast` to use it globally or locally.

```typescript
import { Component } from '@angular/core';
import { ToastBase } from 'ngx-retoast';

@Component({
  selector: 'app-custom-toast',
  standalone: true,
  template: `
    <div class="my-custom-toast" [class]="toastClasses()">
      @if (title()) {
        <h4>{{ title() }}</h4>
      }
      @if (message()) {
        <p>{{ message() }}</p>
      }
    </div>
  `,
})
export class CustomToastComponent extends ToastBase {}
```

Then provide it in your config:

```typescript
provideRetoast({
  toastComponent: CustomToastComponent,
});
```

## Disabling Animations

If you prefer an instant snap-in experience without animations, you can use the no-animation provider:

```typescript
import { provideNoAnimationRetoast } from 'ngx-retoast';

export const appConfig: ApplicationConfig = {
  providers: [provideNoAnimationRetoast()],
};
```

## Migration Guide (ngx-toastr to ngx-retoast)

Migrating from `ngx-toastr` to `ngx-retoast` is straightforward. The core design philosophy has been preserved, but you will need to update your imports, providers, and event handling.

### 1. Update Imports and Services

Change all imports from `ngx-toastr` to `ngx-retoast`.

- `ToastrService` -> `RetoastService`
- `provideToastr` -> `provideRetoast`
- `ToastrModule` -> **Removed.** (Use standalone `provideRetoast` instead)

```typescript
// Before
import { ToastrService } from 'ngx-toastr';
// After
import { RetoastService } from 'ngx-retoast';
```

### 2. Update CSS Imports

Update your global stylesheet or `angular.json` styles array:

```css
// Before
@import 'ngx-toastr/toastr';
// After
@import 'ngx-retoast/styles/retoast.css';
```

```scss
// Before
@import 'ngx-toastr/toastr.css';
// After
@import 'ngx-retoast/styles/retoast.css';
```

### 3. Event Handling (Observables)

`ngx-retoast` retains the same `Observable`-based event handling as `ngx-toastr`. Observables like `onShown`, `onHidden`, `onTap`, and `onAction` work exactly the same way.

```typescript
import { Subscription } from 'rxjs';

const toast = this.retoast.success('Message');
const sub: Subscription = toast.onTap.subscribe(() => console.log('Tapped!'));
sub.unsubscribe();
```

### 4. Custom Toasts (Component Inheritance)

If you built a custom toast component, the base class has been updated. You no longer need @angular/animations for custom entry/exit effects, as all list management and animation handling is automatically done via native CSS FLIP animations.
