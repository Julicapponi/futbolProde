import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCompetenciasAdminPage } from './list-competencias-admin.page';

const routes: Routes = [
  {
    path: '',
    component: ListCompetenciasAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListCompetenciasAdminPageRoutingModule {}
