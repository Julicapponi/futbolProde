import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroPageRoutingModule } from './registro-routing.module';

import { RegistroPage } from './registro.page';
import {ErrorTailorModule} from '@ngneat/error-tailor';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RegistroPageRoutingModule,
        ErrorTailorModule.forRoot({
            errors: {
                useValue: {
                    required: 'El campo es requerido',
                    minlength: ({requiredLength, actualLength}) =>
                        `Expect ${requiredLength} but got ${actualLength}`,
                    invalidAddress: error => `Address isn't valid`
                }
            }
        }),
        ReactiveFormsModule,
    ],
  declarations: [RegistroPage]
})
export class RegistroPageModule {}
