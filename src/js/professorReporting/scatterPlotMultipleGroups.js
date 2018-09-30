const scatterPlotMultipleGroups = (fullData, groupId, groupData,container) => {

  // if (error) {
  // 	console.log("error reading file");
  // }

  const data = groupData.data;
  const groupName = groupData.name;

  const colors = ["#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];

  const xAxisLabels = ['Rarely','Occasionally','Often','Always'];

  var fullwidth = 600,
      fullheight = 600;

  var margin = {top: 50, right: 30, bottom: 20, left: 150};

  var width = fullwidth - margin.left - margin.right,
    height = fullheight - margin.top - margin.bottom;

  var widthScale = d3.scale.linear()
            .range([ 0, width]);

  var heightScale = d3.scale.ordinal()
            .rangeRoundBands([ margin.top, height], 0.2);

  var xAxis = d3.svg.axis()
          .scale(widthScale)
          .ticks(4)
          .tickFormat((d,i) => xAxisLabels[i])
          .orient("bottom");

  var yAxis = d3.svg.axis()
          .scale(heightScale)
          .orient("left")
          .innerTickSize([0]);

  var svg = d3.select(container)
        .append("svg")
        .attr("width", fullwidth)
        .attr("height", fullheight);

  var tooltip = d3.select(container).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  var legend = d3.select('.group-results-chart-2 .legend-holder');

  //sort by avg
  data.sort(function(a, b) {
  	return d3.descending(+a.avg, +b.avg);
  });

  widthScale.domain([1, 4]);

  heightScale.domain(data.map(function(d) { return d.factor; } ));

  var linesGrid = svg.selectAll("lines.grid")
  	.data(data)
  	.enter()
  	.append("line");

  linesGrid.attr("class", "grid")
  	.attr("x1", margin.left)
  	.attr("y1", function(d) {
  		return heightScale(d.factor) + heightScale.rangeBand()/2;
  	})
  	.attr("x2", function(d) {
  		return margin.left + widthScale(4);

  	})
  	.attr("y2", function(d) {
  		return heightScale(d.factor) + heightScale.rangeBand()/2;
  	})
    .attr("stroke", "#eee");

  // Make the dots for the target group
  createTargetGroupDots(groupData,'#3366cc');
  createLegendEntry(groupData,'#3366cc');

  // Make the dots for each group
  const groupKeys = Object.keys(fullData);
  const otherGroupKeys = groupKeys.filter(item => item !== groupId.toString());
  otherGroupKeys.forEach((key,i) => {
    createDots(fullData[key],colors[i])
    createLegendEntry(fullData[key],colors[i])
  });

  function createLegendEntry(groupData,color) {
    const legendRow = legend.append('div')
      .attr('class','legend-row');
    legendRow.append('div')
      .attr('class','legend-block')
      .style("background-color", color);
    legendRow.append('p')
      .attr('class','legend-label')
      .text(groupData.name);
  }

  function createTargetGroupDots(groupData,color) {
    let data = groupData.data;
    let groupName = groupData.name;

    var dotsAvg = svg.selectAll("circle.avg")
    		.data(data)
    		.enter()
    		.append("circle");

    dotsAvg
    	.attr("class", "average")
    	.attr("cx", function(d) {
    		return margin.left + widthScale(+d.avg);
    	})
    	.attr("r", heightScale.rangeBand()/3)
    	.attr("cy", function(d) {
    		return heightScale(d.factor) + heightScale.rangeBand()/2;
    	})
      .style("fill", color)
      .on("mouseover", function(d) {
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html(`<strong>${groupName}</strong>` + "<br/>"  + `${d.factor}:` + d.avg)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
          })
      .on("mouseout", function(d) {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      });
  }

  function createDots(groupData,color) {

    const data = groupData.data;
    const groupName = groupData.name;

    const dots = svg.selectAll(`circle.${groupName}`)
    		.data(data)
    		.enter()
    		.append("circle");

    dots
    	.attr("class", `${groupName}`)
    	.attr("cx", function(d) {
    		return margin.left + widthScale(+d.avg);
    	})
    	.attr("r", heightScale.rangeBand()/4)
    	.attr("cy", function(d) {
    		return heightScale(d.factor) + heightScale.rangeBand()/2;
    	})
      .style("fill", `${color}`)
      .on("mouseover", function(d) {
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(`<strong>${groupName}</strong><br/>${d.factor}: ${d.avg}`)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
          })
      .on("mouseout", function(d) {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      });
  }

  // add the axes
  svg.append("g")
  	.attr("class", "x axis")
  	.attr("transform", "translate(" + margin.left + "," + height + ")")
  	.call(xAxis);

  svg.append("g")
  	.attr("class", "y axis")
  	.attr("transform", "translate(" + margin.left + ",0)")
  	.call(yAxis);

  svg.append("text")
  	.attr("class", "label")
  	.attr("transform", "translate(" + (margin.left + width / 2) + " ," +
  				(height + margin.bottom) + ")")
  	.style("text-anchor", "middle")
  	.attr("dy", "1em")
  	.text("Frequency of Behavior");

  svg.append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 + margin.left/4)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Leverage Inventory Tactic");

  svg.append("text")
    .attr("class", "title")
    .attr("transform", `translate(${margin.left + width / 2},0)`)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(`${groupName} vs. Other Groups`);

};

export default scatterPlotMultipleGroups;
