import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscarGroupPageRoutingModule } from './buscar-group-routing.module';

import { BuscarGroupPage } from './buscar-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscarGroupPageRoutingModule
  ],
  declarations: [BuscarGroupPage]
})
export class BuscarGroupPageModule {}
