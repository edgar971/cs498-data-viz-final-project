import * as d3 from 'd3'

const arrowUrl = require('../images/sort-arrows-couple-pointing-up-and-down.png')
const upArrowUrl = require('../images/sort-up-arrow.png')
const downArrowUrl = require('../images/sort-down-arrow.png')

export function createOverviewTable(data) {
  const sortIndicatorImageClass = 'sort-indicator'
  const headers = {
    category: 'Category',
    total: 'Number of Apps',
    total_reviews: 'Number of Reviews',
    user_rating: 'User Rating Average',
    price: 'Price(USD) Average'
  }
  const table = d3.select('.overview')
    .attr('width', '100%')

  const thead = table.append('thead')
  const tbody = table.append('tbody')
  let currentSortKey = null

  thead.append('tr')
    .selectAll('th')
    .data(Object.entries(headers)).enter()
    .append('th')
    .append('div')
    .on('click', (header) => {
      const key = header[0]
      let sortedData = data.sort((a, b) => {
        if (a[key] < b[key])
          return -1
        if (a[key] > b[key])
          return 1
        return 0
      })

      d3.selectAll(`th img.${sortIndicatorImageClass}`)
        .attr('src', arrowUrl)

      if (!currentSortKey || currentSortKey !== key) {
        currentSortKey = key
        d3.select(`th img.${key}`)
          .attr('src', upArrowUrl)
      } else if (currentSortKey === key) {
        currentSortKey = null
        sortedData = sortedData.reverse()
        d3.select(`th img.${key}`)
          .attr('src', downArrowUrl)
      }
      tbody.selectAll('tr').remove()
      renderOverviewBody(tbody, sortedData, Object.keys(headers))
    })
    .text((header) => header[1])
    .append('img')
    .attr('src', arrowUrl)
    .attr('class', (h) => `${h[0]} ${sortIndicatorImageClass}`)

  renderOverviewBody(tbody, data, Object.keys(headers))
}

function renderOverviewBody(tbody, data, headers = []) {
  const rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr')

  rows.selectAll('td')
    .data((row) => {
      return headers
        .map(header => ({ column: header, value: row[header] }))
    })
    .enter()
    .append('td')
    .text(d => d.column === 'total_reviews' ? d.value.toLocaleString() : d.value)
}

export function createOverviewData(data) {
  let overviewData = Object.values(data.reduce((overview, i) => {
    if (!!overview[i.prime_genre]) {
      const { total, total_reviews, user_rating, price } = overview[i.prime_genre]
      overview[i.prime_genre] = {
        ...overview[i.prime_genre],
        total_reviews: total_reviews + parseInt(i.rating_count_tot),
        user_rating: (user_rating + parseFloat(i.user_rating)),
        price: (price + parseFloat(i.price)),
        total: total + 1,
      }
    } else {
      overview[i.prime_genre] = {
        category: i.prime_genre,
        total_reviews: parseInt(i.rating_count_tot),
        user_rating: parseFloat(i.user_rating),
        price: parseFloat(i.price),
        total: 1
      }
    }

    return overview
  }, {}))

  overviewData = overviewData.map(i => ({
    ...i,
    user_rating: Math.round((i.user_rating / i.total) * 100) / 100,
    price: Math.round((i.price / i.total) * 100) / 100
  }))

  return overviewData
}
