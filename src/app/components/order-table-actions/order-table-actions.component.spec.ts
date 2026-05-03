import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTableActionsComponent } from './order-table-actions.component';

describe('OrderTableActionsComponent', () => {
  let component: OrderTableActionsComponent;
  let fixture: ComponentFixture<OrderTableActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderTableActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderTableActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
