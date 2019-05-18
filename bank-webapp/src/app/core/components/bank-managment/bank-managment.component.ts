import { Component, ViewEncapsulation } from '@angular/core';
import { Bank } from '../../../shared/models/bank-data.model';
import { MatTableDataSource } from '@angular/material';



@Component({

    selector: 'app-bank-managment',
    templateUrl: './bank-managment.component.html',
    styleUrls: ['./bank-managment.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class BankManagmentComponent {


    public ELEMENT_DATA: Bank[] = [
    {id: '1', cardName: 'נגב', name: 'פלייסטיישן 4', typeProduct: 'חשמל',
    price: 2000, numberofpayments: '5', eachMonth: '300', leftPayments: '3'},
    {id: '1', cardName: 'ויזה', name: 'פלייסטיישן 4', typeProduct: 'חשמל',
    price: 2000, numberofpayments: '5', eachMonth: '300', leftPayments: '3'},
  ];

  displayedColumns: string[] =  ['id', 'cardName', 'name', 'type', 'price',
   'numberofpayments', 'eachMonth', 'leftPayments'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
