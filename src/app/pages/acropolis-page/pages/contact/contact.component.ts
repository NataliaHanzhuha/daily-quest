import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { animate, style, transition, trigger } from '@angular/animations';
import { acropolisAddress, acropolisEmail, acropolisPhone } from '../../../../models/constants';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NzIconModule],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({transform: 'translateY(100%)', opacity: 0}),
        animate('1000ms ease-out', style({transform: 'translateY(0)', opacity: 1}))
      ])
    ])
  ]
})
export class ContactComponent {
  contactForm: FormGroup;
  formSubmitted = false;
  formSuccess = false;
  email = acropolisEmail;
  phone = acropolisPhone;

  get address(): string {
    const addressArray = acropolisAddress.split('Abuja');
    return `${addressArray[0]}<br> Abuja${addressArray[1]}`;
  };

  contactOptions = [
    {id: 'general', name: 'General Inquiry'},
    {id: 'events', name: 'Event Booking'},
    {id: 'dining', name: 'Dining Reservation'},
    {id: 'feedback', name: 'Feedback'},
    {id: 'careers', name: 'Careers'}
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9+\\s-]{10,15}$')]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      privacyPolicy: [false, Validators.requiredTrue]
    });
  }

  get formControls() {
    return this.contactForm.controls;
  }

  submitForm() {
    this.formSubmitted = true;

    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);

      // Simulate API call success
      setTimeout(() => {
        this.formSuccess = true;
        this.contactForm.reset();
        this.formSubmitted = false;

        // Reset success message after some time
        setTimeout(() => {
          this.formSuccess = false;
        }, 5000);
      }, 1000);
    }
  }
}
