import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PuntajesGruposPage } from './puntajes-grupos.page';

const routes: Routes = [
  {
    path: '',
    component: PuntajesGruposPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PuntajesGruposPageRoutingModule {}
