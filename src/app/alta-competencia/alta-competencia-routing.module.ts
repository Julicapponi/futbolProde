import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaCompetenciaPage } from './alta-competencia.page';

const routes: Routes = [
  {
    path: '',
    component: AltaCompetenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltaCompetenciaPageRoutingModule {}
