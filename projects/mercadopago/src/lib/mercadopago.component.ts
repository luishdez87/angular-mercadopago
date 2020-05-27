import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { logError } from './handlers/error.handler';
import { successHandler } from './handlers/success.handler';

declare const Mercadopago: any;

@Component({
  selector: 'lh-mercadopago',
  templateUrl: './mercadopago.component.html',
  styles: [
  ]
})
export class MercadopagoComponent implements AfterViewInit {

  @Input() publicKey: string;
  paymentForm: FormGroup;
  typesNeeded: boolean;
  @ViewChild('ccNumber') ccNumberField: ElementRef;
  @ViewChild('formContainer') formRef: ElementRef;
  identificationTypes;
  constructor(
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[ 0-9]*$'), Validators.minLength(17)]]
    });
  }

  ngAfterViewInit(): void {
    this.appendScript().then(() => {
      Mercadopago.setPublishableKey(this.publicKey);
      this.getTypes();
    });
  }

  appendScript(): Promise<any> {
    return new Promise((resolve, reject) => {
      const scriptTag = document.createElement('script');
      scriptTag.src = 'https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js';
      scriptTag.onload = resolve;
      document.body.appendChild(scriptTag);
    });
  }

  submit() {
    Mercadopago.createToken(this.formRef.nativeElement, (err, res) => {
      if (err !== 200) {
        throw err;
      }
      console.log(res);
    });
  }

  getTypes() {
    Mercadopago.getIdentificationTypes((err, data) => {
      if (err !== 200) {
        throw err;
      }
      this.typesNeeded = true;
    });
  }

  creditCardNumberSpacing(): void {
    const input = this.ccNumberField.nativeElement;
    const { selectionStart } = input;
    const { cardNumber } = this.paymentForm.controls;

    let trimmedCardNum = cardNumber.value.replace(/\s+/g, '');
    if (trimmedCardNum.length >= 6) {
      const str = trimmedCardNum.substring(0, 6);
      const bin = { bin: str };
      this.callGetPaymentMethod(bin);
    }
    if (trimmedCardNum.length > 16) {
      trimmedCardNum = trimmedCardNum.substr(0, 16);
    }

     /* Handle American Express 4-6-5 spacing */
    const partitions = trimmedCardNum.startsWith('34') || trimmedCardNum.startsWith('37')
                       ? [4, 6, 5]
                       : [4, 4, 4, 4];

    const numbers = [];
    let position = 0;
    partitions.forEach(partition => {
      const part = trimmedCardNum.substr(position, partition);
      // tslint:disable-next-line:curly
      if (part) numbers.push(part);
      position += partition;
    });

    cardNumber.setValue(numbers.join(' '));

    /* Handle caret position if user edits the number later */
    if (selectionStart < cardNumber.value.length - 1) {
      input.setSelectionRange(selectionStart, selectionStart, 'none');
    }
  }

  callGetPaymentMethod(binObj) {
    Mercadopago.getPaymentMethod(binObj, (err, handler) => {
      if (err !== 200) {
        throw err;
      }
      const cardHandler = handler[0];
      this.getIssuers(cardHandler.id);
    });
  }

  getIssuers(id: string) {
    Mercadopago.getIssuers(id, (err, res) => {
      console.log(res);

    });
  }
}
