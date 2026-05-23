import { LocationInfo } from "./location-info"
import { LocationPath } from "./location-path";

export class LocationRoute {
    info: LocationInfo = new LocationInfo();
    paths: LocationPath[] = [];
}