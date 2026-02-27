import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatashareService {
  private _clientProfileUpdateCompletionStatus = signal(false);

  public clientProfileUpdateCompletionStatus = this._clientProfileUpdateCompletionStatus.asReadonly();

  constructor() {}

  public updateClientProfileCompletionStatus(newValue: boolean) {
    this._clientProfileUpdateCompletionStatus.set(newValue);
  }
}
