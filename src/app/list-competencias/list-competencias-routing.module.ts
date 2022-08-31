import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCompetenciasPage } from './list-competencias.page';

const routes: Routes = [
  {
    path: '',
    component: ListCompetenciasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListCompetenciasPageRoutingModule {}
