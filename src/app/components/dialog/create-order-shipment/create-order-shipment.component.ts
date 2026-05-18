import { Component, OnDestroy, OnInit } from '@angular/core';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { MatDialogRef } from '@angular/material/dialog';
import { UserProfileService } from '../../../services/user-profile.service';
import { debounceTime, distinctUntilChanged, filter, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { LocationService } from '../../../services/location.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationDetails } from '../../../models/locations/location-details';
import { LocationLookup } from '../../../models/locations/location-lookup';
import { Piece } from '../../../models/piece';
import { Shipment } from '../../../models/shipment';

@Component({
  selector: 'app-create-order-shipment',
  standalone: false,
  templateUrl: './create-order-shipment.component.html',
  styleUrl: './create-order-shipment.component.css',
})
export class CreateOrderShipmentComponent implements OnInit, OnDestroy {
  public orderForm!: FormGroup;

  public filteredLocationsForShipment!: Observable<LocationDetails[]>;
  public filteredLocationsForDelivery!: Observable<LocationDetails[]>;

  private destroyDialogFlag: Subject<void> = new Subject<void>();

  constructor(
    private dialogReference: MatDialogRef<CreateOrderShipmentComponent>,
    private readonly orderService: OrderService,
    private readonly locationService: LocationService,
    private readonly formBuilder: FormBuilder,
    public readonly userProfileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.orderForm = this.formBuilder.group({
      priority: ['', Validators.required],
      
      // Shipment Address (Origin) Form Group
      shipmentAddress: this.formBuilder.group({
        id: [''],
        line1: ['', Validators.required],
        line2: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['', Validators.required],
        latitude: [0],
        longitude: [0]
      }),

      // Delivery Address (Destination) Form Group
      deliveryAddress: this.formBuilder.group({
        id: [''],
        line1: ['', Validators.required],
        line2: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['', Validators.required],
        latitude: [0],
        longitude: [0]
      }),

      // Dynamic nested FormArray mapping onto Order.shipments
      shipments: this.formBuilder.array([])
    });

    this.addShipment();

    this.setupAutoCompleteForShipmentAddress();
    this.setupAutoCompleteForDeliveryAddress();
  }

  // Getters for convenient FormArray iterative templates parsing
  get shipments(): FormArray {
    return this.orderForm.get('shipments') as FormArray;
  }

  public getPieces(shipmentIndex: number): FormArray {
    return this.shipments.at(shipmentIndex).get('pieces') as FormArray;
  }

  // Shipment FormArray Operations
  public addShipment(): void {
    const shipmentGroup = this.formBuilder.group({
      id: [''],
      pieces: this.formBuilder.array([])
    });
    this.shipments.push(shipmentGroup);
    
    // Automatically add an initial piece row to the new shipment block
    this.addPiece(this.shipments.length - 1);
  }

  public removeShipment(shipmentIndex: number): void {
    if (this.shipments.length > 1) {
      this.shipments.removeAt(shipmentIndex);
    }
  }

  // Package Piece FormArray Operations
  public addPiece(shipmentIndex: number): void {
    const pieceGroup = this.formBuilder.group({
      id: [''],
      description: ['', Validators.required],
      weight: [0, [Validators.required, Validators.min(0.01)]],
      height: [0, [Validators.required, Validators.min(0.01)]],
      width: [0, [Validators.required, Validators.min(0.01)]],
      length: [0, [Validators.required, Validators.min(0.01)]]
    });
    this.getPieces(shipmentIndex).push(pieceGroup);
  }

  public removePiece(shipmentIndex: number, pieceIndex: number): void {
    const pieces = this.getPieces(shipmentIndex);
    if (pieces.length > 1) {
      pieces.removeAt(pieceIndex);
    }
  }

  private setupAutoCompleteForShipmentAddress() {
    this.filteredLocationsForShipment = this.orderForm.get('shipmentAddress.line1')!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(val => typeof val === 'string' && val.length > 3),
      switchMap(searchTerm => {
        const lookup = new LocationLookup();
        lookup.street = searchTerm;
        lookup.format = 'json';
        return this.locationService.getLatitudeAndLongitudeFromAddress(lookup);
      })
    );
  }

  private setupAutoCompleteForDeliveryAddress() {
    this.filteredLocationsForDelivery = this.orderForm.get('deliveryAddress.line1')!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(val => typeof val === 'string' && val.length > 3),
      switchMap(searchTerm => {
        const lookup = new LocationLookup();
        lookup.street = searchTerm;
        lookup.format = 'json';
        return this.locationService.getLatitudeAndLongitudeFromAddress(lookup);
      })
    );
  }

  public displayFn(loc: any): string {
    if (typeof loc === 'string') {
      return loc;
    }
    return loc ? loc.display_name : '';
  }

  public onShipmentAddressSelected(event: any) {
    this.patchAddressFields(event.option.value, 'shipmentAddress');
  }

  public onDeliveryAddressSelected(event: any) {
    this.patchAddressFields(event.option.value, 'deliveryAddress');
  }

  private patchAddressFields(selected: any, targetFormGroup: 'shipmentAddress' | 'deliveryAddress') {
    const address = selected.address;
    const houseNumber = address?.house_number || '';
    const road = address?.road || '';
    const calculatedLine1 = houseNumber ? `${houseNumber} ${road}` : (selected.name || road || '');

    this.orderForm.get(targetFormGroup)?.patchValue({
      line1: calculatedLine1,
      city: address ? (address.city || address.town || address.village || '') : '',
      state: address ? (address.state || '') : '',
      postalCode: address ? (address.postcode || '') : '',
      country: address ? (address.country || '') : '',
      latitude: parseFloat(selected.lat) || 0,
      longitude: parseFloat(selected.lon) || 0
    });
  }

  public createOrderShipment() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const formValue = this.orderForm.value;

    // Assemble payload matching the required structural schema data types
    const orderData: Order = {
      ...new Order(),
      priority: formValue.priority,
      shipmentAddress: { ...formValue.shipmentAddress },
      deliveryAddress: { ...formValue.deliveryAddress },
      shipments: formValue.shipments.map((s: any) => {
        const shipment: Shipment = {
          id: s.id || '',
          orderId: '',
          pieces: s.pieces.map((p: any) => {
            const piece: Piece = {
              id: p.id || '',
              description: p.description,
              weight: p.weight,
              height: p.height,
              width: p.width,
              length: p.length,
              shipmentId: 0
            };
            return piece;
          })
        };
        return shipment;
      })
    };

    this.orderService.createOrder(orderData)
      .pipe(takeUntil(this.destroyDialogFlag))
      .subscribe({
        next: (orderCreated) => {
          console.info('Order successfully created:', orderCreated);
          this.dialogReference.close(orderCreated);
        },
        error: (err) => {
          console.error('Failed to create order shipment:', err);
        }
      });
  }

  public cancelDialog(): void {
    this.dialogReference.close();
  }

  ngOnDestroy(): void {
    this.destroyDialogFlag.next();
    this.destroyDialogFlag.complete();
  }
}
