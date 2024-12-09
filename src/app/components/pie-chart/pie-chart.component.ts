import { AfterViewInit, Component, effect, input } from '@angular/core';
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
  private margin = 5;
  private width = 165;
  private height = 165;
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
    this._createSvg();
    this.drawChart(this.data(), this.fieldToShow());
  }

  private _createSvg(): void {
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
  }

  private updateColorScale(keys: string[]): void {
    const currentDomain = this.colorScale.domain();
    const updatedDomain = Array.from(new Set([...currentDomain, ...keys]));
    this.colorScale.domain(updatedDomain);
  }

  private drawChart(data: any[], field: string): void {
    const uniqueKeys = data.map((d) => d.key);
    this.updateColorScale(uniqueKeys);

    const pie = d3.pie<any>().value((d: any) => d.count);

    const arc = d3.arc().innerRadius(0).outerRadius(this.radius);

    this.svg.selectAll('*').remove();

    // Crear el tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('id', 'tooltip')
      .style('position', 'absolute')
      .style('background', '#fff')
      .style('border', '1px solid #ccc')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('font-size', '12px')
      .style('display', 'none');

    // Dibujar los segmentos del gráfico
    this.svg
      .selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => this.colorScale(d.data.key))
      .attr('stroke', '#121926')
      .style('stroke-width', '1px')
      .on('mouseover', (event: any, d: { data: { key: any; count: any; }; }) => {
        tooltip
          .style('display', 'block')
          .html(`<strong>${d.data.key}:</strong> ${d.data.count}`);
      })
      .on('mousemove', (event: { pageX: number; pageY: number; }) => {
        tooltip
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY + 10 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      });

    // Añadir etiquetas
    const label = d3.arc().innerRadius(20).outerRadius(this.radius);

    this.svg
      .selectAll('text')
      .data(pie(data))
      .enter()
      .append('text')
      .text((d: any) => `${d.data.key} (${d.data.count})`)
      .attr('transform', (d: any) => `translate(${label.centroid(d)})`)
      .style('display', 'none')
      .style('font-size', '12px');
  }
}
