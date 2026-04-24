import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserProfileComponent } from '../../components/dialog/update-user-profile/update-user-profile.component';
import { DatashareService } from '../../services/datashare.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { Subject, takeUntil } from 'rxjs';
import { themeMaterial, type ColDef } from "ag-grid-community";

@Component({
  selector: 'app-order.page',
  standalone: false,
  templateUrl: './order.page.component.html',
  styleUrl: './order.page.component.css'
})
export class OrderPageComponent implements OnInit, OnDestroy {
  public userAuthenticatedFlag: boolean = false;
  public orders : Order[] = [];
  public isDataLoadingFlag: WritableSignal<boolean> = signal(false);
  public columnDefinitions: ColDef<Order>[] = [
    { field: "id" },
    { field: "clientId" },
    { field: "orderNumber" },
    { field: "status" },
    { field: "priority" },
    { field: "pickupAddress" },
    { field: "deliveryAddress" },
    { field: "createdAt" },
  ];
  public overlayComponentParams: any = {
    loading: { overlayText: "Please wait while your data is loading..." },
    noRows: { overlayText: "There's no orders from your account to ship!" },
    noMatchingRows: { overlayText: "Current Filter Matches No Rows" },
    exporting: { overlayText: "Exporting your data..." },
  };
  public tableTheme = themeMaterial.withParams({
    fontFamily: "Delivery",
    headerFontFamily: "Delivery",
    headerFontWeight: 900,
    cellFontFamily: "Delivery"
  });

  private destroyServiceSubscribeFlag: Subject<void> = new Subject<void>();

  constructor(
    private readonly userProfileSvc: UserProfileService,
    private readonly orderService: OrderService,
    private readonly dataShareService: DatashareService,
    private updateUserProfileDialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    await this.updateShipperInfoOrLoadOrdersofShipment();
  }

  private async updateShipperInfoOrLoadOrdersofShipment() {
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
            } else {
              this.isDataLoadingFlag.set(true);
              this.orderService.getAllOrdersByShipperIdPaginated(user.id ?? "", { pageNumber: 1, pageSize: 5 })
                  .pipe(takeUntil(this.destroyServiceSubscribeFlag))
                .subscribe(paginatedOrders => {
                  if (paginatedOrders) {
                    this.isDataLoadingFlag.set(false);
                  }

                  this.orders = JSON.parse(JSON.stringify(paginatedOrders.items));
                });
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
