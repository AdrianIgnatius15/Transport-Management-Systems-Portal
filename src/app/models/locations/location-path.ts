import { LocationInstruction } from "./location-instruction";

export class LocationPath {
    distance: number = 0;
    weight: number = 0;
    time: number = 0;
    transfers: number = 0;
    legs: any[] = []
    points_encoded: boolean = true;
    points_encoded_multiplier: number = 1e5;
    bbox: number[] = [];
    points: string = ""
    instructions: LocationInstruction[] = [];
    ascend: number = 0;
    descend: number = 0;
    snapped_waypoints: string = ""
}