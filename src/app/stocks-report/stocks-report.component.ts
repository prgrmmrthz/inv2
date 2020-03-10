import { Component, OnInit } from '@angular/core';
import { Dsmodel } from '../dsmodel.Interface';
import { Subscription } from 'rxjs';
import { BackendService } from '../backend.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
var jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-stocks-report',
  templateUrl: './stocks-report.component.html',
  styleUrls: ['./stocks-report.component.css']
})
export class StocksReportComponent implements OnInit {
  subs: Subscription;
  Data: any;
  loading: boolean = false;
  frmSearch: FormGroup;
  searchOptions=[];

  constructor(
    private be: BackendService,
    private fb: FormBuilder
  ) {
    this.frmSearch = this.fb.group({
      term: [''],
      option: ['i.name', Validators.required],
      option2: ['asc']
    });

    this.searchOptions=[
      {hKey: 'i.name', value: 'Item Name', icon: ''},
      {hKey: 's.qty', value: 'Stocks Left', icon: ''},
      {hKey: 's.date', value: 'Date Updated', icon: ''}
    ]
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(wc?, order?) {
    let params: Dsmodel = {
      cols: 'i.id, i.name, s.qty as total, DATE_FORMAT(s.date, "%M %d %Y") as date, ar.qty as oldstock, addstockSum.totaladd as newpo, releaseSum.totalrelease as totalrelease',
      table: 'stocks s',
      order: `${order? order : 'i.classid, s.qty, i.name asc'}`,
      join: 'left JOIN ( SELECT item,COALESCE(SUM(qty),0) AS totalrelease FROM inv2TEST.productiondetails GROUP BY item ) releaseSum ON releaseSum.item = s.item left JOIN ( SELECT item,COALESCE(SUM(qty),0) AS totaladd FROM inv2TEST.addstockdetails GROUP BY item ) addstockSum ON addstockSum.item = s.item right join items i on i.id=s.item left join unitofmeasurement u on u.id=s.unit left join inventoryarchivedetails ar on ar.item=s.item',
      wc: `${wc? wc : ''}`
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      this.Data = d;
    }, (e) => {
      this.loading = false;
      console.error(e);
    }, () => this.loading = false);
  }

  print() {
    var columns = [
      { title: "Item", dataKey: "name" },
      { title: "Old Stock", dataKey: "oldstock" },
      { title: "New P.O", dataKey: "newpo" },
      { title: 'Production', dataKey: 'totalrelease'},
      { title: "Date Updated", dataKey: "date" },
      { title: "Total", dataKey: "total" }
    ];
    var doc = new jsPDF('p', 'pt', 'letter');
    var totalPagesExp = "{total_pages_count_string}";
    doc.autoTable(columns, this.Data, {
      theme: 'grid',
      startY: false, // false (indicates margin top value) or a number
      tableWidth: 'auto', // 'auto', 'wrap' or a number
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
        total: {
          halign: 'right',
          fontStyle: 'bold'
        },
        oldstock: {
          halign: 'right'
        },
        newpo: {
          halign: 'right'
        },
        date: {
          halign: 'center'
        },
        totalrelease: {
          halign: 'right',
          columnWidth: 60
        }
      },
      didDrawPage: function (dataToPrint) {
        doc.setFontSize(18);
        doc.text(`Stock Report`, 110, 80);
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
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }
    var blob = doc.output('blob');
    window.open(URL.createObjectURL(blob));
  }

  onSearch(){
    let f=this.frmSearch;
    setTimeout(()=>{
      this.getData(`i.name like '%${this.g('term')}%'`, `${this.g('option')} ${this.g('option2')}, i.classid, i.name`);
    }, 800)
  }

  g(s){
    return this.frmSearch.get(s).value;
  }

  onRefresh(){
    this.getData();
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

}
