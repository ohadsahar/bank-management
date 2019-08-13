import { map, takeUntil } from 'rxjs/operators';
import { Observable, of, combineLatest, Subject } from 'rxjs';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MessageService } from './../../services/message.service';
import { EditCardModel } from './../../../shared/models/edit-card.model';
import { MatTableDataSource, MatSort, MatPaginator, PageEvent, Sort } from '@angular/material';
import { LoginService } from '@app/services/login.service';
import { CardService } from './../../services/card.service';
import { NgForm } from '@angular/forms';
import { CardsModel } from './../../../shared/models/cards.model';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromMatSort, fromMatPaginator, paginateRows } from 'src/app/table-util';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import * as cardActions from '../../../store/actions/cards.actions';

type SortFn<U> = (a: U, b: U) => number;
interface PropertySortFns<U> {
  [prop: string]: SortFn<U>;
}
@Component({
  selector: 'app-cards-management',
  templateUrl: './cards-management.component.html',
  styleUrls: ['./cards-management.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class CardsManagementComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public cards: CardsModel[];
  editCardForm = new EditCardModel('', '', '', null);
  currentUsername: string;
  isLoading: boolean;
  ngbSubscribe$: Subject<void> = new Subject<void>();
  dataSource = new MatTableDataSource(this.cards);
  editoptionsable: any = {};
  displayedRows$: Observable<any[]>;
  totalRows$: Observable<number>;
  public sortEvents$: Observable<Sort>;
  public pageEvents$: Observable<PageEvent>;
  constructor(private loginService: LoginService, private messageService: MessageService,
    private spinnerService: Ng4LoadingSpinnerService, private store: Store<fromRoot.State>) {
    this.isLoading = false;
    this.cards = [];
  }

  ngOnInit() {
    this.onLoadComponent();
  }
  onLoadComponent() {
    this.sortEvents$ = fromMatSort(this.sort);
    this.pageEvents$ = fromMatPaginator(this.paginator);
    this.currentUsername = this.loginService.getUsernameAndId().username;
    this.getAllCards();
  }
  createNewCard(form: NgForm) {
    this.loading();
    if (form.invalid) {
      return;
    }
    form.value.username = this.currentUsername;
    this.store.dispatch(new cardActions.CreateCard(form.value));
    const dataToSubscribe = this.store.select(fromRoot.getCardsData).pipe(takeUntil(this.ngbSubscribe$))
      .subscribe((data) => {
        if (!data.loading) {
          this.cards.push(data.data);
          form.reset();
          this.updateTable();
          this.loaded();
          dataToSubscribe.unsubscribe();
        }
      }, (error) => {
        this.loaded();
        this.messageService.failedMessage(error, ' Dismiss');
      });
  }
  getAllCards() {
    this.loading();
    this.store.dispatch(new cardActions.GetAllCards(this.currentUsername));
    const dataToSubscribe = this.store.select(fromRoot.getCardsData).pipe(takeUntil(this.ngbSubscribe$))
      .subscribe((data) => {
        if (!data.loading) {
          this.cards = data.data;
          this.loaded();
          this.updateTable();
          dataToSubscribe.unsubscribe();
        }
      }, (error) => {
        this.loaded();
        this.messageService.failedMessage(error, ' Dismiss');
      });

  }
  deleteCard(id: string) {
    this.loading();
    this.store.dispatch(new cardActions.DeleteCard(id));
    const dataToSubscribe = this.store.select(fromRoot.getCardsData).pipe(takeUntil(this.ngbSubscribe$))
      .subscribe((data) => {
        if (!data.loading) {
          const deleteCards = this.cards.filter(card => card._id !== data.data);
          this.cards = deleteCards;
          this.updateTable();
          this.loaded();
          dataToSubscribe.unsubscribe();
        }
      }, (error) => {
        this.loaded();
        this.messageService.failedMessage(error, ' Dismiss');
      });
  }
  updateTable(): void {
    const rows$ = of(this.cards);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(this.sortRows(this.sortEvents$), paginateRows(this.pageEvents$));
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
      this.store.dispatch(new cardActions.UpdateCard(this.editCardForm));
      const dataToSubscribe = this.store.select(fromRoot.getCardsData).pipe(takeUntil(this.ngbSubscribe$))
        .subscribe((data) => {
          if (!data.loading) {
            const index = this.cards.findIndex(card => card._id === data.data._id);
            this.cards[index] = data.data;
            this.updateTable();
            this.messageService.successMessage('הכרטיס עודכן בהצלחה', 'Dismiss');
            this.loaded();
            dataToSubscribe.unsubscribe();
          }
        }, (error) => {
          this.loaded();
          this.messageService.failedMessage(error, ' Dismiss');
        });
    }
  }
  validateCard() {
    if (this.editCardForm.billingDate && this.editCardForm.cardName) {
      return true;
    }
    return false;
  }
  sortRows<U>(
    sort$: Observable<Sort>,
    sortFns: PropertySortFns<U> = {},
    useDefault = true
  ): (obs$: Observable<U[]>) => Observable<U[]> {
    return (rows$: Observable<U[]>) => combineLatest(
      rows$,
      sort$.pipe(this.toSortFn(sortFns, useDefault)),
      (rows, sortFn) => {
        if (!sortFn) { return rows; }

        const copy = rows.slice();
        return copy.sort(sortFn);
      }
    );
  }
  toSortFn<U>(sortFns: PropertySortFns<U> = {}, useDefault = true): (sort$: Observable<Sort>) => Observable<undefined | SortFn<U>> {
    return (sort$) => sort$.pipe(
      map(sort => {
        if (!sort.active || sort.direction === '') { return undefined; }

        let sortFn = sortFns[sort.active];
        if (!sortFn) {
          if (!useDefault) {
            throw new Error(`Unknown sort property [${sort.active}]`);
          }
          sortFn = (a: U, b: U) => this.defaultSort((a as any)[sort.active], (b as any)[sort.active]);
        }
        return sort.direction === 'asc' ? sortFn : (a: U, b: U) => sortFn(b, a);
      })
    );
  }
  defaultSort(a: any, b: any): number {
    a = a === undefined ? null : a;
    b = b === undefined ? null : b;
    if (a === b) { return 0; }
    if (a === null) { return -1; }
    if (b === null) { return 1; }
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
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
