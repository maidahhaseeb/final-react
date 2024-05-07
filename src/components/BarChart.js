import React, { Component } from "react";
import * as d3 from "d3";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = { radioValue: 'sex' };
  }

  componentDidUpdate() {
    var selectedDropdown = this.props.data1.dropDownValue;
    var data = this.props.data1.data;
    var selectedRadio = this.state.radioValue

    const dailyData = {};
    for (let i = 0; i < data.length; i++) {
      if (!dailyData[data[i][selectedRadio]]) {
        dailyData[data[i][selectedRadio]] = { day: data[i][selectedRadio], value: 0, count: 0 };
      }
      dailyData[data[i][selectedRadio]].value += data[i][selectedDropdown];
      dailyData[data[i][selectedRadio]].count++;
    }
    const averageData = Object.values(dailyData).map(d => ({
      ...d,
      average_bill: d.value / d.count
    }));



    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(averageData.map(d => d.day))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(averageData, d => d.average_bill)])
      .range([height - margin.bottom, margin.top]);

    const svg = d3.select('.chart');
    svg.selectAll('.bar').remove();
    svg.selectAll('g').remove();
    svg.selectAll('.bar-label').remove();
    svg.selectAll('text').remove();
    svg.selectAll('.x-axis').selectAll('*').remove();
    svg.selectAll('.y-axis').selectAll('*').remove();
    svg.selectAll('.bar')
    .data(averageData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.day))
    .attr('y', d => y(d.average_bill))
    .attr('width', x.bandwidth())
    .attr('height', d => height - margin.bottom - y(d.average_bill))
    .attr('fill', 'lightgrey');
  
  svg.selectAll('.bar-label')
    .data(averageData)
    .enter()
    .append('text')
    .attr('class', 'bar-label')
    .attr('x', d => x(d.day) + x.bandwidth() / 2)
    .attr('y', d => y(d.average_bill) + 20)
    .attr('text-anchor', 'middle')
    .style('fill', 'black')
    .text(d => d.average_bill.toFixed(2));
  
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x));
      
    const yAxis = d3.axisLeft(y).ticks(5);

    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y))
      .call(yAxis);
    svg.append('text')
      .attr('class', 'y-axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height/1.5)
      .attr('y', margin.left - 35)
      .text(selectedDropdown + ' (average)');
      svg.append('text')
      .attr('class', 'x-axis-title')
      .attr('x', width / 2)
      .attr('y', height - margin.bottom + 35)
      .attr('text-anchor', 'middle')
      .text(selectedRadio);

    svg.selectAll('.x-axis .domain')
      .remove();
    svg.selectAll('.y-axis .domain')
      .remove();

  }

  render() {
    return (
      <div>
      <div className="radioController" onChange={(event) => this.setState({ radioValue: event.target.value })}>
        <input type="radio" value="sex" name="tips" defaultChecked /> sex
        <input type="radio" value="smoker" name="tips" /> smoker
        <input type="radio" value="day" name="tips" /> day
        <input type="radio" value="time" name="tips" /> time
      </div>
      <svg className="chart" width="600" height="400">
        </svg>
      </div>
    );
  }
}
export default BarChart