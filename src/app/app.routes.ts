import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'calendar' },
  {
    path: 'calendar',
    loadChildren: () =>
      import('./features/calendar/calendar.routes').then(
        (m) => m.CALENDAR_ROUTES
      ),
  },
  {
    path: '**',
    redirectTo: 'calendar',
  },
];
