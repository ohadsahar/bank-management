import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MessageService } from './../../services/message.service';
import { EditCardModel } from './../../../shared/models/edit-card.model';
import { MatTableDataSource } from '@angular/material';
import { LoginService } from '@app/services/login.service';
import { CardService } from './../../services/card.service';
import { NgForm } from '@angular/forms';
import { CardsModel } from './../../../shared/models/cards.model';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-cards-management',
  templateUrl: './cards-management.component.html',
  styleUrls: ['./cards-management.component.css'],
})

export class CardsManagementComponent implements OnInit {

  public cards: CardsModel[];
  editCardForm = new EditCardModel('', '', '', null);
  displayedColumns: string[] = ['options', 'cardName', 'billingDate'];
  currentUsername: string;
  isLoading: boolean;
  dataSource = new MatTableDataSource(this.cards);
  editoptionsable: any = {};
  constructor(private cardService: CardService, private loginService: LoginService, private messageService: MessageService,
              private spinnerService: Ng4LoadingSpinnerService) {
    this.isLoading = false;
    this.cards = [];
  }

  ngOnInit() {
    this.onLoadComponent();
  }
  onLoadComponent() {
    this.loading();
    this.currentUsername = this.loginService.getUsernameAndId().username;
    this.getAllCards();
  }
  createNewCard(form: NgForm) {
    if (form.invalid) {
      return;
    }
    form.value.username = this.currentUsername;
    this.cardService.createCard(form.value).subscribe(response => {
      this.cards.push(response.message);
      form.reset();
      this.updateTable();
    }, (error) => {
      this.messageService.failedMessage(error, ' Dismiss');
    });
  }
  getAllCards() {
    this.cardService.getAllCards(this.currentUsername).subscribe(response => {
      this.cards = response.message;
      this.updateTable();
    },
      (error) => {
        this.loaded();
        this.messageService.failedMessage(error, ' Dismiss');
      }
    );
  }
  deleteCard(id: string) {
    this.loading();
    this.cardService.deleteCard(id).subscribe(response => {
      const deleteCards = this.cards.filter(card => card._id !== response.message);
      this.cards = deleteCards;
      this.updateTable();
    },
      (error) => {
        this.loaded();
        this.messageService.failedMessage(error, ' Dismiss');
      }
    );
  }
  updateTable() {
    this.dataSource = new MatTableDataSource(this.cards);
    this.loaded();
  }
  editCard(card: CardsModel) {
    this.editCardForm._id = card._id;
    this.editCardForm.username = card.username;
    this.editCardForm.cardName = card.cardName;
    this.editCardForm.billingDate = card.billingDate;
  }
  updateCard() {
    this.loading();
    if (this.validateCard()) {
      this.cardService.updateCard(this.editCardForm).subscribe(response => {
        const index = this.cards.findIndex(card => card._id === response.message._id);
        this.cards[index] = response.message;
        this.updateTable();
      },
        (error) => {
          this.loaded();
          this.messageService.failedMessage(error, ' Dismiss');
        }
      );
    }
  }
  validateCard() {
    if (this.editCardForm.billingDate && this.editCardForm.cardName) {
      return true;
    }
    return false;
  }
  loading() {
    this.isLoading = true;
    this.spinnerService.show();
  }
  loaded() {
    this.isLoading = false;
    this.spinnerService.hide();
  }
}
