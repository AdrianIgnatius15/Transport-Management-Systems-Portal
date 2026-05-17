import { Address } from "./address";

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
    createdAt?: Date;
    updatedAt?: Date;
}