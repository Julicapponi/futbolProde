import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaCompetenciaPageRoutingModule } from './alta-competencia-routing.module';

import { AltaCompetenciaPage } from './alta-competencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaCompetenciaPageRoutingModule
  ],
  declarations: [AltaCompetenciaPage]
})
export class AltaCompetenciaPageModule {}
