export class LocationInstruction {
    distance: number = 0;
    heading?: number = 0;
    sign: number = 0;
    interval: number[] = []
    text: string = ""
    time: number = 0;
    street_name: string = ""
    street_destination_ref?: string = ""
    street_destination?: string = ""
    last_heading?: number = 0;
}