import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { MercadopagoModule } from 'mercadopago';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    MercadopagoModule,
    BrowserModule
  ],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
