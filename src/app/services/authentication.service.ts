import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Credentials } from '../models/credentials/credentials';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userCredentials: Credentials = new Credentials();
  public isLoggedIn = signal<boolean>(false);

  constructor(private httpClient: HttpClient, private httpErrorHandlerSvc: ErrorHandlerService) {}

  public login(credentials: Credentials) : Observable<Credentials> {
    this.userCredentials = credentials;
    return this.httpClient.post<Credentials>(import.meta.env.REST_API_BASE_URL, credentials).pipe(catchError(this.httpErrorHandlerSvc.handlingError));
  }

  public logout() {
    sessionStorage.removeItem("authenticatedUser");
    this.isLoggedIn.set(false);
  }

  public saveLoginSession() {
    sessionStorage.setItem("authenticatedUser", this.userCredentials.username);
    this.isLoggedIn.set(true);
  }

  public isUserLoggedIn(): boolean {
    return sessionStorage.getItem("authenticatedUser") ? true: false;
  }
}
