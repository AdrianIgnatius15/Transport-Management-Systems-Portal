import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOrderShipmentComponent } from './update-order-shipment.component';

describe('UpdateOrderShipmentComponent', () => {
  let component: UpdateOrderShipmentComponent;
  let fixture: ComponentFixture<UpdateOrderShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateOrderShipmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateOrderShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
