import { Order } from "./order";
import { Piece } from "./piece";

export class Shipment {
    id: string = "";
    orderId: string = "";
    order?: Order;
    pieces: Piece[] = [];
}