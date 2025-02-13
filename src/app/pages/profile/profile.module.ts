import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    TranslateModule.forChild(),
    SharedModule
],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
