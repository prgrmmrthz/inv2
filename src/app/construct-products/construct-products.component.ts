import { Component, OnInit, OnDestroy, ElementRef, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { BackendService } from '../backend.service';
import { Dsmodel } from '../dsmodel.Interface';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/public_api';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-construct-products',
  templateUrl: './construct-products.component.html',
  styleUrls: ['./construct-products.component.css']
})
export class ConstructProductsComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  productsData = [];
  Data = [];
  dataToSave = [];
  logs = [];
  loading = false;
  subs: Subscription;
  selectedValue: string;
  unitData = [];
  productId: number;
  mode=1;
  frmProduct: FormGroup;
  term;

  constructor(
    private be: BackendService,
    private el: ElementRef,
    private modalService: BsModalService,
    private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.frmProduct = this.fb.group({
      name: ["", Validators.required],
      barcode: ["", [Validators.required]]
    });
    this.getProducts();
    this.getItems();
  }

  getProducts(){
    let params: Dsmodel = {
      cols: 'id,name,barcode',
      table: 'products',
      order: 'name asc'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      this.productsData = d;
    }, (e) => {
      this.loading = false;
      console.error(e);
    }, () => this.loading = false);
  }

  getItems() {
    let params: Dsmodel = {
      cols: 'id,name,classid as cls',
      table: 'items'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      this.Data = d;
    }, (e) => {
      this.loading = false;
      console.error(e);
    }, () => this.loading = false);
  }

  openModal(template: TemplateRef<any>) {
    const config = {
      keyboard: false,
      class: 'modal-lg',
      backdrop: false,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(template, config);
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

  g(formname: string): any{
    return this.frmProduct.get(formname).value;
  }

  onSave() {
    //console.debug(this.dataToSave);
    this.dataToSave.forEach((v)=>{
      let p=`${v.id}, ${this.productId},${v.indexX}`;
      let a={ fn: `updateRawmat(${p})`};
      this.be.callSP(a).subscribe(r => {
        const x = r.res[0][0].result;
        if (x > 0) {
          Swal.fire(
            'Successfully saved!',
            'Database has been updated.',
            'success'
          ).then(()=>{
            this.logs.push(`${this.g('name')} : success[${this.mode==1 ? 'Insert': 'Update'}]`);
            this.frmProduct.reset();
            this.modalRef.hide();
            this.getProducts();
            this.getItems();
          });
        }else if(x==0){
          Swal.fire(
            'Duplicate!',
            `Product ${this.g('name')} already exist.`,
            'warning'
          );
        }else{
          Swal.fire(
            'Duplicate!',
            `Barcode ${this.g('barcode')} already exist.`,
            'warning'
          );
        }
      },
        (e) =>{
          Swal.fire(
            `Error ${e.message.errno}`,
            JSON.stringify(e),
            'error'
          );
          this.logs.push(`${this.g('name')} : error (${e.error.sqlMessage})`);
        },
        () => {
          this.loading = false;
          Swal.fire(
            'Finished saving!',
            'Please check log details.',
            'success'
          ).then(()=>this.onCancel());
        });
    });
  }

  onCancel(){
    this.frmProduct.reset();
    this.dataToSave=[];
    this.modalRef.hide();
  }

  onRefreshItems(){
    this.getItems();
  }

  onEditProduct(t, template){
    this.dataToSave=[];
    this.productId=t.id
    this.frmProduct.patchValue({
      name: t.name,
      barcode: t.barcode
    });
    let params: Dsmodel = {
      cols: 'i.id,i.name,r.indexX',
      table: 'productRawmat r',
      wc: 'r.product='+t.id,
      join: 'left join items i on i.id=r.item',
      order: 'r.indexX'
    }
    this.subs = this.be.getDataWithJoinClause(params).subscribe(d => {
      this.dataToSave = d;
    }, (e) => {
      this.loading = false;
      console.error(e);
    }, () => {
      this.loading = false;
      this.mode=2;
      this.openModal(template);
    });
  }

  onDeleteProduct(r){
    
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
