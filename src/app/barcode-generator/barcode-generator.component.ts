import { Component, OnInit, OnDestroy } from '@angular/core';
import * as JsBarcode from "jsbarcode";
import { Dsmodel } from '../dsmodel.Interface';
import { BackendService } from '../backend.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-barcode-generator',
  templateUrl: './barcode-generator.component.html',
  styleUrls: ['./barcode-generator.component.css']
})
export class BarcodeGeneratorComponent implements OnInit, OnDestroy {

  subs: Subscription;
  Data = [];
  loading: boolean = false;

  constructor(private be: BackendService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    let params: Dsmodel = {
      cols: 'name,barcode',
      table: 'products',
      order: 'name asc'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      this.Data = d;
    }, (e) => {
      this.loading = false;
      console.error(e);
    }, () => this.loading = false);
  }

  createBarcode() {
    this.Data.forEach((v) => {
      JsBarcode("#b-" + v.barcode, v.barcode.toString(),{
        text: v.name,
        fontSize: 14
      });
    });
  }

  onPrint() {
    window.print();
    /* let picData=[];
    var toPrint = document.getElementById('toPrint');
    console.debug(toPrint);
        var popupWin = window.open('', '_blank', 'width=510,height=660,location=no');
        popupWin.document.open();
        popupWin.document.write('<html><body>')
        popupWin.document.write(toPrint.innerHTML);
        popupWin.document.write('</body></html>');
        popupWin.document.close();
        popupWin.print();
 */
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

}
