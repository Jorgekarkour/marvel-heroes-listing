import { AfterViewInit, Component, effect, input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent<T> implements AfterViewInit {
  data = input.required<T[]>();
  fieldToShow = input.required<string>();
  chartId = input.required<string>();

  private svg: any;
  private margin = 5
  private width = 275;
  private height = 140;

  constructor() {
    effect(() => {
      if (this.data() && this.svg) {
        this.drawBars(this.data(), this.fieldToShow());
      }
    });
  }

  ngAfterViewInit(): void {
    this.createSvg();
    this.drawBars(this.data(), this.fieldToShow());
  }

  private createSvg(): void {
    this.svg = d3
      .select(`#${this.chartId()}`)
      .append('svg')
      .attr('width', this.width + this.margin)
      .attr('height', this.height + this.margin)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin / 2 + ',' + this.margin / 2 + ')'
      );
  }


  private drawBars(data: any[], field: string): void {

    this.svg.selectAll('*').remove();

    // Crear la escala para el eje X
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map((d) => d.key))
      .padding(0.2);

    // Crear la escala para el eje Y
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count || 0)])
      .range([this.height, 0]);

    // Dibujar el eje X
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll('text')
      .style('display', 'none');

    // Dibujar el eje Y
    this.svg
      .append('g')
      .call(d3.axisLeft(y).ticks(0))
      .style('display', 'none');

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

    // Crear las barras
    this.svg
      .selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d: any) => x(d.key) || 0)
      .attr('y', (d: any) => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => this.height - y(d.count))
      .attr('fill', '#4285F4')
      .on('mouseover', (event: any, d: { key: any; count: any; }) => {
        tooltip
          .style('display', 'block')
          .html(`<strong>${d.key}:</strong> ${d.count}`);
      })
      .on('mousemove', (event: { pageX: number; pageY: number; }) => {
        tooltip
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY + 10 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      });
  }
}
