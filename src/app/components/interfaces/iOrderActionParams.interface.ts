import { ICellRendererParams } from 'ag-grid-community';
import { Order } from '../../models/order';

export interface IOrderActionParams extends ICellRendererParams {
    onEditOrder: (data: Order) => void;
    onDeleteOrder: (data: Order) => void;
}