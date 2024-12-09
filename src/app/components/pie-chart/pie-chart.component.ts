import {
  AfterViewInit,
  Component,
  effect,
  input,
} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent<T> implements AfterViewInit {
  data = input.required<T[]>();
  fieldToShow = input.required<string>();
  chartId = input.required<string>(); 

  private svg: any;
  private margin = 10;
  private width = 110;
  private height = 90;

  private radius = Math.min(this.width, this.height) / 2 - this.margin;

  private colorScale: d3.ScaleOrdinal<string, string>;

  constructor() {
    this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    effect(() => {
      if (this.data() && this.svg) {
        this.drawChart(this.data(), this.fieldToShow());
      }
    });
  }

  ngAfterViewInit(): void {
    this.createSvg();
    this.drawChart(this.data(), this.fieldToShow());
  }

  private async createSvg(): Promise<void> {
    this.svg = d3
      .select(`#${this.chartId()}`)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
    console.log(`Creating SVG for chartId: ${this.chartId()}`);
  }

  private processData(data: any[], field: string): any[] {
    const counts = d3.rollups(
      data,
      (v) => v.length,
      (d) => d[field]
    );
    return counts.map(([key, value]) => ({ key, count: value }));
  }

  private updateColorScale(keys: string[]): void {
    const currentDomain = this.colorScale.domain();
    const updatedDomain = Array.from(new Set([...currentDomain, ...keys]));

    this.colorScale.domain(updatedDomain);
  }

  private drawChart(data: any[], field: string): void {
    const processedData = this.processData(data, field);

    const uniqueKeys = processedData.map((d) => d.key);
    this.updateColorScale(uniqueKeys);

    const pie = d3.pie<any>().value((d: any) => d.count);

    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(this.radius);

    this.svg.selectAll('*').remove();

    this.svg
      .selectAll('path')
      .data(pie(processedData))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => this.colorScale(d.data.key))
      .attr('stroke', '#121926')
      .style('stroke-width', '1px');

    const label = d3
      .arc()
      .innerRadius(20)
      .outerRadius(this.radius);

    this.svg
      .selectAll('text')
      .data(pie(processedData))
      .enter()
      .append('text')
      .text((d: any) => `${d.data.key} (${d.data.count})`)
      .attr('transform', (d: any) => `translate(${label.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px');
  }
}
