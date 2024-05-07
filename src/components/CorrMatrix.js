import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { pearsonCorrelation } from "./utils";

const CorrMatrix = ({ data, onMatrixClick }) => {
    const d3Container = useRef(null);

    const calculateCorrelationMatrix = (data) => {
        const keys = Object.keys(data[0]).filter(
            (k) => typeof data[0][k] === "number"
        );
        const matrix = keys.map((yKey, i) => {
            return keys.map((xKey, j) => {
                return {
                    x: j,
                    y: i,
                    value: i === j ? 1 : pearsonCorrelation(data, xKey, yKey),
                };
            });
        });
        return { matrix, keys };
    };

    useEffect(() => {
        if (data && data.length > 0 && d3Container.current) {
            const { matrix, keys } = calculateCorrelationMatrix(data);

            const margin = { top: 10, right: 150, bottom: 15, left: 130 };
            const size = 200;
            const gridSize = Math.floor(size / keys.length);

            const svg = d3.select(d3Container.current)
                .attr("width", size + margin.left + margin.right)
                .attr("height", size + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const colorScale = d3.scaleSequential(d3.interpolatePlasma)
                .domain([0.5, 1]);

            svg.selectAll('.cell')
                .data(matrix.flat())
                .enter().append('rect')
                .attr('class', 'cell')
                .attr('width', gridSize)
                .attr('height', gridSize)
                .attr('x', d => d.x * gridSize)
                .attr('y', d => d.y * gridSize)
                .style('fill', d => colorScale(d.value))
        
                .on('click', (event, d) => {
                
                console.log("Click event on matrix cell with data:", { value: d.value, xKey: keys[d.x], yKey: keys[d.y] });
                onMatrixClick({ value: d.value, xKey: keys[d.x], yKey: keys[d.y] });
                });

  
                  
            svg.selectAll('.cell-text')
                .data(matrix.flat())
                .enter().append('text')
                .text(d => d3.format(".2f")(d.value))
                .attr('x', d => d.x * gridSize + gridSize / 2)
                .attr('y', d => d.y * gridSize + gridSize / 2)
                .style('text-anchor', 'middle')
                .style('alignment-baseline', 'central')
                .style('font-size', 10)
                .style('fill', d => Math.abs(d.value) > 0.7 ? 'black' : 'white')
                .on('click', d => onMatrixClick(d)); 

            // Color Legend
            const legendHeight = keys.length * gridSize;
            const legendWidth = 30;
            const legendX = gridSize * keys.length + 60;

            const defs = svg.append("defs");

            const linearGradient = defs.append("linearGradient")
                .attr("id", "linear-gradient")
                .attr('gradientTransform', 'rotate(90)');

            linearGradient.selectAll("stop")
                .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100 * i / n.length}%`, color: colorScale(t) })))
                .enter().append("stop")
                .attr("offset", d => d.offset)
                .attr("stop-color", d => d.color);

            svg.append("rect")
                .attr("width", legendWidth+10)
                .attr("height", legendHeight)
                .attr("x", legendX)
                .attr("y", 0)
                .style("fill", "url(#linear-gradient)");

            const legendScale = d3.scaleLinear()
                .domain([1, 0.5])
                .range([0, legendHeight]);

            const legendAxis = d3.axisRight(legendScale)
                .tickValues([0.5, 0.6, 0.7, 0.8, 0.9, 1])
                .tickSize(0)
                .tickPadding(15)
                .tickFormat(d3.format(".1f"));

            const legend = svg.append('g')
                .attr('class', 'legend axis')
                .attr('transform', `translate(${legendX + legendWidth}, 0)`)
                .call(legendAxis);

            legend.select('.domain').remove();

            svg.selectAll(".rowLabel")
                .data(keys)
                .enter()
                .append("text")
                .text(d => d)
                .attr("x", 0)
                .attr("y", (d, i) => i * gridSize)
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")")

            svg.selectAll(".colLabel")
                .data(keys)
                .enter()
                .append("text")
                .text(d => d)
                .attr('x', (d, i) => i * gridSize + gridSize / 2)
                .attr('y', size + margin.top)
                .style('text-anchor', 'middle');
        }
    }, [data, onMatrixClick]); 

    return (
            <svg className="corr-matrix" ref={d3Container} />
    );
};

export default CorrMatrix;