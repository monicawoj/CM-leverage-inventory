const scatterPlotWithErrorBars = (data,container) => {

  // if (error) {
  // 	console.log("error reading file");
  // }

  console.log(data);

  const colors = {
    tenthPercentile: 'grey',
    ninetiethPercentile: 'grey',
    avg: '#3366cc'
  };
  const xAxisLabels = ['Rarely','Occasionally','Often','Always'];

  var fullwidth = 600,
      fullheight = 600;

  // these are the margins around the graph. Axes labels go in margins.
  var margin = {top: 20, right: 30, bottom: 20, left: 150};

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

  // Define the div for the tooltip
  var tooltip = d3.select(container).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // data.sort(function(a, b) {
  // 	return d3.ascending(+a.indexFromSoftToHard, +b.indexFromSoftToHard);
  // });

  //sort by avg
  data.sort(function(a, b) {
  	return d3.descending(+a.avg, +b.avg);
  });

  widthScale.domain([1, 4]);

  heightScale.domain(data.map(function(d) { return d.factor; } ));

  // Make the faint lines from y labels to highest dot

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

  // Make the dotted lines between the dots

  var linesBetween = svg.selectAll("lines.between")
  	.data(data)
  	.enter()
  	.append("line");

  linesBetween.attr("class", "between")
  	.attr("x1", function(d) {
  		return margin.left + widthScale(+d.tenthPercentile);
  	})
  	.attr("y1", function(d) {
  		return heightScale(d.factor) + heightScale.rangeBand()/2;
  	})
  	.attr("x2", function(d) {
  		return margin.left + widthScale(d.ninetiethPercentile);
  	})
  	.attr("y2", function(d) {
  		return heightScale(d.factor) + heightScale.rangeBand()/2;
  	})
    .attr("stroke", "black")
  	.attr("stroke-dasharray", "5,5")
  	.attr("stroke-width", "0.5");


  // Make the dots for TenthPercentile

  var dotsTenthPercentile = svg.selectAll("circle.tenthPercentile")
  		.data(data)
  		.enter()
  		.append("circle");

  dotsTenthPercentile
  	.attr("class", "tenthPercentile")
  	.attr("cx", function(d) {
  		return margin.left + widthScale(+d.tenthPercentile);
  	})
  	.attr("r", heightScale.rangeBand()/4)
  	.attr("cy", function(d) {
  		return heightScale(d.factor) + heightScale.rangeBand()/2;
  	})
  	.style("fill", colors.tenthPercentile)
    .on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(`<strong>${d.factor}</strong>` + "<br/>"  + " 10th Percentile: " + d.tenthPercentile)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

    // svg.selectAll("circle.tenthPercentile")
    //     .append("text")
    //     .attr("class","circle-text")
    //     .attr("fill","black")
    //     .text(d => d.tenthPercentile);
    //

  // Make the dots for NinetiethPercentile

  var dotsNinetiethPercentile = svg.selectAll("circle.ninetiethPercentile")
  		.data(data)
  		.enter()
  		.append("circle");

  dotsNinetiethPercentile
  	.attr("class", "ninetiethPercentile")
  	.attr("cx", function(d) {
  		return margin.left + widthScale(+d.ninetiethPercentile);
  	})
  	.attr("r", heightScale.rangeBand()/4)
  	.attr("cy", function(d) {
  		return heightScale(d.factor) + heightScale.rangeBand()/2;
  	})
    .style("fill", colors.ninetiethPercentile)
    .on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(`<strong>${d.factor}</strong>` + "<br/>"  + " 90th Percentile: " + d.ninetiethPercentile)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

    // Make the dots for the average

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
      .style("fill", colors.avg)
      .on("mouseover", function(d) {
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html(`<strong>${d.factor}</strong>` + "<br/>"  + " Average: " + d.avg)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
          })
      .on("mouseout", function(d) {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      });

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
    .text("Leverage Inventory Factor");
    // .text("<- Harder Power | Softer Power ->");

};

export default scatterPlotWithErrorBars;
