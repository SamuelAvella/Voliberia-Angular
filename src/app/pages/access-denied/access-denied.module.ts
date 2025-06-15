import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AccessDeniedPage } from './access-denied.page';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AccessDeniedRoutingModule } from './access-denied-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AccessDeniedRoutingModule,
    SharedModule,
    TranslateModule.forChild()
  ],
  declarations: [AccessDeniedPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccessDeniedPageModule { }
