import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListEnfrentamientosPage } from './list-enfrentamientos.page';
import {AnimationProgressComponent} from '../components/animation-progress/animation-progress.component';
import {IonicModule} from "@ionic/angular";

const routes: Routes = [
  {
    path: '',
    component: ListEnfrentamientosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), IonicModule],
    exports: [RouterModule, AnimationProgressComponent],
    declarations: [
        AnimationProgressComponent
    ]
  
})
export class ListEnfrentamientosPageRoutingModule {}
