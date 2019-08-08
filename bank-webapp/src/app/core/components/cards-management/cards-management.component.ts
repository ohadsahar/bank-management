import { MatTableDataSource } from '@angular/material';
import { LoginService } from '@app/services/login.service';
import { CardService } from './../../services/card.service';
import { NgForm } from '@angular/forms';
import { CardsModel } from './../../../shared/models/cards.model';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';


@Component({
  selector: 'app-cards-management',
  templateUrl: './cards-management.component.html',
  styleUrls: ['./cards-management.component.css'],
})

export class CardsManagementComponent implements OnInit {

  public cards: CardsModel[];
  displayedColumns: string[] = ['cardName', 'billingDate'];
  currentUsername: string;
  dataSource = new MatTableDataSource(this.cards);
  constructor(private cardService: CardService, private loginService: LoginService) {
    this.cards = [];
  }

  ngOnInit() {
    this.onLoadComponent();
  }
  onLoadComponent() {
    this.currentUsername = this.loginService.getUsernameAndId().username;
    this.getAllCards();
  }
  createNewCard(form: NgForm) {
    form.value.username = this.currentUsername;
    this.cardService.createCard(form.value).subscribe(response => {
      this.cards.push(response.message);
      form.reset();
      this.updateTable();
    });
  }
  getAllCards() {
    this.cardService.getAllCards(this.currentUsername).subscribe(response => {
      this.cards = response.message;
      this.updateTable();
    });
  }
  updateTable() {
    this.dataSource = new MatTableDataSource(this.cards);
  }
}
