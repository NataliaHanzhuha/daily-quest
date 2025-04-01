import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SocialLinksComponent } from '../../../shared/social-links/social-links.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SocialLinksComponent]
})
export class ContactComponent {
  contactForm: FormGroup;
  formSubmitted = false;
  formSuccess = false;
  
  contactOptions = [
    { id: 'general', name: 'General Inquiry' },
    { id: 'events', name: 'Event Booking' },
    { id: 'dining', name: 'Dining Reservation' },
    { id: 'feedback', name: 'Feedback' },
    { id: 'careers', name: 'Careers' }
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

  get formControls() {
    return this.contactForm.controls;
  }
}