import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogueoPageRoutingModule } from './logueo-routing.module';

import { LogueoPage } from './logueo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogueoPageRoutingModule
  ],
  declarations: [LogueoPage]
})
export class LogueoPageModule {}
