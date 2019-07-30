
import { Component, OnInit } from '@angular/core';
import { OnFailService } from "../../services/on-fail.service";
import { EntityList } from "../../services/entitylist.service";
import { LookupService } from "../../services/lookup.service";
import { ToastrService } from 'ngx-toastr';
import { ButtonRendererComponent } from "../../renderer/button-renderer.component";
import { OrderManagementService } from "./order-management.service";

declare var $: any;

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})

export class OrderManagementComponent implements OnInit {

   gridApi;
   gridColumnApi;

   frameworkComponents: any;

   columnDefs;
   defaultColDef;
   rowData: any[];


  cell_center = {
    "text-align": "center",
    color: "black",
    "font-weight": "3000"
  };

  constructor(
    private _toaster: ToastrService,
    private _OrderManagementService_: OrderManagementService,
    private _entityList_: EntityList, private _ordermgt_: OrderManagementService , private _onFail_ : OnFailService) {
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
        headerName: "Order ID",
        field: "customerorder_ID",
        headerClass: "resizable-header",
        cellStyle: this.cell_center
      },
      {
        headerName: "Order Date",
        field: "customerorder_DATE",
        cellStyle: this.cell_center
      },
      {
        headerName: "Customer Name",
        field: "customer_ID.customer_NAME",
        cellStyle: this.cell_center
      },
      {
        headerName: "Product Name",
        field: "product_ID.product_NAME",// null Error 
        cellStyle: this.cell_center
      },
      {
        headerName: "Product Quantity",
        field: "customerorder_QUANTITY",
        cellStyle: this.cell_center
      },
      {
        headerName: "Price Each",
        field: "customerorder_PRICEEACH",
        cellStyle: this.cell_center
      },
      {
        headerName: "Product Deliver Date",
        field: "customerorder_DELIEVEREDDATE",
        cellStyle: this.cell_center
      },
      {
        headerName: "Product Description",
        field: "customerorder_DESCRIPTION",
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
    this.getAllCustomerOrder();
  }

  customer_order: any = {
    customer_id : null,
    product_id : null,
    customer_product_qauntity: null,
    customer_product_price: null,
    customer_order_date: null,
    product_deliver_date: null,
    description: null
  };

  entityList = [];


  getAllCustomerOrder(){
    this._OrderManagementService_.get().subscribe(res => {
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

  addCustomerOrder(customer_order){
    if(customer_order.description == null)
    {
      customer_order.description = "";
    }
    var customer_iD = parseInt(customer_order.customer_id);
    var product_iD = parseInt(customer_order.product_id);
    var object = {
      customer_ID : customer_iD,
      product_ID : product_iD,
      customerorder_QUANTITY: customer_order.customer_product_qauntity,
      customerorder_PRICEEACH:customer_order.customer_product_price,
      customerorder_DATE:customer_order.customer_order_date,

      customerorder_DELIEVEREDDATE:customer_order.product_deliver_date,

      customerorder_DESCRIPTION:customer_order.description
    }
    console.log('====================================');
    console.log(object);
    console.log('====================================');
    this._ordermgt_.add(object).
    subscribe(res => {
      if (res)
      {
        this._toaster.success("Addedd successfully");
        $("#addModal").modal("hide");
        this.customer_order = {
          entitystatus: null,
          code: null,
          entity: null,
          description: null
        };   
        this.getAllCustomerOrder(); 
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
    this.customer_order = {
      id: row.rowData.customerorder_ID,
      customer_id: row.rowData.customer_ID.customer_ID,
      product_selected: row.rowData.product_ID.product_ID,
      product_id: row.rowData.product_ID.product_ID,
      customer_product_qauntity: row.rowData.customerorder_QUANTITY ,
      customer_product_price: row.rowData.customerorder_PRICEEACH ,
      customer_order_date: row.rowData.customerorder_DATE ,
      product_deliver_date: row.rowData.customerorder_DELIEVEREDDATE ,
      isactive: status,
      description: row.rowData.customerorder_DESCRIPTION

      
    }  
    console.log('====================================');
    console.log(this.customer_order);
    console.log('====================================');
   }

   editCustomerOrder(customer_order){
    console.log('====================================');
    console.log(customer_order);
    console.log('====================================');
    if (customer_order.description == null) {
      customer_order.description = "";
    }
    if(customer_order.isactive == true)
    {
      customer_order.isactive = "Y";
    }
    else
    {
      customer_order.isactive = "N";
    }
    var object = {
      customer_ID : customer_order.customer_id,
      product_ID : customer_order.product_id,
      customerorder_QUANTITY: customer_order.customer_product_qauntity,
      customerorder_PRICEEACH:customer_order.customer_product_price,
      customerorder_DATE:customer_order.customer_order_date,

      customerorder_DELIEVEREDDATE:customer_order.product_deliver_date,

      customerorder_DESCRIPTION:customer_order.description,
      isactive:customer_order.isactive
    }
    
    console.log('====================================');
    console.log(object);
    console.log(customer_order.id);
    console.log('====================================');
    this._ordermgt_.update(object, customer_order.id).subscribe(res => {
      if (res) {
        this._toaster.success("Addedd successfully");
        this.getAllCustomerOrder();
        $("#editModal").modal("hide");
        this.customer_order = {
          customer_id : null,
    product_id : null,
    customer_product_qauntity: null,
    customer_product_price: null,
    customer_order_date: null,
    product_deliver_date: null,
    description: null
        };
      }
    }, error => {
      this._onFail_.onFail(error);
    })
  }
  
  
}