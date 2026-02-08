import { Component, WritableSignal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  public isLoggedIn : WritableSignal<boolean>

  constructor(private authenticationSvc: AuthenticationService) {
    this.isLoggedIn = this.authenticationSvc.isLoggedIn;
  }
}
