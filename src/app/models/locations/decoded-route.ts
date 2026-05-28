import { LocationInstruction } from "./location-instruction";

export class DecodedRoute {
    coordinates: [number, number][] = [];
    instructions: LocationInstruction[] = [];
    distance: number = 0;
    time: number = 0;
}