import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {CommonModule, DatePipe} from '@angular/common';
import {AuthGuard } from './auth.guard';
import {TokenInterceptorService } from './services/token-interceptor.service';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {ErrorTailorModule} from '@ngneat/error-tailor';
import {SQLite, SQLiteObject} from '@awesome-cordova-plugins/sqlite/ngx';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    ErrorTailorModule.forRoot({
      errors: {
        useValue: {
          required: 'El campo es requerido',
          minlength: ({ requiredLength, actualLength }) =>
            `Expect ${requiredLength} but got ${actualLength}`,
          invalidAddress: error => `Address isn't valid`
        }
      }
    }),

  ],
  providers: [
    AuthGuard,
    SQLite,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true},
    DatePipe,
],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary, private sqlite: SQLite) {
    library.addIconPacks(fas, fab, far);
  }
}
