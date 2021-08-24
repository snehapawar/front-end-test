import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationPopupComponent} from "../confirmation-popup/confirmation-popup.component";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements AfterViewInit, OnInit {
  constructor(public dialog: MatDialog, private httpClient: HttpClient) {
  }

  user: PeriodicElement[] = [];
  displayedColumns: string[] = ['select', 'name', 'email', 'gender', 'address', 'dob', 'menu'];
  dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  ngOnInit(): void {
    this.httpClient.get("assets/user.json").subscribe(data => {
      console.log(data);
      // @ts-ignore
      this.user = data['user'];
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.user);
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }

  openDialog() {
    this.dialog.open(ConfirmationPopupComponent, {
      data: {
        action: 'edit'
      },
      width: '550px'
    });
  }

  onDelete(element: PeriodicElement) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      data: {
        action: 'delete'
      },
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user.splice(this.user.findIndex(u => u.id === element.id), 1);
        this.dataSource = new MatTableDataSource<PeriodicElement>(this.user);
      }
    });
  }
}

export interface PeriodicElement {
  id: number;
  name: string;
  email: string;
  gender: string;
  address: string;
  dob: string;
}
