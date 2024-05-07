import React, { Component } from "react";
import * as d3 from "d3";

class Child1 extends Component {
  componentDidUpdate() {
    const data = Array.isArray(this.props.data) ? this.props.data : [];
    
    if (data.length === 0) {
      console.warn("No data available for visualization.");
      return;
    }

    // Group data by category ('A', 'B', or 'C') and calculate averages
    const grouped = d3.groups(data, d => d.category);
    const averageData = grouped.map(([category, values]) => {
      const sum = d3.sum(values, d => d.y);
      const count = values.length;
      return {
        category,
        averageY: sum / count
      };
    });

    // Chart dimensions
    const margin = { top: 30, right: 30, bottom: 30, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Set scales for grouped data
    const x = d3.scaleBand()
      .domain(averageData.map(d => d.category)) // Categories as domains
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(averageData, d => d.averageY)])
      .range([height - margin.bottom, margin.top]);

    // Prepare the SVG element
    const svg = d3.select('.chart');
    svg.selectAll("*").remove();  // Clear old content

    // Create bars for each category
    svg.selectAll('.bar')
      .data(averageData)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.category))
      .attr('y', d => y(d.averageY))
      .attr('width', x.bandwidth())
      .attr('height', d => height - margin.bottom - y(d.averageY))
      .attr('fill', 'steelblue');

    // Append x-axis with category names
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    // Append y-axis for values
    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    // Add axis titles
    svg.append('text')
      .attr('class', 'x-axis-title')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .attr('text-anchor', 'middle')
      .text('Category');
    svg.append('text')
      .attr('class', 'y-axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .text('Average Y');
  }

  render() {
    return <svg className="chart" width="600" height="400"></svg>;
  }
}

export default Child1;
