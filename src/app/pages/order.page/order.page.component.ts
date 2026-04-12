import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserProfileComponent } from '../../components/dialog/update-user-profile/update-user-profile.component';
import { DatashareService } from '../../services/datashare.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { Pagination } from '../../models/request-body/pagination';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-order.page',
  standalone: false,
  templateUrl: './order.page.component.html',
  styleUrl: './order.page.component.css'
})
export class OrderPageComponent implements OnInit, OnDestroy {
  public userAuthenticatedFlag: boolean = false;
  public orders : Order[] = [];
  public paginationParams: Pagination = {
    pageNumber: 1,
    pageSize: 5
  };

  private destroyServiceSubscribeFlag: Subject<void> = new Subject<void>();

  constructor(
    private readonly userProfileSvc: UserProfileService,
    private readonly orderService: OrderService,
    private readonly dataShareService: DatashareService,
    private updateUserProfileDialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    const user = await this.userProfileSvc.getUserProfile();
    if (user !== null) {
      this.userProfileSvc.getShipperAccountDetails(user.id ?? "")
        .pipe(takeUntil(this.destroyServiceSubscribeFlag))
        .subscribe(data => {
          if(data !== null) {
            //Check if the shipper account has company phone exists, if not prompt the dialog.
            if (data.contactPhone === null || data.contactPhone === "") {
              this.updateUserProfileDialog.open(
                UpdateUserProfileComponent,
                {
                  data: data
                }
              );
            }
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroyServiceSubscribeFlag.next();
    this.destroyServiceSubscribeFlag.complete();
  }
}
