import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCustomNoRowsOverlayComponent } from './table-custom-no-rows-overlay.component';

describe('TableCustomNoRowsOverlayComponent', () => {
  let component: TableCustomNoRowsOverlayComponent;
  let fixture: ComponentFixture<TableCustomNoRowsOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableCustomNoRowsOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCustomNoRowsOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
