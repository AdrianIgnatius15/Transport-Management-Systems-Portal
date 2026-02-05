export class Order {
    id: string = "";
    clientId: string = "";
    orderNumber: string = "";
    status: boolean = false;
    priority: string = "";
    pickupAddress: string = "";
    deliveryAddress: string = "";
    createdAt?: Date;
}