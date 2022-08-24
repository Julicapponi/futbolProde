import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioPagePage } from './inicio-page.page';

const routes: Routes = [
  {
    path: '',
    component: InicioPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPagePageRoutingModule {}
