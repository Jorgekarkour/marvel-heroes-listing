import { Component, effect, input, OnInit, output, signal, viewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FilterComponent } from '@components/filter/filter.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SpaceBeforeCapsPipe } from 'src/app/pipes/space-before-caps.pipe';
import { CommonModule } from '@angular/common';
import { GridAction } from '@models/gridAction.model';
import { ChartsContainerComponent } from 'src/app/containers/charts-container/charts-container.component';

const MATERIAL_MODULES = [MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatButtonModule]

@Component({
  selector: 'app-grid',
  imports: [FilterComponent, SpaceBeforeCapsPipe, ChartsContainerComponent, CommonModule, MATERIAL_MODULES],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent<T> implements OnInit {
  data = input.required<T[]>();
  displayedColumns = input.required<string[]>();
  filterColumn = input<string>();
  sortableColumns = input<string[]>([]);
  onActionEvent = output<GridAction>();
  enableAnalitics = input<boolean>(true);

  dataSource = new MatTableDataSource<T>();
  valueToFilter = signal([]);
  private readonly _sort = viewChild.required<MatSort>(MatSort);
  private readonly _paginator = viewChild.required<MatPaginator>(MatPaginator);

  constructor () {
    effect(() => {
      this.applyFilter(this.valueToFilter());
    })

    effect(() => {
      this.dataSource.data = this.data();
    })
  }

  ngOnInit(): void {
    this.dataSource.sort = this._sort();
    this.dataSource.paginator = this._paginator();
    if (this.filterColumn()) {
      this.dataSource.filterPredicate = (data: T, filter: string) => {
        const filterValues = JSON.parse(filter) as string[];
        if (!filterValues || filterValues.length === 0 || !this.filterColumn) return true;
        // Only filter on the specific column
        return filterValues.some((value) =>
          String(data[this.filterColumn() as keyof T]).toLowerCase().includes(value.toLowerCase())
        );
      };
    }
  }
  
  applyFilter(filterValues: string[]): void {
    this.dataSource.filter = JSON.stringify(filterValues); // Trigger the filterPredicate
  }

  handleRowClick(row: any, column: string): void {
    if (column === 'action') {
      return; // No hacer nada si la columna es 'action'
    }
    this.onAction(row, 'showInfo');
  }

  onAction(element: any, selectedAction: string): void {
    const actionEmitted: GridAction = {data: element, action: selectedAction};
    this.onActionEvent.emit(actionEmitted);
  }

}
