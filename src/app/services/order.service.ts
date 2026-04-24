import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { Pagination } from '../models/request-body/pagination';
import { PaginationOrderSearchParamters } from '../models/pagination/paginationOrderSearchParameters';
import { PaginatedOrdersReadDto } from '../models/dtos/paginatedOrdersReadDto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  constructor(
    private httpClient: HttpClient,
    private errorHandlerSvc: ErrorHandlerService
  ) { }

  public getAllOrdersByEmail(email: string, pagination: Pagination) {
    return this.httpClient.post<Order[]>(`http://localhost:5230/api/order?email=${email}`, pagination)
      .pipe(catchError(this.errorHandlerSvc.handlingError));
  }

  public getAllOrdersByShipperIdPaginated(shipperId: string, parameters: PaginationOrderSearchParamters) {
    return this.httpClient.get<PaginatedOrdersReadDto>(`http://localhost:5230/api/order/all/shipperid?pageNumber=${parameters.pageNumber}&pageSize=${parameters.pageSize}&id=${shipperId}`)
      .pipe(catchError(this.errorHandlerSvc.handlingError));
  }
}
