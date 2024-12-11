import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlightsPageRoutingModule } from './flights-routing.module';

import { FlightsPage } from './flights.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlightsPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [FlightsPage]
})
export class FlightsPageModule {}
