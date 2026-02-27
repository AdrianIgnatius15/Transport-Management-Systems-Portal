import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserProfileComponent } from '../../components/dialog/update-user-profile/update-user-profile.component';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-order.page',
  standalone: false,
  templateUrl: './order.page.component.html',
  styleUrl: './order.page.component.css'
})
export class OrderPageComponent implements OnInit {
  public userAuthenticatedFlag: boolean = false;

  constructor(
    private readonly userProfileSvc: UserProfileService,
    private updateUserProfileDialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.userAuthenticatedFlag = this.userProfileSvc.isUserAuthenticated();
    if (this.userAuthenticatedFlag) {
      let user = await this.userProfileSvc.getUserProfile();

      if (user && user.email) {
        this.userProfileSvc.getUserDetails(user.email)
          .subscribe(client => {
            if (client !== null && client.contactPhone.length === 0) {
              const dialogRef = this.updateUserProfileDialog.open<UpdateUserProfileComponent, KeycloakProfile, boolean>(UpdateUserProfileComponent, {
                height: "100%",
                width: "400px",
                data: user
              });

              dialogRef.afterClosed().subscribe(data => {
                if (data === true) {
                  this.userProfileSvc.logout();
                }
              });
            }
          });
      }
    }
  }
}
