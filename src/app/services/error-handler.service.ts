import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  public handlingError(httpError: HttpErrorResponse | any) {
    let errMsg: string;

    if (httpError.error instanceof ErrorEvent) {
      errMsg = httpError.error.message;
    } else {
      //errMsg = `${httpError.status} - ${httpError.statusText || ''} ${httpError.error}`;
      errMsg = `${httpError.status}|${httpError.error}`;
    }

    return throwError(() => new Error(errMsg));
  }
}
