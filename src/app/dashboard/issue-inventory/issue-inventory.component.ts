
import { Component, OnInit } from '@angular/core';
import { OnFailService } from "../../services/on-fail.service";
import { EntityList } from "../../services/entitylist.service";
import { ToastrService } from 'ngx-toastr';
import { ButtonRendererComponent } from "../../renderer/button-renderer.component";
import { IssueInventoryService } from "./issue-inventory.service";

declare var $: any;

@Component({
  selector: 'app-issue-inventory',
  templateUrl: './issue-inventory.component.html',
  styleUrls: ['./issue-inventory.component.css']
})
export class IssueInventoryComponent implements OnInit {

  gridApi;                                                                                                                                   
  gridColumnApi;

  frameworkComponents: any;

  columnDefs;
  defaultColDef;
  rowData: any[];
  issueQauntity : [1,2];

 cell_center = {
   "text-align": "center",
   color: "black",
   "font-weight": "2000"
 };

 constructor(
   private _toaster: ToastrService,
   private _emp_: IssueInventoryService,
   private _entityList_: EntityList, private _product_: IssueInventoryService , private _onFail_ : OnFailService) {
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
       headerName: "Employee",
       field: "inventory_ITEMID.brand_ID.brand_FULLNAME",
       headerClass: "resizable-header",
       cellStyle: this.cell_center
     },
     {
       headerName: "Item",
       field: "inventory_ITEMID.inventory_ITEMNAME",
       cellStyle: this.cell_center
     },
     
     {
      headerName: "Quantity",
      field: "stocklevel_QUANTITY",
      cellStyle: this.cell_center
    },
     
     {
      headerName: "Issue Date",
      field: "stocktake_DATE",
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
  this.item = {
    id: row.rowData.stocklevel_ID,
    quantity: row.rowData.stocklevel_QUANTITY,
    take_date: row.rowData.stocktake_DATE,
    item_id:  row.rowData.inventory_ITEMID.inventory_ITEMID,
    brand_id: row.rowData.inventory_ITEMID.brand_ID.brand_FULLNAME,
    isactive: status
  }  
  console.log('====================================');
  console.log(this.item);
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
   this.getAllEmp();
 }

 item: any = {
   item_id: null,
   brand_id:null,
   quantity: null,
   take_date: null
 };

 entityList = [];

 getAllEmp(){
   this._emp_.get().subscribe(res => {
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

 addIssueItem(item){
  if(item.description == null)
  {
    item.description = "";
  }
  var stockobject = {
    inventory_ITEMID: item.item_id,
    stocktake_DATE:item.take_date,
    stocklevel_QUANTITY:item.quantity
  }
  var brandobject = {
    brand_FULLNAME: item.brand_id,
    brand_SHORTNAME : "new brand"
  }
  console.log('====================================');
  console.log(stockobject);
  console.log('====================================');
  this._product_.add(stockobject).subscribe(res => {
    if (res)
    {
      $("#addModal").modal("hide");
      this.item = {
        item_id: null,
        quantity: null,
        take_date: null
      };   
      
    }
  } , error => {
      this._onFail_.onFail(error);
  })
  this._product_.addbrand(brandobject).subscribe(res => {
    if (res)
    {
      this._toaster.success("Addedd successfully");
      $("#addModal").modal("hide");
      this.item = {
        brand_id:null
      };   
      this.getAllEmp(); 
    }
  } , error => {
      this._onFail_.onFail(error);
  })
}

editIssueEmp(item){
  console.log('====================================');
  console.log(item);
  console.log('====================================');
  if (item.description == null) {
    item.description = "";
  }
  if(item.isactive == true)
  {
    item.isactive = "Y";
  }
  else
  {
    item.isactive = "N";
  }
  var object = {
    inventory_ITEMID:  item.item_id,
    stocktake_DATE : item.take_date,
    stocklevel_QUANTITY:item.quantity,
    
    isactive:item.isactive
  }
  
  console.log('====================================');
  console.log(object);
  console.log(item.id);
  console.log('====================================');
  this._emp_.update(object, item.id).subscribe(res => {
    if (res) {
      this._toaster.success("Addedd successfully");
      this.getAllEmp();
      $("#editModal").modal("hide");
      this.item = {
        item_id: null,
        quantity: null,
        take_date: null
      };
    }
  }, error => {
    this._onFail_.onFail(error);
  })
}


}
