import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-update-order-shipment',
  standalone: false,
  templateUrl: './update-order-shipment.component.html',
  styleUrl: './update-order-shipment.component.css',
})
export class UpdateOrderShipmentComponent {
  constructor(
    private readonly dialogReference: MatDialogRef<UpdateOrderShipmentComponent, any>,
    @Inject(MAT_DIALOG_DATA) public data: Order,
    private readonly orderService: OrderService
  ) {}

  
}
