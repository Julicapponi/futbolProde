import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarEnfrentamientosPageRoutingModule } from './modificar-enfrentamientos-routing.module';

import { ModificarEnfrentamientosPage } from './modificar-enfrentamientos.page';
import {ListEnfrentamientosPageRoutingModule} from "../list-enfrentamientos/list-enfrentamientos-routing.module";
import {Ng2SearchPipeModule} from "ng2-search-filter";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ModificarEnfrentamientosPageRoutingModule,
        ListEnfrentamientosPageRoutingModule,
        Ng2SearchPipeModule
    ],
  declarations: [ModificarEnfrentamientosPage]
})
export class ModificarEnfrentamientosPageModule {}
