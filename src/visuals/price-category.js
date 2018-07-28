import * as d3 from 'd3'

export function createAppCategoriesChart(data) {
  data = stringToNumber(data)
  const xMax = Math.max(...data.map(d => d.price_avg))
  const yMax = Math.max(...data.map(d => d.rating_avg))
  const margin = { top: 10, right: 10, bottom: 30, left: 40 }
  const width = 960 - margin.left - margin.right
  const height = 500 - margin.top - margin.bottom

  const xScale = d3.scaleLinear()
    .domain([0, xMax])
    .range([0, width])

  const yScale = d3.scaleLinear()
    .domain([0, yMax])
    .range([height, 0])

  const color = d3.scaleOrdinal(d3.schemeCategory10)
  const xAxis = d3.axisBottom(xScale).tickFormat((d) => d)

  const yAxis = d3.axisLeft(yScale)

  const svg = d3.select('.app-categories')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width - 10)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Average App Price")

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Average Number of Ratings")

  svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 4)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("cx", (d) => xScale(d.price_avg))
    .attr("cy", (d) => yScale(d.rating_avg))
    .style("fill", (d) => color(d.category))

  const legend = svg.append('g')
    .attr("class", "legend-wrapper")
    .selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => "translate(0," + i * 17 + ")")

  legend.append("rect")
    .attr("x", width - 15)
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", color)

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".25em")
    .style("text-anchor", "end")
    .text((d) => d)
}

function stringToNumber(data) {
  return data.map((d) => ({
    ...d,
    price_avg: roundTwoDecimals(d.price_avg),
    rating_avg: roundTwoDecimals(d.rating_avg)
  }))
}

function roundTwoDecimals(number) {
  return Math.round((parseFloat(number)) * 100) / 100
} 