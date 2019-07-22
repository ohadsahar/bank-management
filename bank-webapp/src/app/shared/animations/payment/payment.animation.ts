import { trigger, style, animate, transition, keyframes,state } from '@angular/animations';

export const topItemTrigger = trigger('topItem', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(100%)'
    }),
    animate(1200)
  ]),
]);


export const keyFrameTrigger = trigger('enterItem', [
  state('unclicked', style({
    backgroundColor: 'orange'
  })),
  state('clicked', style({
    backgroundColor: 'purple'
  })),
  transition('unclicked => clicked', [
    style({
      opacity: 1
    }),
    animate(5000, keyframes([
      style({
          backgroundColor: 'red',
          transform: 'translateX(30%)'
      }),
      style({
        backgroundColor: 'green',
        transform: 'translateX(60%)'
      }),
      style({
        backgroundColor: 'blue',
        transform: 'translateX(-30%)'
      }),
      style({
        backgroundColor:  'red',
        transform: 'translateX(0%)'
      })
    ]))
  ]),
  transition('clicked => unclicked', [
    style({
      opacity: 1
    }),
    animate(5000, keyframes([
      style({
          backgroundColor: 'yellow',
          transform: 'translateX(-30%)'
      }),
      style({
        backgroundColor: 'pink',
        transform: 'translateX(-60%)'
      }),
      style({
        backgroundColor: 'orange',
        transform: 'translateX(30%)'
      }),
      style({
        backgroundColor:  'red',
        transform: 'translateX(0%)'
      })
    ]))
  ]),
]);
