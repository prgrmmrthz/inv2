import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { Subscription } from 'rxjs';
import { Dsmodel } from '../dsmodel.Interface';
import Swal from 'sweetalert2';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/public_api';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css']
})
export class AddStockComponent implements OnInit, OnDestroy {
  unitData = [];
  Data = [];
  dataToSave = [];
  logs = [];
  loading = false;
  subs: Subscription;
  selectedValue: string;
  addStockId: number;

  constructor(
    public router: Router,
    private be: BackendService,
    private el: ElementRef
  ) { }

  async ngOnInit(): Promise<void> {
    let params: Dsmodel = {
      cols: 'num',
      table: 'docnumber',
      limit: '0, 1',
      wc: 'id=2'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(async d => {
      const docnumber = d[0].num;
      const { value: name } = await Swal.fire({
        title: `Add Stock [Doc#${docnumber}]`,
        input: 'text',
        inputPlaceholder: 'Enter Custodian Name',
        validationMessage: 'Please Input Custodian name',
        inputValidator: result => !result && 'Please Input Custodian name!'
      });
      if (name) {
        const customerName = name;
        let a = { fn: `newStockNumber('${customerName}', ${docnumber})` };
        this.be.callSP(a).subscribe(r => {
          const x = r.res[0][0].result;
          if (x > 0) {
            this.addStockId = x;
          }
        },
          (e) => {
            Swal.fire(
              'Error in creating AddStock number',
              e.sqlMessage,
              'error'
            ).then(() => this.router.navigate(['/dashboard']));
          });
      } else {
        Swal.fire("empty!").then(() => this.router.navigate(['/dashboard']));
      }
    }, (e) => {
      this.loading = false;
      console.error(e);
    }, () => {
      this.getData();
      this.getUnit();
    });
  }

  getData() {
    ///
    let params: Dsmodel = {
      cols: 'id,name',
      table: 'items'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      this.Data = d.map((v) => {
        return {
          id: v.id,
          name: v.name,
          qty: null,
          unit: 1
        }
      });
    }, (e) => {
      this.loading = false;
      console.error(e);
    }, () => this.loading = false);
  }

  getUnit() {
    ///////////////////////////
    let params: Dsmodel = {
      cols: 'id,name',
      table: 'unitofmeasurement'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      this.unitData = d;
    }, (e) => {
      this.loading = false;
      console.error(e);
    }, () => this.loading = false);
  }

  onSelect(e: TypeaheadMatch): void {
    if (!this.dataToSave.some((v) => v.id == e.item['id'])) {
      this.dataToSave.push(e.item);
    } else {
      Swal.fire(
        'Duplicate Item!',
        `Item ${e.item['name']} already in the selection`,
        'warning'
      );
    }
    this.selectedValue = '';
  }

  delete(i) {
    Swal.fire({
      title: 'Delete',
      text: "Remove from selection?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.dataToSave.splice(i, 1);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  onSave() {
    let dataToSaveX=this.dataToSave.filter((v)=>{return v.qty!==null});
    dataToSaveX.forEach((v) => {
      let a = { fn: `addStock(${v.id}, ${v.qty}, ${this.addStockId}, ${v.unit})` };
      this.be.callSP(a).subscribe(r => {
        const x = r.res[0][0].result;
        if (x > 0) {
          this.logs.push(`${v.name} [${v.qty}] : success`);
        }
      },
        (e) => this.logs.push(`${v.name} : error (${e.sqlMessage})`));
    });

    let params2: Dsmodel = {
      cols: 'num=num+1',
      table: 'docnumber',
      wc: 'id=1'
    }
    this.subs = this.be.updateData(params2).subscribe(d2 => {
      console.debug(d2);
    }, (e) => {
      this.loading = false;
      console.error(e);
    }, () => {
      this.loading = false;
      Swal.fire(
        'Finished saving!',
        'Please check log details below.',
        'success'
      );
      this.dataToSave = [];
      this.getData();
    });
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

}
