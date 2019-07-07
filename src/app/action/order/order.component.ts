import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { RestserviceService } from '../restservice.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'actions'];
  orders: PeriodicElement[];
  dataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public rest: RestserviceService) {

  }

  ngOnInit() {
    this.getOrderData();
  }

  getOrderData() {
    this.rest.getOrders().subscribe((result) => {
      console.log(result);
      const newData = _.map(result.data, (order) => {
        return {
          id: order._id,
          name: order.customer[0].name,
          email: order.customer[0].email,
          phone: order.customer[0].telno
        };
      });
      this.orders = newData;
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.orders);
      this.dataSource.paginator = this.paginator;
    });
  }

}
export interface PeriodicElement {
  name: any;
  id: any;
  email: any;
  phone: any;
}
