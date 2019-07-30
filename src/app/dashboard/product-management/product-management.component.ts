
import { Component, OnInit } from '@angular/core';
import { OnFailService } from "../../services/on-fail.service";
import { EntityList } from "../../services/entitylist.service";
import { ToastrService } from 'ngx-toastr';
import { ButtonRendererComponent } from "../../renderer/button-renderer.component";
import { ProductManagementService } from "./product-management.service";

declare var $: any;

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {

  gridApi;
  gridColumnApi;

  frameworkComponents: any;

  columnDefs;
  defaultColDef;
  rowData: any[];

 cell_center = {
   "text-align": "center",
   color: "black",
   "font-weight": "2000"
 };

 constructor(
   private _toaster: ToastrService,
   private _ProductManagementService_: ProductManagementService,
   private _entityList_: EntityList, private _product_: ProductManagementService , private _onFail_ : OnFailService) {
   this.columnDefs = [
     {
       headerName: "#",
       headerCheckboxSelection: true,
       headerCheckboxSelectionFilteredOnly: true,
       checkboxSelection: true,
       suppressSizeToFit: true,
       cellStyle: this.cell_center
     },
     {
      headerName: "Edit",
      cellRenderer: "buttonRenderer",
      cellRendererParams: {
        onClick: this.editModel.bind(this),
        label: "Click 2"
      },
      cellClass: "grid-align",
      cellStyle: this.cell_center
      },
     {
       headerName: "Product ID",
       field: "product_ID",
       headerClass: "resizable-header",
       cellStyle: this.cell_center
     },
     {
       headerName: "Product Name",
       field: "product_NAME",
       cellStyle: this.cell_center
     },
     {
       headerName: "Product Price",
       field: "product_PRICE",
       cellStyle: this.cell_center
     },
     {
       headerName: "Product Description",
       field: "product_DESCRIPTION",
       cellStyle: this.cell_center
     },
     {
       headerName: "Active",
       field: "isactive",
       cellStyle: this.cell_center
     }
   ];
   this.defaultColDef = { resizable: true };
   this.frameworkComponents = { buttonRenderer: ButtonRendererComponent };
 }

 editModel(row){
  console.log('====================================');
  console.log(row);
  console.log('====================================');
  $("#editModal").modal("show");
  var status ;
  if(row.rowData.isactive == "Y" || row.rowData.isactive == "y")
  {
    status = true;
  }
  else
  {
    status = false;
  }
  this.product = {
    id: row.rowData.product_ID,
    product_name: row.rowData.product_NAME,
    product_price: row.rowData.product_PRICE,
    isactive: status,
    description: row.rowData.product_DESCRIPTION
  }  
  console.log('====================================');
  console.log(this.product);
  console.log('====================================');
 }

 ngOnInit() {
 }

 sizeToFit() {
   this.gridApi.sizeColumnsToFit();
 }

 autoSizeAll() {
   var allColumnIds = [];
   this.gridColumnApi.getAllColumns().forEach(function (column) {
     allColumnIds.push(column.colId);
   });
   this.gridColumnApi.autoSizeColumns(allColumnIds);
 }

 onGridReady(params) {
   this.gridApi = params.api;
   this.gridApi.sizeColumnsToFit();
   this.gridColumnApi = params.columnApi;
   this.getAllProducts();
 }

 product: any = {
   product_name: null,
   product_price: null,
   description: null
 };

 entityList = [];

 getAllProducts(){
   this._ProductManagementService_.getall().subscribe(res => {
     if(res)
     {
       console.log('====================================');
       console.log(res);
       this.rowData = res;
       console.log('====================================');
     }
   } , error => {
     console.error(error);  
     this._onFail_.onFail(error);
   })
 }

 addFunction(){
   $("#addModal").modal("show");
 }

 addproduct(product){
  if(product.description == null)
  {
    product.description = "";
  }
  var object = {
    product_NAME: product.product_name,
    product_PRICE:product.product_price,
    product_DESCRIPTION:product.description
  }
  console.log('====================================');
  console.log(object);
  console.log('====================================');
  this._product_.add(object).subscribe(res => {
    if (res)
    {
      this._toaster.success("Addedd successfully");
      $("#addModal").modal("hide");
      this.product = {
        entitystatus: null,
        code: null,
        entity: null,
        description: null
      };   
      this.getAllProducts(); 
    }
  } , error => {
      this._onFail_.onFail(error);
  })
}

editproduct(product){
  console.log('====================================');
  console.log(product);
  console.log('====================================');
  if (product.description == null) {
    product.description = "";
  }
  if(product.isactive == true)
  {
    product.isactive = "Y";
  }
  else
  {
    product.isactive = "N";
  }
  var object = {
    product_NAME: product.product_name,
    product_PRICE:product.product_price,
    product_DESCRIPTION:product.description,
    isactive:product.isactive
  }
  
  console.log('====================================');
  console.log(object);
  console.log(product.id);
  console.log('====================================');
  this._product_.update(object, product.id).subscribe(res => {
    if (res) {
      this._toaster.success("Addedd successfully");
      this.getAllProducts();
      $("#editModal").modal("hide");
      this.product = {
        entitystatus: null,
        code: null,
        entity: product.entity,
        description: null
      };
    }
  }, error => {
    this._onFail_.onFail(error);
  })
}

}
