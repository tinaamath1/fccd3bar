
let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
let req = new XMLHttpRequest();

let data 
let value = []

let yScale
let xScale
let yAxisScale
let xAxisScale

let width = 1000
let height = 600
let padding = 50 

let svg = d3.select('svg')

let drawCanvas= () => {
    d3.select('svg')
    .attr('width', width)
    .attr('height', height)
}

let drawScale = () => {
    yScale = d3.scaleLinear() // Creating scale for bar height
                .domain([0,d3.max(value , (item) => {
                    return item[1]
                })])
                .range([0,height-(2*padding)])

    xScale = d3.scaleLinear() // Creating scale for horizontally placing bars
                .domain([0,value.length-1])
                .range([padding, width-padding]) // what x coordinate the bar takes


    // Creating scale for x axis of dates            
    let dateArray = value.map((item) => {  
        return new Date(item[0])
    })

    xAxisScale = d3.scaleTime()
                    .domain([d3.min(dateArray), d3.max(dateArray)])
                    .range([padding, width-padding])

    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(value, (item) => {
                        return item[1]
                    })])
                    .range([height-padding,padding])
}

let drawBar = () => {

    let tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('visibility', 'hidden')
    .style('width', 'auto')
    .style('height', 'auto')

    


    svg.selectAll('rect')
        .data(value)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - (2 * padding)) / value.length)
        .attr("data-date", (item) => {
            return item[0]
        })
        .attr("data-gdp", (item) => {
            return item[1]
        })
        .attr('height', (item) => {
            return yScale(item[1])
        })
        .attr('x', (item,index) => {
            return xScale(index)
        })
        .attr('y', (item) => {
            return (height-padding) - yScale(item[1])
        })

        .on('mouseover', (item) => {
            tooltip.transition()
                .style('visibility', 'visible')

            tooltip.text(item[0])

            document.querySelector('#tooltip').setAttribute('data-date', item[0])
            // document.querySelector('#tooltip').setAttribute('data-date', item[1])
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })     
    

}

let drawAxis = () => {

    let xAxis = d3.axisBottom(xAxisScale)

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + (height - padding) + ')')

    let yAxis = d3.axisLeft(yAxisScale)

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate('+ padding + ',0)')
}

req.open('GET',url,true)
req.onload = () => {
    data= JSON.parse(req.responseText)
    value = data.data
    console.log(value)
    drawCanvas()
    drawScale()
    drawBar()
    drawAxis()
}
req.send();