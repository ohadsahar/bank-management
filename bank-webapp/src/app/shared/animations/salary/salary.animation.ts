import { trigger, transition, animate, style } from '@angular/animations';

export const bottomItemTrigger = trigger('bottomItem', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(-100%)'
    }),
    animate(1200)
  ]),
]);

export const topItemTrigger = trigger('topItem', [
  transition(':enter', [
    style ({
      opacity: 0,
      transform: 'translateY(100%)'
    }),
    animate(1200)
  ]),
]);

