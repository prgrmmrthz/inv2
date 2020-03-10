import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrganicHerbalInvComponent } from './organic-herbal-inv/organic-herbal-inv.component';
import { ReleaseItemsComponent } from './release-items/release-items.component';
import { AddStockComponent } from './add-stock/add-stock.component';
import { StocksReportComponent } from './stocks-report/stocks-report.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BackendService } from './backend.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BarcodeGeneratorComponent } from './barcode-generator/barcode-generator.component';
import { ProductsComponent } from './products/products.component';
import { ConstructProductsComponent } from './construct-products/construct-products.component';
import { ProductionComponent } from './production/production.component';
import { ConvertBagComponent } from './convert-bag/convert-bag.component';
import { FoilInventoryComponent } from './foil-inventory/foil-inventory.component';
import { BoxesInventoryComponent } from './boxes-inventory/boxes-inventory.component';
import { FoilAddStockComponent } from './foil-add-stock/foil-add-stock.component';
import { BoxesAddStockComponent } from './boxes-add-stock/boxes-add-stock.component';
import { FoilReportsComponent } from './foil-reports/foil-reports.component';
import { BoxesReportsComponent } from './boxes-reports/boxes-reports.component';

let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  declarations: [
    AppComponent,
    OrganicHerbalInvComponent,
    ReleaseItemsComponent,
    AddStockComponent,
    StocksReportComponent,
    DashboardComponent,
    PageNotFoundComponent,
    BarcodeGeneratorComponent,
    ProductsComponent,
    ConstructProductsComponent,
    ProductionComponent,
    ConvertBagComponent,
    FoilInventoryComponent,
    BoxesInventoryComponent,
    FoilAddStockComponent,
    BoxesAddStockComponent,
    FoilReportsComponent,
    BoxesReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    TypeaheadModule.forRoot(),
    SweetAlert2Module.forRoot(),
    BsDropdownModule.forRoot(),
    NoopAnimationsModule,
    Ng2SearchPipeModule,
    NgxMaskModule.forRoot(options)
  ],
  providers: [
    BackendService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
