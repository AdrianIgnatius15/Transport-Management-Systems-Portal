import { Component } from '@angular/core';
import { INoRowsOverlayAngularComp } from 'ag-grid-angular';
import { INoRowsOverlayParams } from 'ag-grid-community';

@Component({
  selector: 'app-table-custom-no-rows-overlay',
  standalone: false,
  templateUrl: './table-custom-no-rows-overlay.component.html',
  styleUrl: './table-custom-no-rows-overlay.component.css',
})
export class TableCustomNoRowsOverlayComponent implements INoRowsOverlayAngularComp {
  params!: INoRowsOverlayParams & { noRowsMessage?: string };

  agInit(params: INoRowsOverlayParams<any, any>): void {
    this.params = params;
  }
  
  refresh?(params: INoRowsOverlayParams<any, any>): void {
    throw new Error('Method not implemented.');
  }

}
