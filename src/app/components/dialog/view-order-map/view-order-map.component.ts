import { Component, Inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { LocationService } from '../../../services/location.service';
import { Subject, takeUntil } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from '../../../models/order';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import { fromLonLat, transformExtent } from 'ol/proj';
import { Style, Stroke, Circle, Fill } from 'ol/style';
import { boundingExtent } from 'ol/extent';
import { LocationRoute } from '../../../models/locations/location-route';

@Component({
  selector: 'app-view-order-map',
  standalone: false,
  templateUrl: './view-order-map.component.html',
  styleUrl: './view-order-map.component.css',
})
export class ViewOrderMapComponent implements OnInit, OnDestroy {
  private destroyFlagSubject: Subject<void> = new Subject<void>();

  public loadingMapAndRouteFlag: WritableSignal<boolean> = signal(false);
  public locationRoute: LocationRoute = new LocationRoute();

  constructor(
    private readonly locationService: LocationService,
    @Inject(MAT_DIALOG_DATA) public data: Order
  ) {}

  ngOnInit(): void {
    this.locationService.getRoutesFromGraphhoper(this.data.shipmentAddress, this.data.deliveryAddress)
        .pipe(takeUntil(this.destroyFlagSubject))
      .subscribe(locationRoute => {
        locationRoute ? this.loadingMapAndRouteFlag.set(true) : this.loadingMapAndRouteFlag.set(false);
        this.locationRoute = JSON.parse(JSON.stringify(locationRoute));
      });
  }

  ngOnDestroy(): void {
    this.destroyFlagSubject.next();
    this.destroyFlagSubject.complete();
  }
}
