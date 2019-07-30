import { Component, OnInit } from '@angular/core';
import { OnFailService } from "../../services/on-fail.service";
import { EntityList } from "../../services/entitylist.service";
import { LookupService } from "../../services/lookup.service";
import { ToastrService } from 'ngx-toastr';
import { ButtonRendererComponent } from "../../renderer/button-renderer.component";
import { PurchaseOrderManagementService } from "./purchase-order-management.service";

declare var $: any;
@Component({
  selector: 'app-purchase-order-management',
  templateUrl: './purchase-order-management.component.html',
  styleUrls: ['./purchase-order-management.component.css']
})
export class PurchaseOrderManagementComponent implements OnInit {

  gridApi;
   gridColumnApi;

   frameworkComponents: any;

   columnDefs;
   defaultColDef;
   rowData: any[];
   supplierData: any [];

  cell_center = {
    "text-align": "center",
    color: "black",
    "font-weight": "2000"
  };

  constructor(
    private _toaster: ToastrService,
    private _PurchaseOrderManagementService_: PurchaseOrderManagementService,
    private _entityList_: EntityList, private _purchasemgt_: PurchaseOrderManagementService , private _onFail_ : OnFailService) {
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
        field: "purchaseorder_ID",
        headerClass: "resizable-header",
        cellStyle: this.cell_center
      },
      {
        headerName: "Item",
        field: "inventory_ITEMID.inventory_ITEMNAME",
        cellStyle: this.cell_center
      },
      {
        headerName: "Brand",
        field: "inventory_ITEMID.brand_ID.brand_SHORTNAME",
        cellStyle: this.cell_center
      },
      {
        headerName: "Quantity",
        field: "purchaseorder_QUANTITY",
        cellStyle: this.cell_center
      },
      {
        headerName: "Price",
        field: "purchaseorder_PRICE",
        cellStyle: this.cell_center
      },
      {
        headerName: "P-Status",
        field: "purchaseorder_PAYMENTSTATUS",
        cellStyle: this.cell_center
      },
      {
        headerName: "Supplier",
        field: "supplier_ID.supplier_NAME",
        cellStyle: this.cell_center
      },
      {
        headerName: "S-Contact",
        field: "supplier_ID.supplier_CONTACT",
        cellStyle: this.cell_center
      },
      {
        headerName: "S-Address",
        field: "supplier_ID.supplier_ADDRESS",
        cellStyle: this.cell_center
      },
      {
        headerName: "Order Date",
        field: "purchaseorder_DATE",
        cellStyle: this.cell_center
      },
      {
        headerName: "P-Date",
        field: "purchaseorder_PAYMENTDATE",
        cellStyle: this.cell_center
      },
      {
        headerName: "Description",
        field: "purchaseorder_DESCRIPTION",
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
    this.getAllPurchaseOrder();
  }

  purchase_order: any = {
    purchase_order_date : null,
    item_name : null,
    brand_id: null,
    quantity: null,
    price: null,
    payment_status: null,
    supplier_name: null,
    payment_date: null,
    description: null
  };

  entityList = [];

  getAllPurchaseOrder(){
    this._PurchaseOrderManagementService_.get().subscribe(res => {
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

  addPurchaseOrder(purchase_order){
    if(purchase_order.description == null)
    {
      purchase_order.description = "";
    }
    var inventory_iD = parseInt(purchase_order.item_name);
    var brand_iD = parseInt(purchase_order.brand_id);
    var supplier_iD = parseInt(purchase_order.supplier_name);

    var object = {
      purchaseorder_DATE:  purchase_order.purchase_order_date,
      inventory_ID : inventory_iD,
    
      purchaseorder_QUANTITY:purchase_order.quantity,
      purchaseorder_PRICE:purchase_order.price,
      purchaseorder_PAYMENTSTATUS:purchase_order.payment_status,
      supplier_ID:supplier_iD,
      
      purchaseorder_PAYMENTDATE:purchase_order.payment_date,
      purchaseorder_DESCRIPTION:purchase_order.description
    }
    console.log('====================================');
    console.log(object);
    console.log('====================================');
    this._purchasemgt_.add(object).
    subscribe(res => {
      if (res)
      {
        this._toaster.success("Addedd successfully");
        $("#addModal").modal("hide");
        this.purchase_order = {
          entitystatus: null,
          code: null,
          entity: null,
          description: null
        };   
        this.getAllPurchaseOrder(); 
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
    this.purchase_order = {
      id: row.rowData.purchaseorder_ID,
      item_name: row.rowData.inventory_ITEMID.inventory_ITEMID,
      quantity: row.rowData.purchaseorder_QUANTITY,
      price: row.rowData.purchaseorder_PRICE ,
      purchase_order_date: row.rowData.purchaseorder_DATE,
      payment_status: row.rowData.purchaseorder_PAYMENTSTATUS ,
      supplier_name: row.rowData.supplier_ID.supplier_ID ,
      payment_date: row.rowData.purchaseorder_PAYMENTDATE ,
      isactive: status,
      description: row.rowData.purchaseorder_DESCRIPTION


      
    }  
    console.log('====================================');
    console.log(this.purchase_order);
    console.log('====================================');
   }

   editPurchaseOrder(purchase_order){
    console.log('====================================');
    console.log(purchase_order);
    console.log('====================================');
    if (purchase_order.description == null) {
      purchase_order.description = "";
    }
    if(purchase_order.isactive == true)
    {
      purchase_order.isactive = "Y";
    }
    else
    {
      purchase_order.isactive = "N";
    }
    var inventory_iD = parseInt(purchase_order.item_name);
    var object = {
      purchaseorder_DATE:  purchase_order.purchase_order_date,
      inventory_ID : inventory_iD,
      purchaseorder_QUANTITY:purchase_order.quantity,
      purchaseorder_PRICE:purchase_order.price,
      purchaseorder_PAYMENTSTATUS:purchase_order.payment_status,
      supplier_ID:purchase_order.supplier_name,
      
      isactive:purchase_order.isactive,
      purchaseorder_PAYMENTDATE:purchase_order.payment_date,
      purchaseorder_DESCRIPTION:purchase_order.description
    }
    
    console.log('====================================');
    console.log(object);
    console.log(purchase_order.id);
    console.log('====================================');
    this._purchasemgt_.update(object, purchase_order.id).subscribe(res => {
      if (res) {
        this._toaster.success("Addedd successfully");
        this.getAllPurchaseOrder();
        $("#editModal").modal("hide");
        this.purchase_order = {
          purchase_order_date : null,
          item_name : null,
          brand_id: null,
          quantity: null,
          price: null,
          payment_status: null,
          supplier_name: null,
          payment_date: null,
          description: null
        };
      }
    }, error => {
      this._onFail_.onFail(error);
    })
  }


  onChangeItem(item_id : number){
          
    this._purchasemgt_.getSupplierFromPurchaseOrder(item_id).subscribe(
      res => {
        if(res)
        {
          console.log('====================================');
          console.log(res);
          this.supplierData = res;
          
            this.supplierData = Array.of(this.supplierData);
          console.log('====================================');
        }
      } , error => {
        console.error(error);
        this._onFail_.onFail(error);
      })


  }

}
