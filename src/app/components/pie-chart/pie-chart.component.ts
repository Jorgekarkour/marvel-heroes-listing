import { Component, effect, input, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie-chart',
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent<T> implements OnInit {

  data = input.required<T[]>();

  private svg: any;
  private margin = 30;
  private width = 150;
  private height = 100;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;

  constructor () {
    effect(() => this.drawChart(this.data()));
  }

  private createSvg(): void {
    this.svg = d3.select("figure#pie")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr(
      "transform",
      "translate(" + this.width / 2 + "," + this.height / 2 + ")"
    );
}

private processData(data: any[]): any[] {
  const counts = d3.rollups(
    data,
    (v) => v.length,
    (d) => d.gender
  )
  return counts.map(([key, value]) => ({gender: key, count: value}))
}

private drawChart(data: any[]): void {
  const processedData = this.processData(data);

  // Crear color para cada segmento
  const color = d3
    .scaleOrdinal()
    .domain(processedData.map((d) => d.gender))
    .range(d3.schemeCategory10);

  // Crear el gráfico de pastel
  const pie = d3.pie<any>().value((d: any) => d.count);

  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(this.radius);

  // Unir los datos y dibujar el gráfico
  const path = this.svg.selectAll('path').data(pie(processedData));

  // Actualizar los segmentos existentes
  path
    .enter()
    .append('path')
    .merge(path as any)
    .transition()
    .duration(1000)
    .attr('d', arc)
    .attr('fill', (d: any) => color(d.data.gender))
    .attr('stroke', '#121926')
    .style('stroke-width', '1px');

  path.exit().remove();

  // Añadir etiquetas
  const label = d3
    .arc()
    .innerRadius(100)
    .outerRadius(this.radius);

  const text = this.svg.selectAll('text').data(pie(processedData));

  text
    .enter()
    .append('text')
    .merge(text as any)
    .transition()
    .duration(1000)
    .text((d: any) => `${d.data.gender} (${d.data.count})`)
    .attr('transform', (d: any) => `translate(${label.centroid(d)})`)
    .style('text-anchor', 'middle')
    .style('font-size', '15px');

  text.exit().remove();
}

ngOnInit(): void {
  this.createSvg();
  this.drawChart(this.data());
}

}
