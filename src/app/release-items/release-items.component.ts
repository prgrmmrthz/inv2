import { Component, OnInit, ViewChild, ElementRef, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BackendService } from '../backend.service';
import { Dsmodel } from '../dsmodel.Interface';
import Swal from 'sweetalert2';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/public_api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-release-items',
  templateUrl: './release-items.component.html',
  styleUrls: ['./release-items.component.css']
})
export class ReleaseItemsComponent implements OnInit, OnDestroy {
  Data = [];
  dataToSave = [];
  logs = [];
  loading = false;
  subs: Subscription;
  selectedValue: string;
  orderId: number;
  barcode: string

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
      wc: 'id=1'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(async d => {
      const docnumber = d[0].num;
      const { value: name } = await Swal.fire({
        title: `New Order [Doc#${docnumber}]`,
        input: 'text',
        inputPlaceholder: 'Enter Customer Name',
        validationMessage: 'Please Input Customer name',
        inputValidator: result => !result && 'Please Input Customer name!'
      });
      if (name) {
        const customerName = name;
        let a = { fn: `newOrder('${customerName}', ${docnumber})` };
        this.be.callSP(a).subscribe(r => {
          const x = r.res[0][0].result;
          if (x > 0) {
            this.orderId = x;
          }
        },
          (e) => {
            Swal.fire(
              'Error in creating Order',
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
    });
  }


  getData() {
    ///
    let params: Dsmodel = {
      cols: 'i.id,i.name,s.qty as stocks, c.name as cls',
      table: 'items i',
      order: 'classid, name asc',
      join: 'LEFT JOIN stocks s on s.item=i.id Left join classification c on c.id=i.classid'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      this.Data = d.map((v) => {
        return {
          id: v.id,
          name: v.name,
          stocks: v.stocks,
          qty: 1,
          cls: v.cls
        }
      });
    }, (e) => {
      this.loading = false;
      console.error(e);
    }, () => this.loading = false);
  }

  onSelect(e: TypeaheadMatch): void {
    if (e.item['stocks'] > 0) {
      this.dataToSave.push(e.item);
    } else {
      Swal.fire(
        'Out of Stock!',
        `Item ${e.item['name']} has no stocks left`,
        'warning'
      );
    }
    this.selectedValue = '';

  }

  validateInputX(t) {
    //console.debug(t);
    if (t.qty > t.stocks) {
      const tinput = this.el.nativeElement.querySelector('#ti-' + t.id);
      console.debug(tinput);
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

  delete(i) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
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
    let dataToSaveX = this.dataToSave.filter((v) => { return v.qty !== null });
    dataToSaveX.forEach((v) => {
      let a = { fn: `releaseStock(${v.id}, ${v.qty}, ${this.orderId})` };
      this.be.callSP(a).subscribe(r => {
        const x = r.res[0][0].result;
        if (x > 0) {
          this.logs.push(`${v.name} [${v.qty}] : success`);
        }
      },
        (e) => this.logs.push(`${v.name} : error (${e.error.sqlMessage})`),
        () => {
          this.loading = false;
          Swal.fire(
            'Finished saving!',
            'Please check log details below.',
            'success'
          );
          this.dataToSave = [];
          this.getData();
        });
    });
  }

  onSearch() {
    let timerInterval;
    let params: Dsmodel = {
      cols: 'i.id,i.name,s.qty as stocks',
      table: 'items i',
      limit: '0, 1',
      join: 'LEFT JOIN stocks s on s.item=i.id',
      wc: `i.barcode='${this.barcode}'`
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      if (d.length > 0) {
        if (d[0].stocks > 0) {
          const a = {
            id: d[0].id,
            name: d[0].name,
            stocks: d[0].stocks,
            qty: 1,
            cls: ''
          }
          this.dataToSave.push(a);
        } else {
          Swal.fire({
            title: 'Out of Stock!',
            text: ``,
            icon: 'warning',
            html: `<p>Item ${d[0].name}: ${d[0].stocks} stocks left<p><br>auto close in <b></b> milliseconds.`,
            allowEnterKey: true,
            allowEscapeKey: true,
            timer: 1500,
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
      } else {
        Swal.fire({
          title: 'No Item found!',
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

  alert(d) {
    alert(d);
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
