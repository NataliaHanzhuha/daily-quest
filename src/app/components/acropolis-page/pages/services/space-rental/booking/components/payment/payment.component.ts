import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { Customer, Payment, PaymentDetails, PaymentStatus } from '../../../../../../../../models/task';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StripeService } from '../../../../../../../../services/server/stripe.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { StripeElementsDirective, StripeFactoryService, StripePaymentElementComponent } from 'ngx-stripe';
import { environment } from '../../../../../../../../../environments/environment';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
    StripeElementsDirective,
    StripePaymentElementComponent,
    NzAlertModule,
    NzDividerModule,
    NzIconModule,
    NzButtonModule
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [StripeService, StripeFactoryService]
})
export class PaymentComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent) paymentElement!: StripePaymentElementComponent;
  @Input({required: true}) customer!: Customer;
  @Input({required: true}) description!: any;
  @Output() payment = new EventEmitter<PaymentDetails>();

  selectedPaymentMethod = new FormControl<Payment | null>('online');
  localPaymentForm: FormGroup;

  stripe = this.factoryService.create(environment.stripe.publicKey);
  elementsOptions: any = {
    locale: 'en',
    clientSecret: undefined
  };

  paymentId?: string;

  constructor(
    private stripeService: StripeService,
    private fb: FormBuilder,
    private factoryService: StripeFactoryService,
    private message: NzMessageService
  ) {
    this.localPaymentForm = this.fb.group({
      localPaymentType: ['cash', Validators.required],
      notes: ['']
    });
  }

  get isOnline(): boolean {
    return this.selectedPaymentMethod.value === 'online';
  }

  ngOnInit() {
    // this.selectedPaymentMethod.valueChanges.subscribe(async (value: Payment | null) => {
    //   console.log(value);
    //   if (value === 'online') {
    this.customer.price *= 100;
    this.stripeService.getClientSecret(this.customer, this.description)
      .subscribe(({clientSecret}) => {
        this.elementsOptions.clientSecret = clientSecret;
      });
    //   }
    // });
  }

  selectPaymentType(payment: Payment) {
    this.selectedPaymentMethod.patchValue(payment);

    if (payment === 'local') {
      this.payment.emit({
        requestDate: new Date().toISOString(),
        paymentStatus: PaymentStatus.unpaid,
        paymentType: this.selectedPaymentMethod.value!
      });
    }
  }

  pay(): void {
    this.stripe.confirmPayment({
      elements: this.paymentElement.elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: this.customer.fullName,
            email: this.customer.email,
            phone: this.customer.phone,
          },
        },
      },
      redirect: 'if_required',
    }).pipe(catchError((err) => {
      console.error(err);
      this.message.error(err.message);

      return of(null);
    }))
      .subscribe((result: any) => {
        if (result.error) {
          this.message.error(result.error.message, {nzDuration: 10000});

          return;

        } else if (result.paymentIntent.status === 'succeeded') {
          console.log('Payment processed successfully', result);
          this.paymentId = result.paymentIntent.id;
          this.payment.emit({
            paymentId: result.paymentIntent.id,
            paymentDate: new Date(result.paymentIntent.created).toISOString(),
            paymentStatus: PaymentStatus['paid'],
            paymentType: this.selectedPaymentMethod.value!
          });
        }
      });
  }

}
