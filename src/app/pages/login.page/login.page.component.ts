import { Component, effect, inject, OnInit } from '@angular/core';
import Keycloak from 'keycloak-js';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  typeEventArgs,
  ReadyArgs
} from 'keycloak-angular';
import { DatashareService } from '../../services/datashare.service';

@Component({
  selector: 'app-login.page',
  standalone: false,
  templateUrl: './login.page.component.html',
  styleUrl: './login.page.component.css'
})
export class LoginPageComponent implements OnInit {
  public authenticatedFlag: boolean = false;
  public keyCloakStatus: string | undefined;

  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  constructor(
    private readonly dataShareService: DatashareService
  ) {
    effect(() => {
      const keycloakEvent = this.keycloakSignal();

      this.keyCloakStatus = keycloakEvent.type;

      if (keycloakEvent.type === KeycloakEventType.Ready) {
        this.authenticatedFlag = typeEventArgs<ReadyArgs>(keycloakEvent.args);
      }

      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this.authenticatedFlag = false;
      }
    });
  }

  ngOnInit(): void {
    if (this.dataShareService.clientProfileUpdateCompletionStatus() === true) {
      //Show a toast and right before dismissing it, update the signal back to 'false'
    }
  }

  public login(): void {
    this.keycloak.login();
  }

  public logout(): void {
    this.keycloak.logout();
  }
}
