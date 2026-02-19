import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from "@angular/material/grid-list";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login.page/login.page.component';
import { OrderPageComponent } from './pages/order.page/order.page.component';
import { DocumentsPageComponent } from './pages/documents.page/documents.page.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { provideHttpClient } from '@angular/common/http';
import { provideKeycloak, withAutoRefreshToken, AutoRefreshTokenService, UserActivityService } from "keycloak-angular";
import { ForbiddenPage } from './pages/forbidden.page/forbidden.page';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    OrderPageComponent,
    DocumentsPageComponent,
    FooterComponent,
    HeaderComponent,
    ForbiddenPage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule
  ],
  providers: [
    provideHttpClient(),
    provideKeycloak({
      config: {
        url: "http://127.0.0.1:8080/",
        realm: "tms",
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
      providers: [AutoRefreshTokenService, UserActivityService]
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
