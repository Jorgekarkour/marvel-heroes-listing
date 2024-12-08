import { Component, effect, input, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent<T> implements OnInit {

  data = input.required<T[]>();

  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  constructor() {
    effect(()=> {
      this.drawBars(this.data());
    })
  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private processData(data: any[]): any[] {
    const counts = d3.rollups(
      data,
      (v) => v.length,
      (d) => d.gender
    )
    return counts.map(([key, value]) => ({gender: key, count: value}))
  }
  
  private drawBars(data: any[]): void {
    const processedData = this.processData(data);
    this.svg.selectAll('*').remove();
    // Create the X-axis band scale
    const x = d3.scaleBand()
    .range([0, this.width])
    .domain(processedData.map(d => d.gender))
    .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
    .domain([0, d3.max(processedData, (d) => d.count || 0)])
    .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
    .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll("bars")
    .data(processedData)
    .enter()
    .append("rect")
    .attr("x", (d: any) => x(d.gender))
    .attr("y", (d: any) => y(d.count))
    .attr("width", x.bandwidth())
    .attr("height", (d: any) => this.height - y(d.count))
    .attr("fill", "#d04a35");
  }

ngOnInit(): void {
  this.createSvg();
  this.drawBars(this.data());
}


}
