import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Dsmodel } from '../dsmodel.Interface';
var jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-foil-reports',
  templateUrl: './foil-reports.component.html',
  styleUrls: ['./foil-reports.component.css']
})
export class FoilReportsComponent implements OnInit {
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
      {hKey: 's.stock', value: 'Stocks Left', icon: ''},
      {hKey: 's.date', value: 'Date Updated', icon: ''}
    ]
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(wc?, order?) {
    let params: Dsmodel = {
      cols: 'i.id, i.name, s.stock as total, DATE_FORMAT(s.date, "%M %d %Y") as date, ar.qty as oldstock, addstockSum.totaladd as newpo, releaseSum.totalrelease as totalrelease',
      table: 'foil s',
      order: `${order? order : 'i.classid, s.stock, i.name asc'}`,
      join: 'left JOIN ( SELECT product,COALESCE(SUM(qty),0) AS totalrelease FROM inv2TEST.productiondetails GROUP BY item ) releaseSum ON releaseSum.item = s.item left JOIN ( SELECT item,COALESCE(SUM(qty),0) AS totaladd FROM inv2TEST.addstockdetails GROUP BY item ) addstockSum ON addstockSum.item = s.item right join items i on i.id=s.item left join unitofmeasurement u on u.id=s.unit left join inventoryarchivedetails ar on ar.item=s.item',
      wc: `${wc? wc : ''}`
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      this.Data = d;
    }, (e) => {
      this.loading = false;
      console.error(e);
    }, () => this.loading = false);
  }

}
