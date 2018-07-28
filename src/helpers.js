import * as d3 from 'd3'

export function fetchCsvData(fileUrl) {
  return new Promise((resolve) => {
    d3.csv(fileUrl, (data) => resolve(data))
  })
}