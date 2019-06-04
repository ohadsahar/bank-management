export class BankValues {

  constructor(public _id: string, public cardName: string,
              public name: string,
              public typeProduct: string,
              public price: number,
              public numberofpayments: number,
              public eachMonth: number,
              public leftPayments: number,
              public purchaseDate: string,
              public monthPurchase: string) {}
}
