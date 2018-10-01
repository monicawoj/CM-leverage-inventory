//dev
// const userId = '4260ccb2-60fe-46ba-8122-7ccd233cbf2d';
// const url = "https://leverage-inventory-dev.wharton-research-programming.org/backend/results/";
// const finalUrl = `${url}?id=${userId}`;

//production
// const userId = getCookie('resultsid');
// const url = "https://leverage-inventory.wharton-research-programming.org/backend/results/";
// const finalUrl = `${url}?id=${userId}`;

const finalUrl = 'https://app.leverageinventory.com/backend/results/?id=4260ccb2-60fe-46ba-8122-7ccd233cbf2d';

d3.json(finalUrl, function(error, data) {
    console.log(data);
    if (error) {
        return console.warn(error);
    }

    const chartHolderSelf = d3.select('.chart-holder-self');
    const chartHolderThird = d3.select('.chart-holder-third');
    const chartHolderPercentileSelf = d3.select('.self .chart-holder-percentile');
    const chartHolderPercentileThird = d3.select('.third .chart-holder-percentile');

    const self_title = chartHolderSelf
      .append('h3')
      .attr('class','chart-title')
      .text('Self-Assessment');

    const third_title = chartHolderThird
      .append('h3')
      .attr('class','chart-title')
      .text('360 Assessment');

    chartHolderSelf
      .append('div')
      .attr('class','chart')
      .attr('id','chart1abs');

    chartHolderThird
      .append('div')
      .attr('class','chart')
      .attr('id','chart2abs');

    chartHolderPercentileSelf
      .append('div')
      .attr('class','chart hidden')
      .attr('id','chart1perc');

    chartHolderPercentileThird
      .append('div')
      .attr('class','chart hidden')
      .attr('id','chart2perc');

    //create options to compare against different subgroups based on the groups that the user belongs to
    const groupData = data.groups;
    const groupOptionHolders = d3.select('.options')
        .selectAll('.radio')
        .data(groupData)
        .enter()
        .append('div')
        .attr('class','radio');

    groupOptionHolders.append('input')
        .attr('type', 'radio')
        .attr('id', function(d) { return d })
        .attr('name', 'comparison-group');

    groupOptionHolders.append('label')
        .attr('for',function(d) { return d })
        .text(function(d) {return d.toUpperCase()});

    let group = groupData[0];
    d3.select(`input#${group}`)
        .property('checked',true);

    //create initial charts
    //const hasEnough360Ratings = data.hasEnough360Ratings;
    const hasEnough360Ratings = 1;
    const chartData = getStudentData(data,'Absolute',group);
    const self_data = chartData[0];
    const third_data = chartData[1];
    const sorted_self_data = chartData[2];
    const sorted_third_data = chartData[3];
    constructCharts(self_data,third_data,hasEnough360Ratings);
    createSortedChart(sorted_self_data,"chart sorted","chart-holder-self");

    //if hasEnough360Ratings, create sorted chart for 360 ratings
    if (hasEnough360Ratings) {
      createSortedChart(sorted_third_data,"chart sorted","chart-holder-third");
    }
    else {
      d3.select('.chart-holder-self')
        .style('display','flex');
      d3.select('.chart-holder-self svg')
        .style('margin-right','30px');
    }

    //display open-ended question responses if has meets threshold 360 responses
    if (hasEnough360Ratings) {

        d3.select('.open-ended-response-container h3').innerText = "Additional thoughts from your 360 Raters";

        const freeResponseQuestions = [
            "Ut a non magna, eget vestibulum ultrices interdum?",
        ];

        freeResponseQuestions.forEach((question,i) => {
            let list = document.createElement('ul');
            let title = document.createElement('h4');
            title.innerText = question;
            list.classList.add(`open-ended-q${i+1}`);

            d3.selectAll('.open-ended-responses').append(() => {
                return title;
            });

            d3.selectAll('.open-ended-responses').append(() => {
                return list;
            });
        });

        for (i=1; i<=freeResponseQuestions.length; i++) {
            let question = `openEndedQ${i}`;
            let questionResponses = data[question];
            let questionClass = `.open-ended-q${i}`;
            if (questionResponses) {
              d3.select('.open-ended-responses').classed('hidden',false);
              questionResponses.forEach((response) => {
                  let listItem = document.createElement('li');
                  listItem.innerText = response;
                  listItem.classList.add(`open-ended-response`);
                  d3.selectAll(questionClass).append(() => {
                      return listItem;
                  });
              });
            } else {
              d3.select('.open-ended-responses').classed('hidden',true);
            }
        }
    }

    //update charts when absolute/percentile toggle changes
    document.querySelectorAll(".type-toggle button").forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            document.querySelectorAll(".type-toggle button").forEach(button => {
                button.classList.remove('button-clicked');
            });
            this.classList.add('button-clicked');
            update(data,this.innerText,getValue("comparison-group",hasEnough360Ratings));
            if (this.innerText === 'Percentile') {
                type='Percentile';
                removeSortedChart('chart-holder-self');
                removeSortedChart('chart-holder-third');
                document.querySelector(".percentile-options").classList.remove('hidden');
            } else {
                type='Absolute';
                group=groupData[0];
                showSortedChart('chart-holder-self');
                showSortedChart('chart-holder-third');
                document.querySelector(".percentile-options").classList.add('hidden');
            }
        });
    });

    //update charts when percentile comparison group changes
    document.getElementsByName("comparison-group").forEach(element => {
        element.addEventListener("click", function(event) {
            group = this.value;
            update(data,"Percentile",getValue("comparison-group",hasEnough360Ratings));
        });
    });

});

function getValue(group) {
    let result = 'null';
    document.getElementsByName(group).forEach(element => {
        if (element.checked) {
            result = element.id;
        }
    });
    return result;
}

function update(data,type,group,hasEnough360Ratings) {
    const chartData = getStudentData(data,type,group);
    const self_data = chartData[0];
    const third_data = chartData[1];
    if (type==='Absolute') {
        constructCharts(self_data,third_data,hasEnough360Ratings);
    } else {
        constructPercentileCharts(self_data,third_data,hasEnough360Ratings);
    }
}

function getStudentData(data,type,group) {
    if (type==='Absolute') {
        const self_data = [
            {
                "data": {
                    "Networks": data.Network1-1,
                    "Team-building": data.Team1-1,
                    "Exchange": data.Exchange1-1,
                    "Allocentrism": data.Allocentrism1-1,
                    "Sit. Awareness": data.SA1-1,
                    "Agency": data.Agency1-1,
                    "Intentionality": data.Intentionality1-1,
                    "Logos": data.Logos1-1,
                    "Might": data.Might1-1,
                    "Ethos": data.Ethos1-1,
                    "Coalitions": data.Coalition1-1,
                    "Pathos": data.Pathos1-1,
                }
            }
        ];
        const third_data = [
            {
                "data": {
                    "Networks": data.Network3-1,
                    "Team-building": data.Team3-1,
                    "Exchange": data.Exchange3-1,
                    "Allocentrism": data.Allocentrism3-1,
                    "Sit. Awareness": data.SA3-1,
                    "Agency": data.Agency3-1,
                    "Intentionality": data.Intentionality3-1,
                    "Logos": data.Logos3-1,
                    "Might": data.Might3-1,
                    "Ethos": data.Ethos3-1,
                    "Coalitions": data.Coalition3-1,
                    "Pathos": data.Pathos3-1,
                }
            }
        ];
        const sorted_self_data_temp = sortProperties(self_data[0].data);
        const sorted_self_data = sorted_self_data_temp.map(function(item) {
          return {"name":item[0], "value": item[1], "definition": matchDefinition(item[0])}
        });
        const sorted_third_data_temp=sortProperties(third_data[0].data);
        const sorted_third_data = sorted_third_data_temp.map(function(item) {
          return {"name":item[0], "value": item[1]}
        });
        console.log(third_data);
        return [self_data, third_data, sorted_self_data, sorted_third_data];
    } else {
        const self_data = [
            {
                "data": {
                    "Networks": data["group_avgs"][group].Network1,
                    "Team-building": data["group_avgs"][group].Team1,
                    "Exchange": data["group_avgs"][group].Exchange1,
                    "Allocentrism": data["group_avgs"][group].Allocentrism1,
                    "Sit. Awareness": data["group_avgs"][group].SA1,
                    "Agency": data["group_avgs"][group].Agency1,
                    "Intentionality": data["group_avgs"][group].Intentionality1,
                    "Logos": data["group_avgs"][group].Logos1,
                    "Might": data["group_avgs"][group].Might1,
                    "Ethos": data["group_avgs"][group].Ethos1,
                    "Coalitions": data["group_avgs"][group].Coalition1,
                    "Pathos": data["group_avgs"][group].Pathos1,
                }
            }
        ];
        const third_data = [
            {
                "data": {
                    "Networks": data["group_avgs"][group].Network3,
                    "Team-building": data["group_avgs"][group].Team3,
                    "Exchange": data["group_avgs"][group].Exchange3,
                    "Allocentrism": data["group_avgs"][group].Allocentrism3,
                    "Sit. Awareness": data["group_avgs"][group].SA3,
                    "Agency": data["group_avgs"][group].Agency3,
                    "Intentionality": data["group_avgs"][group].Intentionality3,
                    "Logos": data["group_avgs"][group].Logos3,
                    "Might": data["group_avgs"][group].Might3,
                    "Ethos": data["group_avgs"][group].Ethos3,
                    "Coalitions": data["group_avgs"][group].Coalition3,
                    "Pathos": data["group_avgs"][group].Pathos3,
                },
                "Submissions": data["group_avgs"][group].Submissions
            }
        ];
        const sorted_self_data_temp=sortProperties(self_data[0].data);
        const sorted_self_data = sorted_self_data_temp.map(function(item) {
          return {"name":item[0], "value": item[1]}
        });
        const sorted_third_data_temp=sortProperties(third_data[0].data);
        const sorted_third_data = sorted_third_data_temp.map(function(item) {
          return {"name":item[0], "value": item[1]}
        });
        console.log(third_data);
        return [self_data, third_data, sorted_self_data, sorted_third_data];
    }
}

function radialBarChart(centerAxisLabels=false) {
    // Configurable variables
    var margin = {top: 20, right: 20, bottom: 20, left: 20};
    var barHeight = 100;
    var reverseLayerOrder = false;
    var barColors = undefined;
    var capitalizeLabels = false;
    var domain = undefined;
    var tickValues = undefined;
    var tickFormat = undefined;
    var colorLabels = false;
    var tickCircleValues = [];
    var transitionDuration = 1000;

    // Scales & other useful things
    var numBars = null;
    var barScale = null;
    var keys = null;
    var labelRadius = 0;

    function init(d) {
        barScale = d3.scale.sqrt().domain(domain).range([0, barHeight]);

        keys = d3.map(d[0].data).keys();
        numBars = keys.length;

        // Radius of the key labels
        labelRadius = barHeight * 0.95;
    }

    function svgRotate(a) {
        return 'rotate('+ +a +')';
    }

    function svgTranslate(x, y) {
        return 'translate('+ +x +','+ +y +')';
    }

    function initChart(container) {
        var g = d3.select(container)
            .append('svg')
            .style('width', 2 * barHeight + margin.left + margin.right + 'px')
            .style('height', 2 * barHeight + margin.top + margin.bottom + 'px')
            .append('g')
            .classed('radial-barchart', true)
            .attr('transform', svgTranslate(margin.left + barHeight, margin.top + barHeight));

        // Concentric circles at specified tick values
        g.append('g')
            .classed('tick-circles', true)
            .selectAll('circle')
            .data(tickCircleValues)
            .enter()
            .append('circle')
            .attr('r', function(d) {return barScale(d);})
            .style('stroke', 'grey')
            .style('stroke-dasharray', '2,2')
            .style('stroke-width','0.5px')
            .style('fill', 'none');
    }

    function renderOverlays(container,centerAxisLabels) {
        var g = d3.select(container).select('svg g.radial-barchart');

        // Spokes
        g.append('g')
            .classed('spokes', true)
            .selectAll('line')
            .data(keys)
            .enter()
            .append('line')
            .attr('y2', -barHeight)
            .attr('transform', function(d, i) {return svgRotate(i * 360 / numBars);});

        // Axis
        var axisScale = d3.scale.sqrt().domain(domain).range([0, -barHeight]);

        var axis = d3.svg.axis().orient('top').scale(axisScale).orient('right');
        if(tickValues && tickFormat) {
            axis.tickValues(tickValues).tickFormat(tickFormat);
        } else if (tickValues) {
            axis.tickValues(tickValues);
        }

        g.append('g')
            .classed('axis', true)
            .call(axis)
          .selectAll('text')
            .attr("y", function(d) {
              return d==0 || d==1 || d==2 || d==3 ? -5 : 0
            })
            .attr("x", function(d) {
              return d==0 || d==1 || d==2 || d==3 ? 0 : 7
            })
            .style("text-anchor", function(d) {
              return d==0 || d==1 || d==2 || d==3 ? "middle" : "start"
            });

        // Outer circle
        g.append('circle')
            .attr('r', barHeight)
            .classed('outer', true)
            .style("stroke", "grey")
            .style("stroke-width","1px")
            .style('fill', 'none');

        // Labels
        var labels = g.append('g')
            .classed('labels', true);

        labels.append('def')
            .append('path')
            .attr('id', 'label-path')
            .attr('d', 'm0 ' + -labelRadius + ' a' + labelRadius + ' ' + labelRadius + ' 0 1,1 -0.01 0');

        labels.selectAll('text')
            .data(keys)
            .enter()
            .append('text')
            .style('text-anchor', 'middle')
            .style('fill', function(d, i) {return colorLabels ? barColors[i % barColors.length] : null;})
            .append('textPath')
            .attr("class","textpath")
            .attr('xlink:href', '#label-path')
            .attr('startOffset', function(d, i) {return i * 100 / numBars + 50 / numBars + '%';})
            .text(function(d) {return capitalizeLabels ? d.toUpperCase() : d;});

    }

    function chart(selection) {
        selection.each(function(d) {

            init(d);

            if(reverseLayerOrder)
                d.reverse();

            var g = d3.select(this).select('svg g.radial-barchart');

            // check whether chart has already been created
            var update = g[0][0] !== null; // true if data is being updated

            if(!update)
                initChart(this);

            g = d3.select(this).select('svg g.radial-barchart');


            // Layer enter/exit/update
            var layers = g.selectAll('g.layer')
                .data(d);

            layers
                .enter()
                .append('g')
                .attr('class', function(d, i) {
                    return 'layer-' + i;
                })
                .classed('layer', true);

            layers.exit().remove();

            // Prep the tooltip bits, initial display is hidden
            var tooltip = g.append("g")
                .attr("class", "tooltip")
                .style("display", "none");

            tooltip.append("rect")
                .attr("width", 30)
                .attr("height", 20)
                .attr("fill", "white")
                .style("opacity", 0.5);

            tooltip.append("text")
                .attr("x", 15)
                .attr("dy", "1.2em")
                .style("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("font-weight", "bold");

            // Segment enter/exit/update
            var segments = layers
                .selectAll('path')
                .data(function(d) {
                    var m = d3.map(d.data);
                    return m.values();
                });

            /* Format to two decimals */
            const formatTwoDecimals = d3.format(".2f");
            const formatZeroDecimals = (x) => d3.format(".0f")(x*100);

            segments
                .enter()
                .append('path')
                .classed('bar', true)
                .attr('id', (d,i) => `bar-${d}`)
                .on("mouseover", function(d) {
                    d3.selectAll('.bar').style('opacity',0.5);
                    d3.select(event.target).style('opacity','1');
                    tooltip.style("display", null);
                })
                .on("mouseout", function() {
                    d3.selectAll('.bar').style('opacity','1');
                    d3.select('.tooltip').style('display','none');
                    tooltip.style("display", "none");
                })
                .on("mousemove", function(d) {
                    var xPosition = d3.mouse(this)[0] - 15;
                    var yPosition = d3.mouse(this)[1] - 25;
                    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                    tooltip
                        .select("text")
                        .text(function() {
                            if (domain[1] === 3) {
                                return formatTwoDecimals(d+1);
                            } else {
                                return formatTwoDecimals(d);
                            }
                        });
                })
                .style('fill', function(d, i) {
                    if(!barColors) return;
                    return barColors[i % barColors.length];
                });

            segments.exit().remove();

            segments
                .transition()
                .duration(transitionDuration)
                .attr('d', d3.svg.arc().innerRadius(0).outerRadius(or).startAngle(sa).endAngle(ea));

            if(!update)
                renderOverlays(this);

        });

    }

    /* Arc functions */
    or = function(d, i) {
        return barScale(d);
    }
    sa = function(d, i) {
        return (i * 2 * Math.PI) / numBars;
    }
    ea = function(d, i) {
        return ((i + 1) * 2 * Math.PI) / numBars;
    }

    /* Configuration getters/setters */
    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.barHeight = function(_) {
        if (!arguments.length) return barHeight;
        barHeight = _;
        return chart;
    };

    chart.reverseLayerOrder = function(_) {
        if (!arguments.length) return reverseLayerOrder;
        reverseLayerOrder = _;
        return chart;
    };

    chart.barColors = function(_) {
        if (!arguments.length) return barColors;
        barColors = _;
        return chart;
    };

    chart.capitalizeLabels = function(_) {
        if (!arguments.length) return capitalizeLabels;
        capitalizeLabels = _;
        return chart;
    };

    chart.domain = function(_) {
        if (!arguments.length) return domain;
        domain = _;
        return chart;
    };

    chart.tickValues = function(_) {
        if (!arguments.length) return tickValues;
        tickValues = _;
        return chart;
    };

    chart.tickFormat = function(_) {
        if (!arguments.length) return tickFormat;
        tickFormat = _;
        return chart;
    };

    chart.tickSize = function(_) {
        if (!arguments.length) return tickSize;
        tickSize = _;
        return chart;
    };

    chart.colorLabels = function(_) {
        if (!arguments.length) return colorLabels;
        colorLabels = _;
        return chart;
    };

    chart.tickCircleValues = function(_) {
        if (!arguments.length) return tickCircleValues;
        tickCircleValues = _;
        return chart;
    };

    chart.transitionDuration = function(_) {
        if (!arguments.length) return transitionDuration;
        transitionDuration = _;
        return chart;
    };

    return chart;
}

function percentRank(array, n) {
    var L = 0;
    var S = 0;
    var N = array.length;

    for (var i = 0; i < array.length; i++) {
        if (array[i] < n) {
            L += 1
        } else if (array[i] === n) {
            S += 1
        } else {

        }
    }

    var pct = (L + (0.5 * S)) / N

    return pct
}

function getArrayForPercentRank(data,group,string){
    const array = [];
    //const filteredData = data.filter(student => student[group] == 1);
    const filteredData = data.filter(user => user.groups.indexOf(group) >= 0);

    //filter data by the comparison group
    filteredData.forEach((student) => array.push(+student[string]));
    return array;
}

function constructPercentileCharts(data1,data2,hasEnough360Ratings) {
  const tickLabels = ["10th","20th","30th","40th","50th","60th","70th","80th","90th"];
  const chartStyling = radialBarChart()
      .barHeight(220)
      .reverseLayerOrder(true)
      .capitalizeLabels(true)
      .barColors([ '#9999ff', '#9999ff', '#9999ff', '#9999ff', '#abf9b4', '#abf9b4', '#abf9b4', '#abf9b4', '#ff7f7f', '#ff7f7f', '#9999ff', '#9999ff' /* Pathos */,])  /* can define bar colors b/c fixed location of tactics around circle */
      .domain([0,1])
      .tickSize(1)
      .tickValues([.1,.2,.3,.4,.5,.6,.7,.8,.9])
      .tickFormat(function(d,i){ return tickLabels[i] })
      .tickCircleValues([.1,.2,.3,.4,.5,.6,.7,.8,.9]);

    document.querySelector("#chart1abs").classList.add('hidden');
    document.querySelector("#chart2abs").classList.add('hidden');
    document.querySelector("#chart1abs").classList.remove('active');
    document.querySelector("#chart2abs").classList.remove('active');
    document.querySelector("#chart1perc").classList.remove('hidden');
    document.querySelector("#chart2perc").classList.remove('hidden');
    document.querySelector("#chart1perc").classList.add('active');
    document.querySelector("#chart2perc").classList.add('active');

    d3.select('#chart1perc')
        .datum(data1)
        .call(chartStyling);
    d3.select('#chart2perc')
        .datum(data2)
        .call(chartStyling);

    document.querySelector('.submissions-holder span').innerHTML = data2[0].Submissions;

    if (hasEnough360Ratings == 0) {
        document.querySelectorAll('.third').forEach(elem => elem.style.display = 'none');
    }
}

function constructCharts(data1,data2,hasEnough360Ratings) {
    const tickLabels = ["1 (rarely or never)","2 (occasionally)","3 (often)","4 (almost always)"];
    const chartStyling = radialBarChart(true)
        .barHeight(220)
        .reverseLayerOrder(true)
        .capitalizeLabels(true)
        .barColors([ '#9999ff', '#9999ff', '#9999ff', '#9999ff', '#abf9b4', '#abf9b4', '#abf9b4', '#abf9b4', '#ff7f7f', '#ff7f7f', '#9999ff', '#9999ff' /* Pathos */,])  /* can define bar colors b/c fixed location of tactics around circle */
        .domain([0,3])
        .tickValues([0,1,2,3])
        .tickFormat(function(d,i){ return tickLabels[i] })
        .tickCircleValues([1,2]);

    document.querySelector("#chart1perc").classList.add('hidden');
    document.querySelector("#chart2perc").classList.add('hidden');
    document.querySelector("#chart1perc").classList.remove('active');
    document.querySelector("#chart2perc").classList.remove('active');
    document.querySelector("#chart1abs").classList.remove('hidden');
    document.querySelector("#chart2abs").classList.remove('hidden');
    document.querySelector("#chart1abs").classList.add('active');
    document.querySelector("#chart2abs").classList.add('active');

    d3.select('#chart1abs')
        .datum(data1)
        .call(chartStyling);
    d3.select('#chart2abs')
        .datum(data2)
        .call(chartStyling);

    if (hasEnough360Ratings == 0) {
        document.querySelectorAll('.third').forEach(elem => elem.style.display = 'none');
    }
}

function checkCookie(cname) {
    let user = getCookie(cname);
    if (user != "") {
        alert("Welcome back user: " + user);
    } else {
        user = prompt("Please enter your user ID #:", "");
        if (user != "" && user != null) {
            setCookie(cname, user, 365);
        }
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    const name = cname + "=";
    const ca = document.cookie.split(';');
    for(i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function sortProperties(obj)
{
  // convert object into array
	var sortable=[];
	for(var key in obj)
		if(obj.hasOwnProperty(key))
			sortable.push([key, obj[key]]); // each item is an array in format [key, value]

	// sort items by value
	sortable.sort(function(a, b)
	{
	  return a[1]-b[1]; // compare numbers
	});
	return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

function createSortedChart(data,className,container) {

  var margin = {
      top: 15,
      right: 50,
      bottom: 15,
      left: 50
  };

  var width = 480 - margin.left - margin.right,
      height = 480 - margin.top - margin.bottom;

  var svg = d3.select(`.${container}`).insert("svg",".chart")
      .classed(`${className}`,true)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.right + "," + margin.top + ")");

  // tooltips
  var tooltip = d3.select(`.${container}`).append('div')
      .attr('class', 'tooltip')
      .style('display', 'none');

  function mouseover(){
      tooltip.style('display', 'inline');
      d3.selectAll('.bar').style('opacity',0.5);
      d3.select(this).style('opacity',1);
  }
  function mousemove(){
      var d = d3.select(this).data()[0]
      tooltip
        //.html(d.name + '<hr/>' + d3.format(",.2f")(d.value) + '<hr/>' + d.definition)
        .html(d.name + '<hr/>' + matchDefinition(d.name))
        .style('left', (d3.event.pageX - 34) + 'px')
        .style('top', (d3.event.pageY - 12) + 'px');
  }
  function mouseout(){
      tooltip.style('display', 'none');
      d3.selectAll('.bar').style('opacity','1');
  }

  var x = d3.scale.linear()
      .range([0, width])
      .domain([0, d3.max(data, function (d) {
          return d.value + 1;
      })]);

  var y = d3.scale.ordinal()
      .rangeRoundBands([height, 0], .1)
      .domain(data.map(function (d) {
          return d.name;
      }));

  //make y axis to show bar names
  var yAxis = d3.svg.axis()
      .scale(y)
      //no tick marks
      .tickSize(0)
      .orient("left");

  var gy = svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

  var bars = svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("g")

      //append rects
      bars.append("rect")
          .attr("class", "bar")
          .attr('id', (d,i) => `bar-${d.name}`)
          .attr("y", function (d) {
              return y(d.name);
          })
          .attr("height", y.rangeBand())
          .attr("x", 0)
          .attr("width", function (d) {
              return x(d.value+1);
          })
          .attr("fill", function (d) {
            return matchColor(d.name);
          })
          .on('mouseover', mouseover)
          .on('mousemove', mousemove)
          .on('mouseout', mouseout);

      //add a value label to the right of each bar
      bars.append("text")
          .attr("class", "label")
          //y position of the label is halfway down the bar
          .attr("y", function (d) {
              return y(d.name) + y.rangeBand() / 2 + 4;
          })
          //x position is 3 pixels to the right of the bar
          .attr("x", function (d) {
              return x(d.value+1) + 3;
          })
          .text(function (d) {
              return d3.format(",.2f")(d.value+1);
              //return d.value;
          });
}

function removeSortedChart(className) {
  d3.select(`.${className}`).classed('hidden',true);
}

function showSortedChart(className) {
  d3.select(`.${className}`).classed('hidden',false);
}

function matchDefinition(name) {
  const definitions = {
    "Networks": "Cultivates a broad, disparate network.",
    "Team-building": "Builds cohesive groups. Strongly connected to organizational culture and socialization.",
    "Exchange": "Trades favors and concessions. Bargains. Connected more broadly to reciprocity.",
    "Allocentrism": "An “other” orientation. Actively seeks others’ interests, and considers their preferences. The opposite of ego‐centrism.",
    "Sit. Awareness": "Sensitive to how timing, priorities, risk and other factors vary with context.",
    "Agency": "Shapes situations. Influences circumstances to suit needs, challenges status quo, accepts little as fixed.",
    "Intentionality": "Acting with a goal in mind. Relentless pursuit of goals, eschewing distractions and secondary rewards.",
    "Logos": "Uses logical reasons, expertise or data to convince or persuade others.",
    "Might": "A willingness to use coercive power. More generally, an ability to address difficult issues and tolerate conflict.",
    "Ethos": "Establishes personal credibility through credentials, commonality and “decorum”, i.e., meeting others\’ expectations.",
    "Coalitions": "Identifies and builds support among key people.",
    "Pathos": "Conveys messages in a way that has emotional resonance."
  }
  return definitions[name]
}

function matchColor(name) {
  const colors = {
    "Networks": "#9999ff",
    "Team-building": "#9999ff",
    "Exchange": "#9999ff",
    "Allocentrism": "#9999ff",
    "Sit. Awareness": "#abf9b4",
    "Agency": "#abf9b4",
    "Intentionality": "#abf9b4",
    "Logos": "#abf9b4",
    "Might": "#ff7f7f",
    "Ethos": "#ff7f7f",
    "Coalitions": "#9999ff",
    "Pathos": "#9999ff"
  }
  return colors[name];
}
