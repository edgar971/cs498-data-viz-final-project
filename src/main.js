import * as d3 from 'd3'
import { fuelTypeColors } from './colors'
import { createOverviewData, createOverviewTable } from './visuals/overview'

const appStoreDatasetUrl = require('./data/appstore.csv')

let appStoreData

document.addEventListener('DOMContentLoaded', () => {
  d3.csv(appStoreDatasetUrl, (data) => {
    appStoreData = data
    createOverviewTable(createOverviewData(data))
  })
})

function createMPGbyModelChart(data) {
  const barHeight = 23
  const chartWidth = 950
  const chartXOffset = 300

  const dataValues = data.map((d) => d['Avg. City08'])

  const chartX = d3.scaleLinear()
    .domain([0, d3.max(dataValues)])
    .range([0, chartWidth]);

  const chart = d3.select('.mpgByModel')
    .attr('width', chartWidth)
    .attr('height', barHeight * data.length)

  const bar = chart.selectAll('g')
    .data(data)
    .enter().append('g')
    .attr('transform', (d, i) => `translate(0,${i * barHeight})`)

  bar.append('line')
    .attr('x1', '0')
    .attr('x2', chartXOffset)
    .attr('y1', '1')
    .attr('y2', '1')
    .attr('stroke', 'black')

  bar.append('rect')
    .attr('width', (item) => item['Avg. City08'] * 10)
    .attr('height', barHeight - 4)
    .attr('x', (d) => chartXOffset)
    .attr('fill', (d) => fuelTypeColors[d['Fuel Type']])

  bar.append('text')
    .attr('x', (d) => d['Avg. City08'] * 10 + 5 + chartXOffset)
    .attr('y', barHeight / 2)
    .attr('dy', '.3em')
    .text((d) => Math.round(d['Avg. City08'] * 100) / 100)

  bar.append('text')
    .attr('x', (d) => 5)
    .attr('y', barHeight / 2)
    .attr('dy', '.3em')
    .text((d) => `${d.Make} ${d.Model}`)
}