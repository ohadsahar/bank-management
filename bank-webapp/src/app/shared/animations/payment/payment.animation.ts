import { trigger, style, animate, transition, } from '@angular/animations';

export const topItemTrigger = trigger('topItem', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(100%)'
    }),
    animate(1200)
  ]),
]);


