import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, Observable, switchMap } from 'rxjs';
import { LocationService } from '../../../services/location.service';
import { LocationLookup } from '../../../models/locations/location-lookup';
import { LocationDetails } from '../../../models/locations/location-details';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-update-order-shipment',
  standalone: false,
  templateUrl: './update-order-shipment.component.html',
  styleUrl: './update-order-shipment.component.css',
})
export class UpdateOrderShipmentComponent implements OnInit {
  public senderAddressForm!: FormGroup;
  public receiverAddressForm!: FormGroup;
  public filteredLocationForSenderAddress!: Observable<LocationDetails[]>;
  public filteredLocationForReceiverAddress!: Observable<LocationDetails[]>;

  constructor(
    private readonly dialogReference: MatDialogRef<UpdateOrderShipmentComponent, any>,
    @Inject(MAT_DIALOG_DATA) public data: Order,
    private readonly orderService: OrderService,
    private readonly locationService: LocationService,
    private formbuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.senderAddressForm = this.formbuilder.group({
      id: [""],
      line1: ["", Validators.required],
      line2: [""],
      city: ["", Validators.required],
      state: ["", Validators.required],
      postalCode: ["", Validators.required],
      country: ["", Validators.required],
      latitude: [0],
      longitude: [0]
    });

    this.receiverAddressForm = this.formbuilder.group({
      id: [""],
      line1: ["", Validators.required],
      line2: [""],
      city: ["", Validators.required],
      state: ["", Validators.required],
      postalCode: ["", Validators.required],
      country: ["", Validators.required],
      latitude: [0],
      longitude: [0]
    });

    this.setupAutoCompleteForSenderAddress();
    this.setupAutoCompleteForReceiverAddress();
  }

  private setupAutoCompleteForSenderAddress() {
    this.filteredLocationForSenderAddress = this.senderAddressForm.get("line1")!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(val => typeof val === "string" && val.length > 3),
      switchMap(searchTerm => {
        const lookup = new LocationLookup();
        lookup.street = searchTerm;
        lookup.format = "json";
        return this.locationService.getLatitudeAndLongitudeFromAddress(lookup);
      })
    );
  }

  private setupAutoCompleteForReceiverAddress() {
    this.filteredLocationForReceiverAddress = this.receiverAddressForm.get("line1")!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(val => typeof val === "string" && val.length > 3),
      switchMap(searchTerm => {
        const lookup = new LocationLookup();
        lookup.street = searchTerm;
        lookup.format = "json";
        return this.locationService.getLatitudeAndLongitudeFromAddress(lookup);
      })
    );
  }

  public onShipperAddressOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selected = event.option.value;
    const address = selected.address;

    // Combine house number and road if both exist for a valid Line 1
    const houseNumber = address?.house_number || '';
    const road = address?.road || '';
    const calculatedLine1 = houseNumber ? `${houseNumber} ${road}` : (selected.name || road || '');

    this.senderAddressForm.patchValue({
      line1: calculatedLine1,
      city: address.city || address.town || address.village || '',
      state: address.state || '',
      postalCode: address.postcode || '',
      country: address.country || '',
      latitude: selected.lat,
      longitude: selected.lon
    });
  }

  public onReceiverAddressOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selected = event.option.value;
    const address = selected.address;

    const houseNumber = address?.house_number || '';
    const road = address?.road || '';
    const calculatedLine1 = houseNumber ? `${houseNumber} ${road}` : (selected.name || road || '');

    this.receiverAddressForm.patchValue({
      line1: calculatedLine1,
      city: address.city || address.town || address.village || '',
      state: address.state || '',
      postalCode: address.postcode || '',
      country: address.country || '',
      latitude: selected.lat,
      longitude: selected.lon
    });
  }

  public displayFn(loc: LocationDetails): string {
    if (typeof loc === 'string') {
      return loc;
    }
    return loc ? loc.display_name : '';
  }

  public copySenderToReceiver(): void {
    const senderValues = this.senderAddressForm.value;
    this.receiverAddressForm.patchValue({
      ...senderValues,
      id: this.receiverAddressForm.get('id')?.value || ''
    });
  }

  public onCancel(): void {
    this.dialogReference.close();
  }

  public onSave(): void {
    if (this.senderAddressForm.valid && this.receiverAddressForm.valid) {
      const updatePayload = {
        orderId: this.data.id,
        senderAddress: this.senderAddressForm.value,
        receiverAddress: this.receiverAddressForm.value
      };

      this.data.shipmentAddress = JSON.parse(JSON.stringify(this.senderAddressForm.value));
      this.data.deliveryAddress = JSON.parse(JSON.stringify(this.receiverAddressForm.value));

      this.orderService.updateOrder(this.data.id, this.data);

      console.log('Updated order with address:', this.data);
      this.dialogReference.close(updatePayload);
    }
  }
}
