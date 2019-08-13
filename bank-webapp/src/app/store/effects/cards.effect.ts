import { CardService } from './../../core/services/card.service';
import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as cardActions from '../actions/cards.actions';
import { switchMap, map, catchError, exhaustMap } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class CardsEffects {

  constructor(private actions$: Actions, private cardService: CardService) { }
  @Effect()
  public getAllCards$ = this.actions$.pipe(ofType(cardActions.GET_ALL_CARDS))
    .pipe(switchMap((action: cardActions.GetAllCards) =>
      this.cardService.getAllCards(action.payload).pipe(map((data) => {
        if (data.message) {
          return new cardActions.GetAllCardsSuccess(data.message);
        }
      }),
        catchError((error) => {
          return of(new cardActions.GetAllCardsFailed(error));
        }),
      ),
    ),
    );

  @Effect()
  public createCard$ = this.actions$.pipe(ofType(cardActions.CREATE_CARD))
    .pipe(exhaustMap((action: cardActions.CreateCard) =>
      this.cardService.createCard(action.payload).pipe(map((data) => {
        if (data.message) {
          return new cardActions.CreateCardSuccess(data.message);
        }
      }),
        catchError((error) => {
          return of(new cardActions.CreateCardFailed(error));
        }),
      ),
    ),
    );

  @Effect()
  public deleteCard$ = this.actions$.pipe(ofType(cardActions.DELETE_CARD))
    .pipe(exhaustMap((action: cardActions.DeleteCard) =>
      this.cardService.deleteCard(action.payload).pipe(map((data) => {
        if (data.message) {
          return new cardActions.DeleteCardSuccess(data.message);
        }
      }),
        catchError((error) => {
          return of(new cardActions.DeleteCardFailed(error));
        }),
      ),
    ),
    );

  @Effect()
  public updateCard$ = this.actions$.pipe(ofType(cardActions.UPDATE_CARD))
    .pipe(exhaustMap((action: cardActions.UpdateCard) =>
      this.cardService.updateCard(action.payload).pipe(map((data) => {
        if (data.message) {
          return new cardActions.UpdateCardSuccess(data.message);
        }
      }),
        catchError((error) => {
          return of(new cardActions.UpdateCardFailed(error));
        }),
      ),
    ),
    );
}
