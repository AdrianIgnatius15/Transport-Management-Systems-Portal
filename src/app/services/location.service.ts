import { HttpClient, HttpParams } from '@angular/common/http';
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
    // 2. Initialize HttpParams dynamically
    let params = new HttpParams();

    // 3. Conditionally append params only if they are not empty or default values
    if (locationLookup.street && locationLookup.street.trim() !== "") {
      params = params.set('street', locationLookup.street);
    }
    
    if (locationLookup.city && locationLookup.city.trim() !== "") {
      params = params.set('city', locationLookup.city);
    }
    
    if (locationLookup.state && locationLookup.state.trim() !== "") {
      params = params.set('state', locationLookup.state);
    }
    
    // Ignore if postalcode is 0, undefined, or null
    if (locationLookup.postalcode && locationLookup.postalcode !== 0) {
      params = params.set('postalcode', locationLookup.postalcode.toString());
    }
    
    // Always append format
    if (locationLookup.format) {
      params = params.set('format', locationLookup.format);
    }

    // CRITICAL: Tells Nominatim to return the 'address' sub-object 
    // needed by your component's option selection handlers
    params = params.set('addressdetails', '1');

    // 4. Pass the params configuration object into the GET request
    return this.httpClient.get<LocationDetails[]>(`https://nominatim.openstreetmap.org/search`, { params })
      .pipe(catchError(this.errorHandleSvc.handlingError));
  }
}
