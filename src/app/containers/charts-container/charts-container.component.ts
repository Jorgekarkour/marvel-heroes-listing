import { Component, effect, input, OnInit, signal } from '@angular/core';
import { BarChartComponent } from '@components/bar-chart/bar-chart.component';
import { PieChartComponent } from '@components/pie-chart/pie-chart.component';
import * as d3 from 'd3';

@Component({
  selector: 'app-charts-container',
  imports: [PieChartComponent, BarChartComponent],
  templateUrl: './charts-container.component.html',
})
export class ChartsContainerComponent<T> implements OnInit {
  data = input.required<T[]>();
  fieldToShow = input.required<string>();
  chartId = input.required<string>();

  processedData = signal<any>([]);

  constructor () {
    effect(() => {
      const newData = this.data();
      const field = this.fieldToShow();
      this.processedData.update((currentData) => this._processData(newData, field));
    })
  }


  ngOnInit(): void {
  }

  private _processData(data: any[], field: string): any[] {
    const counts = d3.rollups(
      data,
      (v) => v.length,
      (d) => d[field] 
    );
    return counts
    .map(([key, value]) => ({ key, count: value }))
    .sort((a, b) => b.count - a.count);
  }

}
