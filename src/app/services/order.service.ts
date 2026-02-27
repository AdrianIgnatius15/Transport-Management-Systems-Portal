import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  constructor(
    private httpClient: HttpClient,
    private errorHandlerSvc: ErrorHandlerService
  ) { }

  public getAllOrdersByEmail(email: string) {
    return this.httpClient.get<Order[]>(`http://localhost:5181/api/client?email=${email}`)
      .pipe(catchError(this.errorHandlerSvc.handlingError));
  }
}
