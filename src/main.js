import * as d3 from 'd3'
import { fuelTypeColors } from './colors'
import { createOverviewData, createOverviewTable } from './visuals/overview'
import { fetchCsvData } from './helpers';
import { createAppCategoriesChart } from './visuals/price-category';

const appStoreDatasetUrl = require('./data/appstore.csv')
const priceCategoryDataUrl = require('./data/price-rating-categories.csv')

document.addEventListener('DOMContentLoaded', async () => {
  const appStoreData = await fetchCsvData(appStoreDatasetUrl)
  const priceCategoryData = await fetchCsvData(priceCategoryDataUrl)
  createOverviewTable(createOverviewData(appStoreData))
  createAppCategoriesChart(priceCategoryData)
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