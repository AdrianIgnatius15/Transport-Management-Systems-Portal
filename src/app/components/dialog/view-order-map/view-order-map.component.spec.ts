import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrderMapComponent } from './view-order-map.component';

describe('ViewOrderMapComponent', () => {
  let component: ViewOrderMapComponent;
  let fixture: ComponentFixture<ViewOrderMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewOrderMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOrderMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
