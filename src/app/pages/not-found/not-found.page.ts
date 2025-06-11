import { Component } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.html'
})
export class NotFoundPage {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
