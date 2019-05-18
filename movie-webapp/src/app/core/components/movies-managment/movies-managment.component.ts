import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({

    selector: 'app-movies-managment',
    templateUrl: './movies-managment.component.html',
    styleUrls: ['./movies-managment.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class MoviesManagmentComponent {


  registerMovie(form: NgForm) {

    if (form.invalid) {
      return;
    } else {
      console.log(form.value);
    }

  }
}
