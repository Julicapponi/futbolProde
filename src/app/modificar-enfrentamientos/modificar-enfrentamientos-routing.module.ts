import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarEnfrentamientosPage } from './modificar-enfrentamientos.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarEnfrentamientosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarEnfrentamientosPageRoutingModule {}
