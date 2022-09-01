import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListCompetenciasPageRoutingModule } from './list-competencias-routing.module';

import { ListCompetenciasPage } from './list-competencias.page';
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {ListEnfrentamientosPageRoutingModule} from "../list-enfrentamientos/list-enfrentamientos-routing.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListCompetenciasPageRoutingModule,
        Ng2SearchPipeModule,
        ListEnfrentamientosPageRoutingModule
    ],
  declarations: [ListCompetenciasPage]
})
export class ListCompetenciasPageModule {}
