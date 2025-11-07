// app.component.ts (or a dedicated animation file)
import { animate, group, query, style, transition, trigger } from '@angular/animations';

export const fadeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({position: 'absolute', width: '100%', opacity: 0})
    ], {optional: true}),
    group([
      query(':leave', [
        animate('300ms ease', style({opacity: 0}))
      ], {optional: true}),
      query(':enter', [
        animate('300ms ease', style({opacity: 1}))
      ], {optional: true})
    ])
  ])
]);
