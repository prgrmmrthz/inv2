import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganicHerbalInvComponent } from './organic-herbal-inv/organic-herbal-inv.component';
import { ReleaseItemsComponent } from './release-items/release-items.component';
import { AddStockComponent } from './add-stock/add-stock.component';
import { StocksReportComponent } from './stocks-report/stocks-report.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BarcodeGeneratorComponent } from './barcode-generator/barcode-generator.component';
import { ConstructProductsComponent } from './construct-products/construct-products.component';
import { ProductionComponent } from './production/production.component';
import { ConvertBagComponent } from './convert-bag/convert-bag.component';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'organicinv', component: OrganicHerbalInvComponent },
  { path: 'rlsitms', component: ReleaseItemsComponent },
  { path: 'addstock', component: AddStockComponent },
  { path: 'stocksreport', component: StocksReportComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'barcodegenerator', component: BarcodeGeneratorComponent},
  { path: 'constructProducts', component: ConstructProductsComponent},
  { path: 'production', component: ProductionComponent},
  { path: 'convertbag', component: ConvertBagComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
