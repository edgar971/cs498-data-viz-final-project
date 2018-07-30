import * as d3 from 'd3'

const vWidth = 960
const vHeight = 550

const colorFills = [
  '#2177b4',
  '#1d6ba2',
  '#344653',
  '#4e697d',
  '#50859f',
  '#567d9d'
]

export function drawAgeRatingChart(data) {
  const formatted = d3.stratify()(data)
  const g = d3.select('.app-rating')
    .attr('width', vWidth)
    .attr('height', vHeight)

  const vLayout = d3.treemap()
    .size([vWidth, vHeight])
    .paddingOuter(5)

  const vRoot = d3
    .hierarchy(formatted)
    .sum((d) => d.data.size)

  const vNodes = vRoot.descendants()
  vLayout(vRoot)

  const vSlices = g.selectAll('g')
    .data(vNodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('fill', (_, i) => colorFills[i])

  vSlices.append('rect')
  vSlices.append('text').attr('class', 'age')
  vSlices.append('text').attr('class', 'rating')

  vSlices.selectAll('.node rect')
    .attr('x', (d) => d.x0)
    .attr('y', (d) => d.y0)
    .attr('width', (d) => d.x1 - d.x0)
    .attr('height', (d) => d.y1 - d.y0)
    .attr('class', (d) => !d.children ? 'child-map' : '')

  vSlices.selectAll('.node text.age')
    .text((d) => !d.children ? `Age Rating: ${d.data.data.id}` : '')
    .attr("y", "1.5em")
    .attr("x", "0.5em")
    .attr("font-size", "0.6em")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "15px")
    .attr("transform", (d) => "translate(" + [d.x0, d.y0] + ")")

  vSlices.selectAll('.node text.rating')
    .text((d) => !d.children ? `Rating Avg: ${Math.round(d.data.data.size * 100) / 100}` : '')
    .attr("y", "2.6em")
    .attr("x", "0.5em")
    .attr("font-size", "0.6em")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "15px")
    .attr("transform", (d) => "translate(" + [d.x0, d.y0] + ")")
}