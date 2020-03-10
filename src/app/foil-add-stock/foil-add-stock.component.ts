import { Component, OnInit, ElementRef } from '@angular/core';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';
import { Dsmodel } from '../dsmodel.Interface';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/public_api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-foil-add-stock',
  templateUrl: './foil-add-stock.component.html',
  styleUrls: ['./foil-add-stock.component.css']
})
export class FoilAddStockComponent implements OnInit {
  subs: any;
  Data: { id: any; name: any; qty: number;}[];
  loading: boolean;
  dataToSave: any=[];
  selectedValue: string;
  stockId: any;
  logs: any;

  constructor(
    public router: Router,
    private be: BackendService,
    private el: ElementRef
  ) { }

  ngOnInit(){
    this.getData();
  }

  getData() {
    let params: Dsmodel = {
      cols: 'id,name',
      table: 'products'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      this.Data = d.map((v) => {
        return {
          id: v.id,
          name: v.name,
          qty: 1
        }
      });
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
          'Product has been removed.',
          'success'
        )
      }
    })
  }

  onSave() {
    let a = { fn: `foilnewStock()` };
    this.be.callSP(a).subscribe(r => {
      const x = r.res[0][0].result;
      if (x > 0) {
        this.stockId = x;
        let dataToSave2 = this.dataToSave.filter((v) => { return v.qty !== null });
        dataToSave2.forEach((v) => {
          let a = { fn: `foiladdStock(${v.id}, '${eval(v.qty).toFixed(2)}', ${this.stockId})` };
          this.be.callSP(a).subscribe(r => {
            const x = r.res[0][0].result;
            if (x > 0) {
              this.logs.push(`${v.name} : success`);
              this.dataToSave=[];
            }
          },
            (e) => this.logs.push(`${v.name} : error (${e.message})`),
            () => {
              Swal.fire(
                'Finished saving!',
                'Please check log details below.',
                'success'
              ).then(() => {
                let a = { fn: `updateDN(7)` };
                this.be.callSP(a).subscribe(r => {
                  const x = r.res[0][0].result;
                  if (x > 0) {
                    Swal.fire(
                      'Success',
                      'Success updating document number',
                      'info'
                    );
                  }
                },
                  (e) => {
                    Swal.fire(
                      'Error updating document number',
                      JSON.stringify(e),
                      'error'
                    ).then(() => this.router.navigate(['/dashboard']));
                  },
                  () => this.getData());
              });
            });
        });
      }
    },
      (e) => {
        Swal.fire(
          'Error Creating Add Stock number Number',
          JSON.stringify(e),
          'error'
        ).then(() => this.router.navigate(['/dashboard']));
      });
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
  
}
