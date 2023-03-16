import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TablaPosicionesLigaPageRoutingModule } from './tabla-posiciones-liga-routing.module';

import { TablaPosicionesLigaPage } from './tabla-posiciones-liga.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TablaPosicionesLigaPageRoutingModule
  ],
  declarations: [TablaPosicionesLigaPage]
})
export class TablaPosicionesLigaPageModule {}
