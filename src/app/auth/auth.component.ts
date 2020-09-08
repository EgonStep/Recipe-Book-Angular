import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  authForm: FormGroup;
  error = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });

    this.initForm();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  private initForm() {
    this.authForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    if (!this.authForm.valid) {
      return;
    }

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    this.isLoading = true;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      this.store.dispatch(
        new AuthActions.LoginStart({email: email, password: password})
      );
    } else {
      authObs = this.authService.signUp(email, password);
    }

    this.authForm.reset();
  }

  onModalClose() {
    this.error = null;
  }
}
