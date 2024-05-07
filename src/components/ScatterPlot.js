import React, { Component } from 'react';
import * as d3 from 'd3';

class ScatterPlot extends Component {
  constructor(props) {
    super(props);
    this.d3Container = React.createRef();
    this.margin = { top: 40, right: 30, bottom: 50, left: 60 };
    this.width = 950 - this.margin.left - this.margin.right;
    this.height = 350 - this.margin.top - this.margin.bottom;
  }

  componentDidMount() {
    this.drawScatterPlot();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.drawScatterPlot();
    }
  }

  drawScatterPlot() {
    const { data, xKey, yKey } = this.props.data || {};

    console.log("Data:", data);
    console.log("xKey:", xKey);
    console.log("yKey:", yKey);
    if (!data || !xKey || !yKey){
    console.log("Missing data or keys. Unable to draw scatter plot."); 
    return; // Make sure data and keys are present.
    }
    // Clear the previous SVG contents
    const svg = d3.select(this.d3Container.current);
    svg.selectAll("*").remove();

    // Set up scales and axes based on xKey and yKey
    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d[xKey]))
      .range([0, this.width]);
    
    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d[yKey]))
      .range([this.height, 0]);

    const g = svg.append("g").attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    
    // Background for scatter plot
    g.append("rect")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("fill", "#F0F0F0");  
    
    g.append("g")
      .attr("transform", `translate(0,${this.height})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("fill", "#000")
      .attr("x", this.width / 2)
      .attr("y", this.margin.bottom - 10) 
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .text(xKey); // X-axis label

    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", -this.margin.left + 20) 
      .attr("x", -this.height / 2)
      .attr("dy", "0.71em")
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .text(yKey); // Y-axis label

    // Plot the data as points
    g.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d[xKey]))
      .attr("cy", d => y(d[yKey]))
      .attr("r", 3)
      .style("fill", "gray");
  }

  render() {
    return (
      <svg width="1000" height="350" ref={this.d3Container}
      style={{ border: "0.25px solid #D3D3D3" }}></svg>
    );
  }
}

export default ScatterPlot;