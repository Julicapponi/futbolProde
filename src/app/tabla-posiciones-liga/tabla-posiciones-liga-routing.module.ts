import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablaPosicionesLigaPage } from './tabla-posiciones-liga.page';

const routes: Routes = [
  {
    path: '',
    component: TablaPosicionesLigaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablaPosicionesLigaPageRoutingModule {}
