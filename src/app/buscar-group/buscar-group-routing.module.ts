import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuscarGroupPage } from './buscar-group.page';

const routes: Routes = [
  {
    path: '',
    component: BuscarGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscarGroupPageRoutingModule {}
