import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IOrderActionParams } from '../interfaces/iOrderActionParams.interface';

@Component({
  selector: 'app-order-table-actions',
  standalone: false,
  templateUrl: './order-table-actions.component.html',
  styleUrl: './order-table-actions.component.css',
})
export class OrderTableActionsComponent implements ICellRendererAngularComp {
  params!: IOrderActionParams;

  agInit(params: IOrderActionParams): void {
    this.params = params;
  }

  refresh(params: IOrderActionParams): boolean {
    return false;
  }

  onDelete() {
    this.params.onDeleteOrder(this.params.data);
  }

  onEdit() {
    this.params.onEditOrder(this.params.data);
  }

}
