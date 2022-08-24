import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  }
];

@NgModule({
  imports: [CommonModule,
    FormsModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
