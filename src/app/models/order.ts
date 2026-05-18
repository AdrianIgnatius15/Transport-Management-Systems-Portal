import { Address } from "./address";
import { Shipment } from "./shipment";

export class Order {
    id: string = "";
    clientId: string = "";
    orderNumber: string = "";
    status: boolean = false;
    priority: string = "";
    shipmentAddressId: string = "";
    shipmentAddress: Address = new Address();
    deliveryAddressId: string = "";
    deliveryAddress: Address = new Address();
    shipments: Shipment[] = [];
    createdAt?: Date;
    updatedAt?: Date;
}