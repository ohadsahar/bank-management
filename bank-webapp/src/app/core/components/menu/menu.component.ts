import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { Router } from '@angular/router';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],

})

export class MenuComponent implements OnInit {


  constructor(private router: Router) { }

  ngOnInit() {
    this.router.navigate(['management']);
  }
  changedTab(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.router.navigate(['management']);
    }
    else {
      this.router.navigate(['payment']);
    }
  }
}

