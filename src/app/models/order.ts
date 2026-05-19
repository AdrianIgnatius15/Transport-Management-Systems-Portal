import { Address } from "./address";
import { OrderStatus } from "./enums/order-status";
import { Shipment } from "./shipment";

export class Order {
    id: string = "";
    clientId: string = "";
    orderNumber: string = "";
    status: OrderStatus = OrderStatus.CREATED;
    priority: string = "";
    shipmentAddressId: string = "";
    shipmentAddress: Address = new Address();
    deliveryAddressId: string = "";
    deliveryAddress: Address = new Address();
    shipments: Shipment[] = [];
    createdAt?: Date;
    updatedAt?: Date;
}