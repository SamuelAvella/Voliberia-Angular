import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserAppPage } from './user-app.page';

const routes: Routes = [
  {
    path: '',
    component: UserAppPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAppPageRoutingModule {}
