import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { LocationLookup } from '../models/locations/location-lookup';
import { LocationDetails } from '../models/locations/location-details';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly errorHandleSvc: ErrorHandlerService
  ) {}

  public getLatitudeAndLongitudeFromAddress(locationLookup: LocationLookup) {
    return this.httpClient.get<LocationDetails[]>(`https://nominatim.openstreetmap.org/search?street=${locationLookup.street}&city=${locationLookup.city}&state=${locationLookup.state}&postalcode=${locationLookup.postalcode}&format=${locationLookup.format}`)
      .pipe(catchError(this.errorHandleSvc.handlingError));
  }
}
