import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListEnfrentamientosPageRoutingModule } from './list-enfrentamientos-routing.module';

import { ListEnfrentamientosPage } from './list-enfrentamientos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListEnfrentamientosPageRoutingModule
  ],
  declarations: [ListEnfrentamientosPage]
})
export class ListEnfrentamientosPageModule {}
