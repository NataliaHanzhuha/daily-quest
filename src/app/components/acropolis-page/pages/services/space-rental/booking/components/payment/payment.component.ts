import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { Customer, PaymentDetails, PaymentStatus } from '../../../../../../../../models/task';
import { ReactiveFormsModule } from '@angular/forms';
import { StripeService } from '../../../../../../../../services/server/stripe.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { StripeFactoryService } from 'ngx-stripe';
import { environment } from '../../../../../../../../../environments/environment';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Angular4PaystackModule } from 'angular4-paystack';

interface PaymentResponse {
  message: string;
  redirecturl: string;
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NzRadioModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzAlertModule,
    NzDividerModule,
    NzIconModule,
    NzButtonModule,
    Angular4PaystackModule
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [StripeService, StripeFactoryService]
})
export class PaymentComponent {
  @Input({required: true}) customer!: Customer;
  @Input({required: true}) description!: any;
  @Output() payment = new EventEmitter<PaymentDetails>();

  paymentId?: string;
  reference = `${Math.ceil(Math.random() * 10e10)}`;

  constructor(private message: NzMessageService,) {
  }

  get key(): string {
    return environment.paystackPublickKey;
  }

  paymentDone(ref: PaymentResponse) {
    if (ref.status !== 'success') {
      this.message.error('Payment failed', {nzDuration: 10000});
      return;
    } else {
      this.paymentId = ref.reference;
      this.payment.emit({
        paymentId: ref.reference,
        paymentDate: new Date().toISOString(),
        paymentStatus: PaymentStatus['paid'],
        paymentType: 'online'
      });
    }
  }

  paymentCancel() {
    this.message.error('Payment failed', {nzDuration: 10000});
  }

}
