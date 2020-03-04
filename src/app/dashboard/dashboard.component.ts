import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dsmodel } from '../dsmodel.Interface';
import { BackendService } from '../backend.service';

var jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  subs: Subscription;
  Data: any;
  loading: boolean = false;

  constructor(private be: BackendService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    let params: Dsmodel = {
      cols: 'i.id, i.name, s.qty, u.name as unit, DATE_FORMAT(s.date, "%M %d %Y") as date',
      table: 'stocks s',
      order: `i.classid, i.name asc`,
      join: 'left join items i on i.id=s.item left join unitofmeasurement u on u.id=s.unit',
      wc: `s.qty<100`
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      this.Data = d;
    }, (e) => {
      this.loading = false;
      console.error(e);
    }, () => this.loading = false);
  }

  onPrint() {
    var columns = [
      { title: "ID", dataKey: "id" },
      { title: "Item", dataKey: "name" },
      { title: "Stocks", dataKey: "qty" },
      { title: "Unit", dataKey: "unit" },
      { title: "Date Updated", dataKey: "date" }
    ];
    var doc = new jsPDF('p', 'pt', 'letter');
    var totalPagesExp = "{total_pages_count_string}";
    doc.autoTable(columns, this.Data, {
      startY: false, // false (indicates margin top value) or a number
      tableWidth: 'auto', // 'auto', 'wrap' or a number
      showHead: 'everyPage', // 'everyPage', 'firstPage', 'never'
      tableLineColor: 200, // number, array (see color section below)
      tableLineWidth: 0,
      headStyles: {
        fontStyle: 'bold',
        halign: 'center'
      },
      margin: { top: 160 },
      columnStyles: {
        amt: {
          halign: 'right',
          fontStyle: 'bold'
        },
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

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
