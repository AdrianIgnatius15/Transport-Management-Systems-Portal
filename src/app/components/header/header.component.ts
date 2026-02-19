import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  public isLoggedIn: Signal<boolean>;

  constructor(private authenticationSvc: AuthenticationService) {
    this.isLoggedIn = this.authenticationSvc.isLoggedIn;
  }

  ngOnInit(): void {
    // Component initialized
  }
}
