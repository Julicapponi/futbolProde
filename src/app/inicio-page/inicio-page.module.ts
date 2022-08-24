import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioPagePageRoutingModule } from './inicio-page-routing.module';

import { InicioPagePage } from './inicio-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioPagePageRoutingModule
  ],
    declarations: [InicioPagePage]
})
export class InicioPagePageModule {}
