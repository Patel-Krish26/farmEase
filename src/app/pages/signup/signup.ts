import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import {
  HttpClient
} from '@angular/common/http';

import {
  AuthService,
  UserRole
} from '../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})

export class Signup implements OnInit {

  private router = inject(Router);

  private http = inject(HttpClient);

  private auth = inject(AuthService);

  private fb = inject(FormBuilder);

  private backendUrl = 'https://backend-6fko.onrender.com/api/auth';

  // State Management
  selectedRole: UserRole = 'customer';

  isLoading = false;

  signupForm!: FormGroup;

  ngOnInit(): void {

    if (this.auth.isLoggedIn()) {

      this.router.navigate(['/']);
    }

    this.signupForm = this.fb.group({

      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(
            /^[A-Za-z]+(?:\s[A-Za-z]+)*$/
          )
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/
          )
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9][0-9]{9}$/)
        ]
      ],

      birthDate: [
        '',
        [
          Validators.required,
          this.minimumAgeValidator(18)
        ]
      ],

      address: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(150)
        ]
      ],

      bio: [
        '',
        [
          Validators.maxLength(300)
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),

          // Strong Password
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,20}$/
          )
        ]
      ]
    });
  }

  setRole(role: string) {

    this.selectedRole = role as UserRole;
  }

  minimumAgeValidator(minAge: number) {

    return (
      control: AbstractControl
    ): ValidationErrors | null => {

      if (!control.value) {

        return null;
      }

      const today = new Date();

      const birthDate = new Date(control.value);

      let age =
        today.getFullYear() -
        birthDate.getFullYear();

      const monthDiff =
        today.getMonth() -
        birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (
          monthDiff === 0 &&
          today.getDate() <
          birthDate.getDate()
        )
      ) {

        age--;
      }

      return age >= minAge
        ? null
        : { underAge: true };
    };
  }

  onRegister() {

    if (this.signupForm.invalid) {

      this.signupForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;

    const newUser = {

      ...this.signupForm.value,

      role: this.selectedRole,

      joinedDate:
        new Date().toISOString()
    };

    this.http.post(
      `${this.backendUrl}/register`,
      newUser
    ).subscribe({

      next: (res) => {

        console.log(
          'Registration Successful',
          res
        );

        this.isLoading = false;

        this.router.navigate(['/Login']);
      },

      error: (err) => {

        this.isLoading = false;

        console.error(
          'Registration failed',
          err
        );

        alert(
          err.error?.message ||
          'Failed to create account. Please try again.'
        );
      }
    });
  }

  get f() {

    return this.signupForm.controls;
  }
}
