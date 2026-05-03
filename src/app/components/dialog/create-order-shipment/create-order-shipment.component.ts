import { Component, OnDestroy } from '@angular/core';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { MatDialogRef } from '@angular/material/dialog';
import { UserProfileService } from '../../../services/user-profile.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-order-shipment',
  standalone: false,
  templateUrl: './create-order-shipment.component.html',
  styleUrl: './create-order-shipment.component.css',
})
export class CreateOrderShipmentComponent implements OnDestroy {
  public order: Order = new Order();

  private destroyDialogFlag: Subject<void> = new Subject<void>();

  constructor(
    private dialogReference: MatDialogRef<CreateOrderShipmentComponent>,
    private readonly orderService: OrderService,
    public readonly userProfileService: UserProfileService
  ) {}

  public createOrderShipment() {
    this.orderService.createOrder(this.order)
        .pipe(takeUntil(this.destroyDialogFlag))
      .subscribe(orderCreated => {
        console.info("Order created", orderCreated);
      });
  }

  ngOnDestroy(): void {
    this.destroyDialogFlag.next();
    this.destroyDialogFlag.complete();
  }
}
