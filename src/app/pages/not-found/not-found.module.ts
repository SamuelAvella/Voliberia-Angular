import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { NotFoundPage } from './not-found.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { NotFoundPageRoutingModule } from './not-found-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NotFoundPageRoutingModule,
    SharedModule,
    TranslateModule.forChild(),
  ],
  declarations: [NotFoundPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class NotFoundPageModule {}
