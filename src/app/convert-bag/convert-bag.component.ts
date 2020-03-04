import { Component, OnInit, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { Dsmodel } from '../dsmodel.Interface';
import Swal from 'sweetalert2';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/public_api';

@Component({
  selector: 'app-convert-bag',
  templateUrl: './convert-bag.component.html',
  styleUrls: ['./convert-bag.component.css']
})
export class ConvertBagComponent implements OnInit {
  subs: Subscription;
  loading: boolean;
  selectedUnit: any;
  selectedValue: string;
  dataToSave = [];
  convertibleUnitData =[];
  logs = [];
  unitData: any[];
  
  constructor(
    private be: BackendService,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.getConvertibleUnit();
    this.getUnit();
  }

  getItems(){
    this.loading=true;
    let params: Dsmodel = {
      cols: 'i.id,i.name,c.name as unitname, s.unit as unitid',
      table: 'items i',
      join: 'LEFT JOIN stocks s on s.item=i.id Left join unitofmeasurement c on c.id=s.unit',
      wc: this.selectedUnit ? `c.convertible=1` : 'i.id=0',
      order: 'i.classid, i.name'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      this.dataToSave = d.map((v) => {
        return {
          id: v.id,
          name: v.name,
          unitname: v.unitname,
          qty: null,
          unit: this.unitData[0].id,
          unitid: v.unitid
        }
      });
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

  getConvertibleUnit() {
    this.loading=true;
    let params: Dsmodel = {
      cols: 'id,name',
      table: 'unitofmeasurement',
      wc: 'convertible=1'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      this.convertibleUnitData = d;
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
    this.loading=true;
    let params: Dsmodel = {
      cols: 'id,name',
      table: 'unitofmeasurement',
      wc: 'convertible=0'
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

  onSelect(e: TypeaheadMatch): void {
    this.selectedUnit=e.item;
    this.selectedValue = '';
    this.getItems();
  }

  validateInputX(t){

  }

  onPrint(){}

  onSave(){}

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

}
