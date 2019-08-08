import { HttpClient } from '@angular/common/http';
import { CardsModel } from './../../shared/models/cards.model';
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';

const backendUrl = environment.backendUrlCards;

@Injectable({ providedIn: 'root' })


export class CardService {

  constructor(private http: HttpClient) { }

  createCard(cardData: CardsModel) {
    return this.http.post<{ message: CardsModel }>(backendUrl, cardData);
  }

  getAllCards(username: string) {
    return this.http.get<{ message: CardsModel[] }>(`${backendUrl}/${username}`);
  }
}
