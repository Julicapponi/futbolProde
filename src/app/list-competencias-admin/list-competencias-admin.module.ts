import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListCompetenciasAdminPageRoutingModule } from './list-competencias-admin-routing.module';

import { ListCompetenciasAdminPage } from './list-competencias-admin.page';
import {ListEnfrentamientosPageRoutingModule} from "../list-enfrentamientos/list-enfrentamientos-routing.module";
import {Ng2SearchPipeModule} from "ng2-search-filter";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListCompetenciasAdminPageRoutingModule,
        ListEnfrentamientosPageRoutingModule,
        Ng2SearchPipeModule
    ],
  declarations: [ListCompetenciasAdminPage]
})
export class ListCompetenciasAdminPageModule {}
