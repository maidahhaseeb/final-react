import React, { Component } from "react";
import * as d3 from "d3";

class Child2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: 'A'
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ selectedCategory: event.target.value });
  }

  componentDidUpdate() {
    const data = Array.isArray(this.props.data) ? this.props.data : [];

    if (data.length === 0) {
      console.warn("No data available for visualization.");
      return;
    }

    const filteredData = data.filter(d => d.category === this.state.selectedCategory);

    // Chart dimensions
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Set scales for x and y axes
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d.x)])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d.y)])
      .range([height - margin.bottom, margin.top]);

    // Prepare the SVG element
    const svg = d3.select('.scatter-plot');
    svg.selectAll("*").remove(); // Clear old content

    // Draw circles for data points
    svg.selectAll('circle')
      .data(filteredData)
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 5)
      .attr('fill', 'steelblue')
      .append('title')
      .text(d => `x: ${d.x}, y: ${d.y}`);

    // Append x-axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    // Append y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    // Add axis titles
    svg.append('text')
      .attr('class', 'x-axis-title')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .attr('text-anchor', 'middle')
      .text('X');

    svg.append('text')
      .attr('class', 'y-axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .text('Y');
  }

  render() {
    return (
      <div className="scatter-plot-container">
        <select value={this.state.selectedCategory} onChange={this.handleChange}>
          <option value="A">Category A</option>
          <option value="B">Category B</option>
          <option value="C">Category C</option>
        </select>
        <svg className="scatter-plot" width="600" height="400"></svg>
      </div>
    );
  }
}

export default Child2;
