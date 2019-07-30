
import { Component, OnInit } from '@angular/core';
import { OnFailService } from "../../services/on-fail.service";
import { EntityList } from "../../services/entitylist.service";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { ButtonRendererComponent } from "../../renderer/button-renderer.component";
import { InventoryManagementService } from "./inventory-management.service";

declare var $: any;

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css']
})
export class InventoryManagementComponent implements OnInit {
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
   private _InventoryManagementService_: InventoryManagementService,
   private _entityList_: EntityList, private _inventory_: InventoryManagementService ,private _router_:Router,
   private _stock_: InventoryManagementService , private _onFail_ : OnFailService) {
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
       headerName: "ID",
       field: "inventory_ITEMID.inventory_ITEMID",
       headerClass: "resizable-header",
       cellStyle: this.cell_center
     },
     {
      headerName: "I-Category",
      field: "inventory_ITEMID.category_ID.category_TYPE",
      cellStyle: this.cell_center
    },
     {
       headerName: "I-Name",
       field: "inventory_ITEMID.inventory_ITEMNAME",
       cellStyle: this.cell_center
     },
     {
      headerName: "I-Brand",
      field: "inventory_ITEMID.brand_ID.brand_SHORTNAME",
      cellStyle: this.cell_center
    },
     {
       headerName: "Add Date",
       field: "stocktake_DATE",
       cellStyle: this.cell_center
     },
     {
       headerName: "Available Quantity",
       field: "stocklevel_QUANTITY",
       cellStyle: this.cell_center
     },
     
     {
       headerName: "Description",
       field: "inventory_ITEMID.inventory_ITEMDESC",
       cellStyle: this.cell_center
     },
     {
       headerName: "isActive",
       field: "isactive",
       cellStyle: this.cell_center
     }
   ];
   this.defaultColDef = { resizable: true };
   this.frameworkComponents = { buttonRenderer: ButtonRendererComponent };
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
   this.getAllInventoryOrder();
 }

 inventory: any = {
  category_id : null,
  item_name : null,
  brand_id: null,
  description: null,

//For Stock
  quantity: null,
  take_date: null,
  inventory_id: null
};


 entityList = [];

 getAllInventoryOrder(){
   this._InventoryManagementService_.get().subscribe(res => {
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


 addInventory(inventory){
  if(inventory.description == null)
  {
    inventory.description = "";
  }
  var category_iD = parseInt(inventory.category_id);
  var brand_iD = parseInt(inventory .brand_id);
  var inventoryobject = {
    category_ID : category_iD,
    brand_ID : brand_iD,
    inventory_ITEMNAME: inventory.item_name,
    inventory_ITEMDESC:inventory.description
   
  }
  var inventory_iD = parseInt(this.inventory.inventory_id);
  var stockobject = {
    
    inventory_ITEMID : inventory_iD,
    stocktake_DATE: inventory.take_date,
    stocklevel_QUANTITY:inventory.quantity
   
  }
  console.log('====================================');
  console.log(inventoryobject);
  console.log('====================================');
  console.log(stockobject);
  console.log('====================================');
  this._inventory_.addinventory(inventoryobject).
  subscribe(res => {
    if (res)
    {
      this._toaster.success("Addedd successfully");
      $("#addModal").modal("hide");
      this.inventory = {
        category_id : null,
        item_name : null,
        brand_id: null,
        description: null
      };   
      this.getAllInventoryOrder(); 
    }
  } , error => {
      this._onFail_.onFail(error);
  })

  this._inventory_.addstock(stockobject).
  subscribe(res => {
    if (res)
    {
      this._toaster.success("Addedd successfully");
      $("#addModal").modal("hide");
      this.inventory = {
      
        Quantity: null,
        add_date: null,
        inventory_id: null
      };   
      this.getAllInventoryOrder(); 
    }
  } , error => {
      this._onFail_.onFail(error);
  })
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
  this.inventory = {
    
    category_id: row.rowData.inventory_ITEMID.category_ID.category_ID,
    item_name: row.rowData.inventory_ITEMID.inventory_ITEMNAME,
    brand_id: row.rowData.inventory_ITEMID.brand_ID.brand_ID,
    description: row.rowData.inventory_ITEMID.inventory_ITEMDESC,
    id_inventory: row.rowData.inventory_ITEMID.inventory_ITEMID,

    //for stock 
    id_stock: row.rowData.stocklevel_ID, 
    take_date: row.rowData.stocktake_DATE,
    quantity: row.rowData.stocklevel_QUANTITY,
    inventory_id: row.rowData.inventory_ITEMID.inventory_ITEMID,

    isactive: status,


    
  }  
  console.log('====================================');
  console.log(this.inventory);
  console.log('====================================');
 }

 editInventory(inventory){
  console.log('====================================');
  console.log(inventory);
  console.log('====================================');
  if (inventory.description == null) {
    inventory.description = "";
  }
  if(inventory.isactive == true)
  {
    inventory.isactive = "Y";
  }
  else
  {
    inventory.isactive = "N";
  }
  var stockobject = {
    stocklevel_ID : inventory.id_stock,
    stocktake_DATE : inventory.take_date,
    stocklevel_QUANTITY: inventory.quantity,
    inventory_ID:inventory.inventory_id,

    isactive:inventory.isactive
  }
  var inventoryobject = {
    inventory_ID : inventory.id_inventory,
    category_ID : inventory.category_id,
    brand_ID: inventory.brand_id,
    inventory_ITEMNAME:inventory.item_name,
    inventory_ITEMDESC: inventory.description
  }
  
  console.log('====================================');
  console.log(stockobject);
  console.log(inventoryobject);
  console.log('====================================');
  this._inventory_.updatestock(stockobject, inventory.id_stock).subscribe(res => {
    if (res) {
      this._toaster.success("Addedd successfully");
      this.getAllInventoryOrder();
      $("#editModal").modal("hide");
      this.inventory = {
        Quantity: null,
        add_date: null,
        inventory_id: null
      };
    }
  }, error => {
    this._onFail_.onFail(error);
  })
  this._inventory_.updateinventory(inventoryobject, inventory.id_inventory).subscribe(res => {
    if (res) {
      this._toaster.success("Addedd successfully");
      this.getAllInventoryOrder();
      $("#editModal").modal("hide");
      this.inventory = {
        Quantity: null,
        add_date: null,
        inventory_id: null
      };
    }
  }, error => {
    this._onFail_.onFail(error);
  })
}


}
