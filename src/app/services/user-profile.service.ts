import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Keycloak, { KeycloakProfile } from 'keycloak-js';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  
  constructor(
    private readonly keycloak: Keycloak,
    private readonly httpClient: HttpClient,
  ) {}

  public async getUserProfile(): Promise<KeycloakProfile | null> {
    return this.keycloak.authenticated ? await this.keycloak.loadUserProfile() : null;
  }

  public async upsertUserProfile(userProfile: KeycloakProfile) {
    return await this.httpClient.post<Client>(`${import.meta.env.REST_API_BASE_URL}/api/client/upsert`, {
      name: userProfile.firstName + " " + userProfile.lastName,
      contactEmail: userProfile.email
    });
  }

  public isUserAuthenticated() {
    return this.keycloak.authenticated;
  }
}
