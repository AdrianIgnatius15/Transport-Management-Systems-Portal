import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from "@angular/material/dialog";

import { 
  ModuleRegistry, 
  ColumnAutoSizeModule,
  ColumnHoverModule,
  ClientSideRowModelModule, 
  PinnedRowModule,
  RowAutoHeightModule,
  RowStyleModule,
  PaginationModule,
  RowDragModule, 
  CellSpanModule,
  CellStyleModule,
  HighlightChangesModule,
  TooltipModule, 
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  BigIntFilterModule,
  CustomFilterModule,
  ExternalFilterModule,
  QuickFilterModule, 
  RowSelectionModule, 
  TextEditorModule,
  LargeTextEditorModule,
  SelectEditorModule,
  NumberEditorModule,
  DateEditorModule,
  CheckboxEditorModule,
  CustomEditorModule,
  UndoRedoEditModule,
  ValidationModule, 
  } from "ag-grid-community";
import { AgGridAngular } from "ag-grid-angular";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login.page/login.page.component';
import { OrderPageComponent } from './pages/order.page/order.page.component';
import { DocumentsPageComponent } from './pages/documents.page/documents.page.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AutoRefreshTokenService, createInterceptorCondition, INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, IncludeBearerTokenCondition, includeBearerTokenInterceptor, provideKeycloak, UserActivityService, withAutoRefreshToken } from "keycloak-angular";
import { ForbiddenPage } from './pages/forbidden.page/forbidden.page';
import { UpdateUserProfileComponent } from './components/dialog/update-user-profile/update-user-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableCustomNoRowsOverlayComponent } from './components/table-custom-no-rows-overlay/table-custom-no-rows-overlay.component';
import { CreateOrderShipmentComponent } from './components/dialog/create-order-shipment/create-order-shipment.component';
import { OrderTableActionsComponent } from './components/order-table-actions/order-table-actions.component';

const localhostURLCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^(http:\/\/localhost:(5181|5230))(\/.*)?$/i
});

ModuleRegistry.registerModules([
  ColumnAutoSizeModule,
  ColumnHoverModule,
  ClientSideRowModelModule, 
  PinnedRowModule,
  RowAutoHeightModule,
  RowStyleModule,
  PaginationModule,
  RowDragModule, 
  CellSpanModule,
  CellStyleModule,
  HighlightChangesModule,
  TooltipModule, 
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  BigIntFilterModule,
  CustomFilterModule,
  ExternalFilterModule,
  QuickFilterModule, 
  RowSelectionModule, 
  TextEditorModule,
  LargeTextEditorModule,
  SelectEditorModule,
  NumberEditorModule,
  DateEditorModule,
  CheckboxEditorModule,
  CustomEditorModule,
  UndoRedoEditModule,
  ValidationModule
]);

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    OrderPageComponent,
    DocumentsPageComponent,
    FooterComponent,
    HeaderComponent,
    ForbiddenPage,
    UpdateUserProfileComponent,
    TableCustomNoRowsOverlayComponent,
    CreateOrderShipmentComponent,
    OrderTableActionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridAngular,
  ],
  providers: [
    provideHttpClient(
      withInterceptors([includeBearerTokenInterceptor])
    ),
    provideKeycloak({
      config: {
        url: "http://127.0.0.1:8080/",
        realm: "transportation-management-system",
        clientId: "tms-customer-portal-3865"
      },
      initOptions: {
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
      },
      features: [
        withAutoRefreshToken({
          onInactivityTimeout: "logout",
          sessionTimeout: 60000
        })
      ],
      providers: [
        AutoRefreshTokenService, 
        UserActivityService,
        {
          provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
          useValue: [localhostURLCondition]
        }
      ]
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
