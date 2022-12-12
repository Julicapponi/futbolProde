import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListUsersPageRoutingModule } from './list-users-routing.module';

import { ListUsersPage } from './list-users.page';
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {ListEnfrentamientosPageRoutingModule} from "../list-enfrentamientos/list-enfrentamientos-routing.module";
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListUsersPageRoutingModule,
        Ng2SearchPipeModule,
        ListEnfrentamientosPageRoutingModule
    ],
  declarations: [ListUsersPage]
})
export class ListUsersPageModule {}
