import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Keycloak, { KeycloakProfile } from 'keycloak-js';
import { Client } from '../models/client';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { ClientUpdateDto } from '../models/dtos/clientUpdateDto';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  public logoutDueToInCompleteProfile: boolean = false;
  
  constructor(
    private readonly keycloak: Keycloak,
    private readonly httpClient: HttpClient,
    private readonly httpErrorHandlerSvc: ErrorHandlerService
  ) {}

  public async getUserProfile(): Promise<KeycloakProfile | null> {
    return this.keycloak.authenticated ? this.keycloak.loadUserProfile() : null;
  }

  public upsertUserProfile(clientUpdateDto: ClientUpdateDto) {
    return this.httpClient.post<Client>(`http://localhost:5181/api/client/upsert`, {
      name: clientUpdateDto.name,
      contactEmail: clientUpdateDto.contactEmail,
      contactPhone: clientUpdateDto.contactPhone
    });
  }

  public getUserDetails(email: string) {
    return this.httpClient.get<Client | null>(`http://localhost:5181/api/client?email=${email}`);
  }

  public isUserAuthenticated() {
    return this.keycloak.authenticated;
  }

  public logout() {
    this.keycloak.logout();
  }
}
