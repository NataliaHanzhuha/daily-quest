import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { countries, CountryInterface } from 'country-codes-flags-phone-codes';

@Component({
  selector: 'app-customer-info',
  standalone: true,
  imports: [
    CommonModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    ReactiveFormsModule],
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss'],
})
export class CustomerInfoComponent implements OnInit {
  bookingForm!: FormGroup;
  countries: CountryInterface[] = [];
  @Input() capacity: number = 1000;
  @Output() change = new EventEmitter();

  constructor(private fb: FormBuilder) {
    this.initForm();
    this.setCountries();
  }

  ngOnInit() {
    this.bookingForm.valueChanges.subscribe((value: any) => {
      this.change.emit(value);
    });

    this.setRulesForForm();
  }

  private setCountries(): void {
    const favorites: string[] = ['Nigeria', 'United States', 'Canada'];
    this.countries = [...countries].sort((a, b) => {
      const isAFavorite = favorites.includes(a.name);
      const isBFavorite = favorites.includes(b.name);

      if (isAFavorite && !isBFavorite) {
        return -1;
      } // a comes first
      if (!isAFavorite && isBFavorite) {
        return 1;
      }  // b comes first
      return 0; // maintain order
    });

  }

  private initForm() {
    this.bookingForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      customerPhoneNumberPrefix: ['+234', Validators.required],
      eventType: ['', Validators.required],
      attendees: [1, [Validators.required, Validators.min(1)]],
    });
  }

  private setRulesForForm(): void {
    // Update validators for attendees
    this.bookingForm.get('attendees')?.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(this.capacity)
    ]);

    this.bookingForm.get('duration')?.updateValueAndValidity();
    this.bookingForm.get('attendees')?.updateValueAndValidity();
  }

}
