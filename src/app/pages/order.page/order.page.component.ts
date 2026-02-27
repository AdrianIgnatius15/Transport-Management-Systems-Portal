import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserProfileComponent } from '../../components/dialog/update-user-profile/update-user-profile.component';
import { KeycloakProfile } from 'keycloak-js';
import { DatashareService } from '../../services/datashare.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order.page',
  standalone: false,
  templateUrl: './order.page.component.html',
  styleUrl: './order.page.component.css'
})
export class OrderPageComponent implements OnInit {
  public userAuthenticatedFlag: boolean = false;
  public orders : Order[] = [];

  constructor(
    private readonly userProfileSvc: UserProfileService,
    private readonly orderService: OrderService,
    private readonly dataShareService: DatashareService,
    private updateUserProfileDialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.userAuthenticatedFlag = this.userProfileSvc.isUserAuthenticated();
    if (this.userAuthenticatedFlag) {
      let user = await this.userProfileSvc.getUserProfile();

      if (user && user.email) {
        this.userProfileSvc.getUserDetails(user.email)
          .subscribe({
            next: (client) => {
              if (client !== null && client.contactPhone.length === 0) {
                const dialogRef = this.updateUserProfileDialog.open<UpdateUserProfileComponent, KeycloakProfile, boolean>(UpdateUserProfileComponent, {
                  height: "100%",
                  width: "400px",
                  data: user
                });

                dialogRef.afterClosed().subscribe(data => {
                  if (data === true) {
                    this.dataShareService.updateClientProfileCompletionStatus(true);
                    this.userProfileSvc.logout();
                  } else {
                    this.orderService.getAllOrdersByEmail(user.email ?? "")
                      .subscribe(orderList => this.orders = JSON.parse(JSON.stringify(orderList)));
                  }
                });
              }
            },
            error: (error: HttpErrorResponse) => {
              console.error("Error details", error);
              if (error.status === 404) {
                // Show a dialog error and insert the client data.
                console.error("Error status", error.status);
                const dialogRef = this.updateUserProfileDialog.open<UpdateUserProfileComponent, KeycloakProfile, boolean>(UpdateUserProfileComponent, {
                  height: "100%",
                  width: "400px",
                  data: user
                });

                dialogRef.afterClosed().subscribe(data => {
                  if (data === true) {
                    this.dataShareService.updateClientProfileCompletionStatus(true);
                    this.userProfileSvc.logout();
                  }
                });
              }
            }
          });
      }
    }
  }
}
