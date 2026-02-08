import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { Credentials } from '../../models/credentials/credentials';

@Component({
  selector: 'app-login.page',
  standalone: false,
  templateUrl: './login.page.component.html',
  styleUrl: './login.page.component.css'
})
export class LoginPageComponent implements OnInit, OnDestroy {
  public credentials: Credentials = {
    username: "",
    password: ""
  };

  constructor(
    private routerSvc: Router,
    private authenticationSvc: AuthenticationService
  ) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  public login() {
    this.authenticationSvc.login(this.credentials).subscribe((_creds) => {
      this.authenticationSvc.saveLoginSession();
      this.routerSvc.navigate(["/home"]);
    });
  }

  public logout() {
    this.authenticationSvc.logout();
  }
}
