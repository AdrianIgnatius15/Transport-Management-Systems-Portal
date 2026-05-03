import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrderShipmentComponent } from './create-order-shipment.component';

describe('CreateOrderShipmentComponent', () => {
  let component: CreateOrderShipmentComponent;
  let fixture: ComponentFixture<CreateOrderShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateOrderShipmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrderShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
