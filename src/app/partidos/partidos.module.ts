import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartidosPageRoutingModule } from './partidos-routing.module';

import { PartidosPage } from './partidos.page';
import {ListEnfrentamientosPageRoutingModule} from "../list-enfrentamientos/list-enfrentamientos-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartidosPageRoutingModule,
    ListEnfrentamientosPageRoutingModule
  ],
  declarations: [PartidosPage]
})
export class PartidosPageModule {}
