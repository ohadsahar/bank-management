import {trigger, animate, style, transition} from '@angular/animations';

export const upSideItemTrigger = trigger('upSideItem', [
  transition(':enter', [
    style({
      transform: 'translateY(-100%)',
      opacity: 0
    }),
    animate(1000)
  ]),
]);

export const bottomSideItemTrigger = trigger('bottomSideItem', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(100%)'
    }),
    animate(1000)
  ]),
]);


