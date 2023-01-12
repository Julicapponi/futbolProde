import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostulacionesPendientePageRoutingModule } from './postulaciones-pendiente-routing.module';

import { PostulacionesPendientePage } from './postulaciones-pendiente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostulacionesPendientePageRoutingModule
  ],
  declarations: [PostulacionesPendientePage]
})
export class PostulacionesPendientePageModule {}
