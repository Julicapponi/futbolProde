import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PuntajesGruposPageRoutingModule } from './puntajes-grupos-routing.module';

import { PuntajesGruposPage } from './puntajes-grupos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PuntajesGruposPageRoutingModule
  ],
  declarations: [PuntajesGruposPage]
})
export class PuntajesGruposPageModule {}
