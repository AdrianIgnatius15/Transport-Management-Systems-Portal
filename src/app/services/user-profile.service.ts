import { Injectable } from '@angular/core';
import Keycloak, { KeycloakProfile } from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  
  constructor(private readonly keycloak: Keycloak) {}

  public async getUserProfile(): Promise<KeycloakProfile | null> {
    return this.keycloak.authenticated ? await this.keycloak.loadUserProfile() : null;
  }
}
