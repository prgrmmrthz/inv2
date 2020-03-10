import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { Dsmodel } from '../dsmodel.Interface';
import { Subscription } from 'rxjs';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/public_api';
import Swal from 'sweetalert2';
var jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css']
})
export class ProductionComponent implements OnInit, OnDestroy {
  productionNumber: number;
  subs: Subscription;
  loading: boolean;
  selectedProduct: any;
  barcode: string;
  selectedValue: string;
  dataItems = [];
  productData = [];
  logs = [];
  unitData: any[];
  materialsData: { name: string; qty: any; unit: number; }[];

  constructor(
    private be: BackendService,
    private el: ElementRef,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.getProductionNumber();
    this.getProduct();
    this.getUnit();
    this.materialsData = [
      { name: 'Foil', qty: null, unit: 1 },
      { name: 'Plastic', qty: null, unit: 1 },
      { name: 'Boxes', qty: null, unit: 1 }
    ];
  }

  getItems() {
    this.dataItems = [];
    let data = [];
    this.loading = true;
    let params: Dsmodel = {
      cols: 'r.id,i.name,c.name as unitname, s.qty as stocks, s.unit as unitid, c.canuse, r.indexX, r.item as itemid',
      table: 'productRawmat r',
      join: `Left Join items i on i.id=r.item LEFT JOIN stocks s on s.item=i.id Left join unitofmeasurement c on c.id=s.unit`,
      wc: `r.product=${this.selectedProduct.id}`,
      order: 'r.indexX asc'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      if (d) {
        data = d;
        //mapping
      }
    }, (e) => {
      Swal.fire(
        'Error Loading Data!',
        JSON.stringify(e),
        'error'
      ).then((r) => {
        this.loading = false;
      });
    }, () => {
      data.forEach((v) => {
        //GEt Unit that can be selected
        this.loading = true;
        let params2: Dsmodel = {
          cols: 'id,name',
          table: 'unitofmeasurement',
          wc: `id IN(${v.canuse})`,
        }
        this.be.getDataWithJoinClause(params2).subscribe(d2 => {
          let a = {
            id: v.id,
            name: v.name,
            stockqty: v.stocks || 0,
            qty: null,
            unit: v.unitid,
            unitid: v.unitid,
            unitname: v.unitname,
            canuse: d2,
            indexX: v.indexX,
            itemid: v.itemid
          }
         // console.debug(a);
          this.dataItems.push(a);
        }, (e2) => {
          Swal.fire(
            'Error Loading Unit Can Use!',
            JSON.stringify(e2),
            'error'
          ).then((r) => {
            this.loading = false;
          });
        }, () => {
          this.dataItems.sort((a,b)=>a.indexX-b.indexX);
          this.loading = false
        });
        ///////

      }); //foreach
      this.loading = false;
    });
  }

  getProduct() {
    this.loading = true;
    let params: Dsmodel = {
      cols: 'id,name',
      table: 'products'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      this.productData = d;
    }, (e) => {
      Swal.fire(
        'Error Loading Data!',
        JSON.stringify(e),
        'error'
      ).then((r) => {
        this.loading = false;
      });
    }, () => this.loading = false);
  }

  getUnit() {
    this.loading = true;
    let params: Dsmodel = {
      cols: 'id,name',
      table: 'unitofmeasurement'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      this.unitData = d;
    }, (e) => {
      Swal.fire(
        'Error Loading Data!',
        JSON.stringify(e),
        'error'
      ).then((r) => {
        this.loading = false;
      });
    }, () => this.loading = false);
  }

  validateInputX(t) {
    const tinput = this.el.nativeElement.querySelector('#ti-' + t.id);
    //IF KLS
    if (t.unitid == 3 && t.unit > 1) {
      const stocksleftGram = t.stockqty * 1000;
      const qtyUnitGram: number = t.unit == 3 ? t.qty * 1000 : t.qty;
      if (stocksleftGram < qtyUnitGram) {
        //console.debug(tinput);
        Swal.fire(
          'Stock out of Range!',
          `Item ${t['name']}: ${t.stocks} stocks left`,
          'warning'
        ).then((r) => {
          //console.debug(r);
          tinput.focus();
        });
      }
      //else if grm
    } else if (t.unitid == 2 && t.unit > 1) {
      const qtyUnitGram: number = t.unit == 3 ? t.qty * 1000 : t.qty;
      if (qtyUnitGram > t.stockqty) {
        //console.debug(tinput);
        Swal.fire(
          'Stock out of Range!',
          `Item ${t['name']}: ${t.stocks} stocks left`,
          'warning'
        ).then((r) => {
          //console.debug(r);
          tinput.focus();
        });
      }
    } else {
      if (t.qty > t.stockqty) {
        Swal.fire(
          'Stock out of Range!',
          `Item ${t['name']}: ${t.stocks} stocks left`,
          'warning'
        ).then((r) => {
          //console.debug(r);
          tinput.focus();
        });
      }
    }
  }

  onPrint() {
    const a = this.selectedProduct.name;
    var columns = [
      { title: "Raw Materials", dataKey: "name" },
      { title: "Stocks", dataKey: "stockqty" },
      { title: "Unit", dataKey: "unitname" },
      { title: "Quantity", dataKey: "qty" }
    ];
    var doc = new jsPDF('p', 'pt', 'letter');
    var totalPagesExp = "{total_pages_count_string}";
    doc.autoTable(columns, this.dataItems, {
      theme: 'grid',
      startY: false, // false (indicates margin top value) or a number
      showHead: 'everyPage', // 'everyPage', 'firstPage', 'never'
      tableLineColor: 200, // number, array (see color section below)
      tableLineWidth: 0,
      styles: {
        fontSize: 8
      },
      headStyles: {
        fontStyle: 'bold',
        halign: 'center'
      },
      margin: { top: 160 },
      columnStyles: {
        stockqty: {
          halign: 'right',
          fontStyle: 'bold',
          columnWidth: 50
        },
        name: {
          columnWidth: 200
        },
        unitname: {
          columnWidth: 70
        }
      },
      didDrawPage: function (dataToPrint) {
        doc.setFontSize(18);
        doc.text(`Production`, 40, 80);
        doc.setFontSize(12);
        doc.text(`Product: ${a}`, 40, 100);
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 40, 120);
        // FOOTER
        var str = "Page " + dataToPrint.pageCount;
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
          str = str + " of " + totalPagesExp;
        }
        doc.setFontSize(10);
        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        doc.text(str, dataToPrint.settings.margin.left, pageHeight - 10);
      }
    });

    var columns2 = [
      { title: "Materials", dataKey: "name" },
      { title: "Quantity", dataKey: "qty" }
    ];
    doc.autoTable(columns2, this.materialsData, {
      theme: 'grid',
      showHead: 'firstPage',
      startY: doc.lastAutoTable.finalY + 50,
      styles: {
        fontSize: 8
      }
    });

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }
    
    var blob = doc.output('blob');
    window.open(URL.createObjectURL(blob));
  }

  getProductionNumber() {
    let params: Dsmodel = {
      cols: 'num',
      table: 'docnumber',
      limit: '0, 1',
      wc: 'id=3'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(async d => {
      this.productionNumber = d[0].num;
    }, (e) => {
      Swal.fire(
        'Error Loading Data!',
        JSON.stringify(e),
        'error'
      ).then((r) => {
        this.loading = false;
      });
    }, () => {
      this.loading = false;
    });
  }

  onSelect(e: TypeaheadMatch): void {
    this.selectedProduct = e.item;
    this.selectedValue = '';
    this.getItems();
  }

  onSearch() {
    let timerInterval;
    let params: Dsmodel = {
      cols: 'id,name,items',
      table: 'products',
      limit: '0, 1',
      wc: `barcode='${this.barcode}'`
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      if (d.length > 0) {
        this.selectedProduct = d[0];
        this.getItems();
      } else {
        Swal.fire({
          title: 'No Product found!',
          icon: 'error',
          html: `<p>Please check barcode.<p><br>auto close in <b></b> milliseconds.`,
          allowEnterKey: true,
          allowEscapeKey: true,
          timer: 1000,
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
              const content = Swal.getContent()
              if (content) {
                const b = content.querySelector('b')
                if (b) {
                  b.textContent = Swal.getTimerLeft().toString()
                }
              }
            }, 100)
          },
          onClose: () => {
            clearInterval(timerInterval)
          }
        });
      }
    }, (e) => {
      Swal.fire(
        `Error ${e['error'].error.errno}!`,
        e['error'].error.code,
        'warning'
      );
      //console.debug(e.error);
    }, () => {
      const tinput = this.el.nativeElement.querySelector('#barcode');
      tinput.select();
    });
  }

  onSave() {
    if(!this.dataItems.some((v)=>{
    //console.debug('stock', this.c(v.stockqty, v.unitid),['qty', this.c(v.qty, v.unit)]);
    return v.stockqty < v.qty
    })){
      let a = { fn: `newProduction(${this.selectedProduct.id})` };
      this.be.callSP(a).subscribe(r => {
        const x = r.res[0][0].result;
        //console.debug(x);
        if (x > 0) {
          //console.debug(this.dataItems);
          let dataToSave = this.dataItems.filter((v) => { return v.qty !== null });
          dataToSave.forEach((v) => {
            
            //pitem int, pqty int, pproductionid int,punit int
            let a = { fn: `saveProductiondetails(${v.itemid}, '${v.qty}', ${x}, ${v.unit})` };
            this.be.callSP(a).subscribe(r => {
              const x2 = r.res[0][0].result;
              if (x2 > 0) {
                this.logs.push(`${v.name} : success`);
              }
            },
              (e) => this.logs.push(`${v.name} : error (${e.message})`),
              () => {
                Swal.fire(
                  'Finished saving!',
                  'Please check log details below.',
                  'success'
                );
              });
          });
        }
      },
        (e) => {
          Swal.fire(
            'Error Creating Production ID',
            JSON.stringify(e),
            'error'
          ).then(() => this.router.navigate(['/dashboard']));
        });
    }else{
      Swal.fire(
        'Error 101',
        'Qty > Stocks or Quantity is not correct',
        'error'
      );
    }
        
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

}
