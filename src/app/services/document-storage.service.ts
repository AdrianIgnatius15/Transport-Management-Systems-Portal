import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { catchError } from 'rxjs';
import { DocumentMetadata } from '../models/document-metadata';

@Injectable({
  providedIn: 'root',
})
export class DocumentStorageService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly errorHandlerSvc: ErrorHandlerService
  ){}

  public uploadDocument(orderId: string, file: File) {
    const form = new FormData();
    form.append("file", file);
    return this.httpClient.post<{ objectKey: string; fileName: string }>(`http://localhost:8081/api/orders/upload-documents/${orderId}`, form)
    .pipe(catchError(this.errorHandlerSvc.handlingError));
  }

  public listDocuments(orderId: string) {
    return this.httpClient.get<DocumentMetadata[]>(`http://localhost:8081/api/orders/upload-documents/${orderId}/documents`);
  }

  public getPresignedUrl(orderId: string, objectKey: string) {
    return this.httpClient.get<{ url: string }>(
      `http://localhost:8081/api/orders/upload-documents/${orderId}/documents/${objectKey}/url`
    )
    .pipe(catchError(this.errorHandlerSvc.handlingError));
  }

  public deleteDocument(orderId: string, objectKey: string) {
    return this.httpClient.delete<void>(
      `http://localhost:8081/api/orders/upload-documents/${orderId}/documents/${objectKey}`
    )
    .pipe(catchError(this.errorHandlerSvc.handlingError));
  }
}
