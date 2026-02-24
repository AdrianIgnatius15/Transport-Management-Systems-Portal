import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-order.page',
  standalone: false,
  templateUrl: './order.page.component.html',
  styleUrl: './order.page.component.css'
})
export class OrderPageComponent implements OnInit {
  public userAuthenticatedFlag: boolean = false;

  constructor(
    private readonly userProfileSvc: UserProfileService
  ) {}

  ngOnInit(): void {
    this.userAuthenticatedFlag = this.userProfileSvc.isUserAuthenticated();
  }
}
