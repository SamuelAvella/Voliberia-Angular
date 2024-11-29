import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserAppPageRoutingModule } from './user-app-routing.module';

import { UserAppPage } from './user-app.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserAppPageRoutingModule
  ],
  declarations: [UserAppPage]
})
export class UserAppPageModule {}
