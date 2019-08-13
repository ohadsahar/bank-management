import { Action, UPDATE } from '@ngrx/store';
export const GET_ALL_CARDS = 'GET_ALL_CARDS';
export const GET_ALL_CARDS_SUCCESS = 'GET_ALL_CARDS_SUCCESS';
export const GET_ALL_CARDS_FAILED = 'GET_ALL_CARDS_FAILED';
export const CREATE_CARD = 'CREATE_CARD';
export const CREATE_CARD_SUCCESS = 'CREATE_CARD_SUCCESS';
export const CREATE_CARD_FAILED = 'CREATE_CARD_FAILED';
export const DELETE_CARD = 'DELETE_CARD';
export const DELETE_CARD_SUCCESS = 'DELETE_CARD_SUCCESS';
export const DELETE_CARD_FAILED = 'DELETE_CARD_FAILED';
export const UPDATE_CARD = 'UPDATE_CARD';
export const UPDATE_CARD_SUCCESS = 'UPDATE_CARD_SUCCESS';
export const UPDATE_CARD_FAILED = 'UPDATE_CARD_FAILED';

export class GetAllCards implements Action {
  readonly type = GET_ALL_CARDS;
  constructor(public payload: any) { }
}
export class GetAllCardsSuccess implements Action {
  readonly type = GET_ALL_CARDS_SUCCESS;
  constructor(public payload: any) { }
}

export class GetAllCardsFailed implements Action {
  readonly type = GET_ALL_CARDS_FAILED;
  constructor(public payload: any) { }
}

export class CreateCard implements Action {
  readonly type = CREATE_CARD;
  constructor(public payload: any) { }
}

export class CreateCardSuccess implements Action {
  readonly type = CREATE_CARD_SUCCESS;
  constructor(public payload: any) { }
}

export class CreateCardFailed implements Action {
  readonly type = CREATE_CARD_FAILED;
  constructor(public payload: any) { }
}
export class DeleteCard implements Action {
  readonly type = DELETE_CARD;
  constructor(public payload: any) { }
}
export class DeleteCardSuccess implements Action {
  readonly type = DELETE_CARD_SUCCESS;
  constructor(public payload: any) {
  }
}
export class DeleteCardFailed implements Action {
  readonly type = DELETE_CARD_FAILED;
  constructor(public payload: any) {
  }
}
export class UpdateCard implements Action {
  readonly type = UPDATE_CARD;
  constructor(public payload: any) { }
}
export class UpdateCardSuccess implements Action {
  readonly type = UPDATE_CARD_SUCCESS;
  constructor(public payload: any) {
  }
}
export class UpdateCardFailed implements Action {
  readonly type = UPDATE_CARD_FAILED;
  constructor(public payload: any) {
  }
}
export type Actions = GetAllCards | GetAllCardsSuccess | GetAllCardsFailed | CreateCard | CreateCardSuccess | CreateCardFailed
  | DeleteCard | DeleteCardSuccess | DeleteCardFailed | UpdateCard | UpdateCardSuccess | UpdateCardFailed;
