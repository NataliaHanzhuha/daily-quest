import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NzFormModule, NzInputModule, ReactiveFormsModule, NzCheckboxModule, NzButtonModule, NzTypographyModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }> = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  private angularFireAuth = inject(AngularFireAuth);

  constructor(private authService: AuthService, private router: Router,
              private fb: NonNullableFormBuilder) {
    this.angularFireAuth.user.subscribe((u) => {
      if (!this.router.url || this.router.url === '/') {
        this.router.navigate([u?.displayName ? '/admin' : '/login']);
      }
    });
  }

  async submitForm() {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      await this.authService.login(this.validateForm.get('email')!.value, this.validateForm.get('password')!.value).then(() => {
        this.router.navigate(['/admin']);
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }
}
