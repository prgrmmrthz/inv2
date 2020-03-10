import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { Dsmodel } from '../dsmodel.Interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-foil-inventory',
  templateUrl: './foil-inventory.component.html',
  styleUrls: ['./foil-inventory.component.css']
})
export class FoilInventoryComponent implements OnInit {
  subs: any;
  productData: any = [];
  loading: boolean;
  invId: any;
  logs: any=[];

  constructor(
    public router: Router,
    private be: BackendService,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
  }

  getData() {
    let params: Dsmodel = {
      cols: 'i.id,i.name,s.stock as qty',
      table: 'products i',
      join: 'left join foil s on s.product=i.id',
      order: 'i.classid, i.name asc'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      this.productData = d.map((v) => {
        return {
          id: v.id,
          name: v.name,
          qty: v.qty || null
        }
      });
    }, (e) => {
      this.loading = false;
      console.error(e);
    }, () => this.loading = false);
  }

  onSave() {
    let a = { fn: `newFoilInventory()` };
    this.be.callSP(a).subscribe(r => {
      const x = r.res[0][0].result;
      if (x > 0) {
        this.invId = x;
        let dataToSave = this.productData.filter((v) => { return v.qty !== null });
        dataToSave.forEach((v) => {
                                                //pproduct int, pqty DECIMAL(30, 6), invarchid int
          let a = { fn: `foilbeginningInventory(${v.id}, '${eval(v.qty).toFixed(2)}', ${this.invId})` };
          this.be.callSP(a).subscribe(r => {
            const x = r.res[0][0].result;
            if (x > 0) {
              this.logs.push(`${v.name} : success`);
            }
          },
            (e) => this.logs.push(`${v.name} : error (${e.message})`),
            () => {
              Swal.fire(
                'Finished saving!',
                'Please check log details below.',
                'success'
              ).then(() => {
                let a = { fn: `updateDN(5)` };
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
          'Error Creating Inventory Number',
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
