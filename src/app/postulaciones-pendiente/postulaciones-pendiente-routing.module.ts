import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostulacionesPendientePage } from './postulaciones-pendiente.page';

const routes: Routes = [
  {
    path: '',
    component: PostulacionesPendientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostulacionesPendientePageRoutingModule {}
