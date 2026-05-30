import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
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
import { fromLonLat } from 'ol/proj';
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
  @ViewChild("mapElement", { static: false }) mapElement!: ElementRef;
  private destroyFlagSubject: Subject<void> = new Subject<void>();
  private map!: Map;

  public loadingMapAndRouteFlag: WritableSignal<boolean> = signal(false);
  public locationRoute: LocationRoute = new LocationRoute();

  constructor(
    private readonly locationService: LocationService,
    private readonly cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: Order
  ) {}

  ngOnInit(): void {
    this.loadingMapAndRouteFlag.set(true);

    this.locationService.getRoutesFromGraphhoper(this.data.shipmentAddress, this.data.deliveryAddress)
      .pipe(takeUntil(this.destroyFlagSubject))
      .subscribe(locationRoute => {
        this.locationRoute = JSON.parse(JSON.stringify(locationRoute));
        this.loadingMapAndRouteFlag.set(false);

        // Let Angular render the map div before initialising OL
        this.cdr.detectChanges();
        this.initializeMap();
        this.renderRoute();
      });
  }

  private initializeMap() {
    this.map = new Map({
      target: this.mapElement.nativeElement,
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({ center: fromLonLat([0, 0]), zoom: 2 })
    });
  }

  private renderRoute() {
    const path = this.locationRoute.paths[0];
    if (!path) return;

    const decoded = this.locationService.parsePath(path);

    // ----- Constructing route polyline ------
    const routeFeature = new Feature({ geometry: new LineString(decoded) });
    routeFeature.setStyle(new Style({
      stroke: new Stroke({ color: '#2563eb', width: 5, lineCap: 'round' })
    }));

    // ----- Constructing & setting the start pin (green colour) ------
    const startFeature = new Feature({ geometry: new Point(decoded[0]) });
    startFeature.setStyle(new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({ color: "#16a34a" }),
        stroke: new Stroke({ color: "#fff", width: 2 })
      })
    }));

    // ----- Constructing & setting the end pin (red colour) ------
    const endFeature = new Feature({ geometry: new Point(decoded[decoded.length - 1]) });
    endFeature.setStyle(new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({ color: '#dc2626' }),
        stroke: new Stroke({ color: '#fff', width: 2 })
      })
    }));

    // ----- At the start pin, end pin & the route polyline to the map instance -----
    this.map.addLayer(new VectorLayer({
      source: new VectorSource({ features: [routeFeature, startFeature, endFeature] })
    }));

    // ----- Fit the map to route in the correct size -----
    const extent = boundingExtent(decoded);
    this.map.getView().fit(extent, { padding: [40, 40, 40, 40], duration: 600 });
  }

  formatDistance(metres: number): string {
    return metres >= 1000
      ? `${(metres / 1000).toFixed(1)} km`
      : `${Math.round(metres)} m`;
  }

  formatTime(ms: number): string {
    const mins = Math.round(ms / 60000);
    return mins >= 60
      ? `${Math.floor(mins / 60)}h ${mins % 60}m`
      : `${mins} min`;
  }

  ngOnDestroy(): void {
    this.map?.dispose();
    this.destroyFlagSubject.next();
    this.destroyFlagSubject.complete();
  }
}
