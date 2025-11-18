
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root component of the Kira payment application.
 *
 * This is the top-level component that bootstraps the entire application.
 * It serves as the entry point and provides the router outlet for
 * displaying routed components.
 *
 * @example
 * ```typescript
 * // In main.ts
 * bootstrapApplication(AppComponent, appConfig);
 * ```
 *
 * @example
 * ```typescript
 * // The component is automatically instantiated by Angular
 * // and provides the foundation for the routing system
 * ```
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet]
})
export class AppComponent {}
