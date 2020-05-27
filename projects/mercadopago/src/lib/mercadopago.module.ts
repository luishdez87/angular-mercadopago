import { NgModule } from '@angular/core';
import { MercadopagoComponent } from './mercadopago.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [MercadopagoComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule
  ],
  exports: [MercadopagoComponent]
})
export class MercadopagoModule { }
