import { Shipment } from "./shipment";

export class Piece {
    id: string = "";
    description: string = "";
    weight: number = 0;
    height: number = 0;
    width: number = 0;
    length: number = 0;
    shipmentId: number = 0;
    shipment?: Shipment;
}