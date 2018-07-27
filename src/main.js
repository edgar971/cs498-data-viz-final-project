import * as d3 from 'd3'
import { fuelTypeColors } from './colors'

const appStoreDatasetUrl = require('./data/appstore.csv')
let appStoreData

document.addEventListener('DOMContentLoaded', () => {
  d3.csv(appStoreDatasetUrl, (data) => {
    appStoreData = data
    const overviewData = createOverviewData(data)
    createOverviewTable(overviewData)
  })
})


function createOverviewTable(data) {
  const headers = {
    category: 'Category',
    total: 'Number of Apps',
    total_reviews: 'Number of Reviews',
    user_rating: 'User Rating Average'
  }
  const table = d3.select('.overview')
    .attr('width', '100%')

  const thead = table.append('thead')
  const tbody = table.append('tbody')

  thead.append('tr')
    .selectAll('th')
    .data(Object.values(headers)).enter()
    .append('th')
    .text((header) => header)

  const rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr')

  rows.selectAll('td')
    .data((row) => {
      return Object.keys(headers)
        .map(header => ({ column: header, value: row[header] }))
    })
    .enter()
    .append('td')
    .text(d => d.column === 'total_reviews' ? d.value.toLocaleString() : d.value)
}

function createOverviewData(data) {
  let overviewData = Object.values(data.reduce((overview, i) => {
    if (!!overview[i.prime_genre]) {
      const { total, total_reviews, user_rating } = overview[i.prime_genre]
      overview[i.prime_genre] = {
        ...overview[i.prime_genre],
        total_reviews: total_reviews + parseInt(i.rating_count_tot),
        user_rating: (user_rating + parseFloat(i.user_rating)),
        total: total + 1,
      }
    } else {
      overview[i.prime_genre] = {
        category: i.prime_genre,
        total_reviews: parseInt(i.rating_count_tot),
        user_rating: parseFloat(i.user_rating),
        total: 1
      }
    }
    return overview
  }, {}))

  overviewData = overviewData.map(i => ({
    ...i,
    user_rating: Math.round((i.user_rating / i.total) * 100) / 100
  }))

  return overviewData
}

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