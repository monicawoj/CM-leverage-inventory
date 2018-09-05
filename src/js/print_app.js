//dev
const userId = getCookie('resultsid');
const url = "http://app.levinvstaging.com/backend/results/";
const finalUrl = `${url}?id=${userId}`;

//production
// const userId = getCookie('resultsid');
// const url = "https://app.leverageinventory.com/backend/results/";
// const finalUrl = `${url}?id=${userId}`;

d3.json(finalUrl, function(error, data) {
    executeAndPrint(data, print);
    function print(){
        window.print();
    }
});

function executeAndPrint(data, callback){
  setTimeout(function(){
     callback();
  },200);
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
      .text(function(d) {return d});

  let group = groupData[0];
  d3.select(`input#${group}`)
      .property('checked',true);

  //initialize charts
  const hasEnough360Ratings = data.hasEnough360Ratings;
  let chartData = getStudentData(data,'Absolute',group);
  constructCharts(chartData[0],chartData[1],hasEnough360Ratings);
  let count = 1;
  let second_count = 2;
  groupData.forEach(group => {
    update(data,'Percentile',group,hasEnough360Ratings,count,second_count);
    count += 2;
    second_count += 2;
  });
  d3.selectAll('.hidden').remove();

  //display open-ended question responses if has meets threshold 360 responses
  if (hasEnough360Ratings) {
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
          questionResponses.forEach((response) => {
              let listItem = document.createElement('li');
              listItem.innerText = response;
              listItem.classList.add(`open-ended-response`);
              d3.selectAll(questionClass).append(() => {
                  return listItem;
              });
          });
      }
  }

  //header with custom name and today's date
  const name = `<span class="purple">Name:</span> ${data.first_name} ${data.last_name}`;
  console.log(name);
  const date = new Date();
  let dd = date.getDate();
  let mm = date.getMonth()+1;
  const yyyy = date.getFullYear();

  if (dd<10) {
      dd = '0'+dd;
  }
  if (mm<10) {
      mm = '0'+mm;
  }

  const today = `<span class="purple">Date:</span> ${mm}/${dd}/${yyyy}`;

  console.log(document.querySelectorAll('.header-name'));
  document.querySelectorAll('.header-name').forEach((elem) => elem.innerHTML = name);
  document.querySelectorAll('.header-date').forEach((elem) => elem.innerHTML = today);
}

function getValue(group) {
    let result = 'null';
    document.getElementsByName(group).forEach(element => {
        if (element.checked) {
            result = element.id;
        }
    });
    return result;
}

function update(data,type,group,hasEnough360Ratings,count,second_count) {
    const chartData = getStudentData(data,type,group);
    const self_data = chartData[0];
    const third_data = chartData[1];
    constructPercentileCharts(self_data,third_data,hasEnough360Ratings,group,count,second_count);
}

function getStudentData(data,type,group) {

    if (type==='Absolute') {
        const self_data = [
            {
                "data": {
                    "Network": data.Network1-1,
                    "Team-building": data.Team1-1,
                    "Exchange": data.Exchange1-1,
                    "Allocentrism": data.Allocentrism1-1,
                    "Sit. Awareness": data.SA1-1,
                    "Agency": data.Agency1-1,
                    "Intentionality": data.Intentionality1-1,
                    "Logos": data.Logos1-1,
                    "Might": data.Might1-1,
                    "Ethos": data.Ethos1-1,
                    "Coalition": data.Coalition1-1,
                    "Pathos": data.Pathos1-1,
                }
            }
        ];
        const third_data = [
            {
                "data": {
                    "Network": data.Network3-1,
                    "Team-building": data.Team3-1,
                    "Exchange": data.Exchange3-1,
                    "Allocentrism": data.Allocentrism3-1,
                    "Sit. Awareness": data.SA3-1,
                    "Agency": data.Agency3-1,
                    "Intentionality": data.Intentionality3-1,
                    "Logos": data.Logos3-1,
                    "Might": data.Might3-1,
                    "Ethos": data.Ethos3-1,
                    "Coalition": data.Coalition3-1,
                    "Pathos": data.Pathos3-1,
                }
            }
        ];
        return [self_data, third_data];
    } else {
        const self_data = [
            {
                "data": {
                    "Network": data["group_avgs"][group].Network1,
                    "Team-building": data["group_avgs"][group].Team1,
                    "Exchange": data["group_avgs"][group].Exchange1,
                    "Allocentrism": data["group_avgs"][group].Allocentrism1,
                    "Sit. Awareness": data["group_avgs"][group].SA1,
                    "Agency": data["group_avgs"][group].Agency1,
                    "Intentionality": data["group_avgs"][group].Intentionality1,
                    "Logos": data["group_avgs"][group].Logos1,
                    "Might": data["group_avgs"][group].Might1,
                    "Ethos": data["group_avgs"][group].Ethos1,
                    "Coalition": data["group_avgs"][group].Coalition1,
                    "Pathos": data["group_avgs"][group].Pathos1,
                }
            }
        ];
        const third_data = [
            {
                "data": {
                    "Network": data["group_avgs"][group].Network3,
                    "Team-building": data["group_avgs"][group].Team3,
                    "Exchange": data["group_avgs"][group].Exchange3,
                    "Allocentrism": data["group_avgs"][group].Allocentrism3,
                    "Sit. Awareness": data["group_avgs"][group].SA3,
                    "Agency": data["group_avgs"][group].Agency3,
                    "Intentionality": data["group_avgs"][group].Intentionality3,
                    "Logos": data["group_avgs"][group].Logos3,
                    "Might": data["group_avgs"][group].Might3,
                    "Ethos": data["group_avgs"][group].Ethos3,
                    "Coalition": data["group_avgs"][group].Coalition3,
                    "Pathos": data["group_avgs"][group].Pathos3,
                },
                "Submissions": data["group_avgs"][group].Submissions
            }
        ];
        return [self_data, third_data];
    }
}

function radialBarChart(centerAxisLabels=false) {
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
                .attr('id', (i) => `bar-${i}`)
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
                                return d;
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
    const filteredData = data.filter(user => user.groups.indexOf(group) >= 0);
    filteredData.forEach((student) => array.push(+student[string]));
    return array;
}

function constructPercentileCharts(data1,data2,hasEnough360Ratings,group,count,second_count) {
    const tickLabels = ["10th","20th","30th","40th","50th","60th","70th","80th","90th"];
    const chartStyling = radialBarChart()
        .barHeight(220)
        .reverseLayerOrder(true)
        .capitalizeLabels(true)
        .barColors([ '#9999ff', '#9999ff', '#9999ff', '#9999ff', '#abf9b4', '#abf9b4', '#abf9b4', '#abf9b4', '#ff7f7f', '#ff7f7f', '#9999ff', '#9999ff' /* Pathos */,])  /* can define bar colors b/c fixed location of tactics around circle */
        .domain([0,1])
        .tickValues([.1,.2,.3,.4,.5,.6,.7,.8,.9])
        .tickFormat(function(d,i){ return tickLabels[i] })
        .tickCircleValues([.1,.2,.3,.4,.5,.6,.7,.8,.9]);

    let self_percentile_chart_holder = d3.select(`#chart${count}perc`);
    let third_percentile_chart_holder = d3.select(`#chart${second_count}perc`);

    let self_page = self_percentile_chart_holder.node().parentNode.parentNode.parentNode;
    let third_page = third_percentile_chart_holder.node().parentNode.parentNode.parentNode;

    let self_group_name_holder = self_page.querySelector('.chart-info .chart-title p');
    let third_group_name_holder = third_page.querySelector('.chart-info .chart-title p');

    self_page.classList.remove('hidden');
    third_page.classList.remove('hidden');

    self_percentile_chart_holder
        .datum(data1)
        .call(chartStyling);
    third_percentile_chart_holder
        .datum(data2)
        .call(chartStyling);



    self_group_name_holder.append(`vs. ${group.toUpperCase()}. This group contains: ${data2[0].Submissions} submissions.`);
    third_group_name_holder.append(`vs. ${group.toUpperCase()}. This group contains: ${data2[0].Submissions} submissions.`);

    if (hasEnough360Ratings == 0) {
        document.querySelectorAll('.third').forEach(elem => elem.style.display = 'none');
    }

}

function constructCharts(data1,data2,hasEnough360Ratings) {
    const tickLabels = ["1 (rarely or never)","2 (occasionally)","3 (often)","4 (almost always)"];
    const chartStyling = radialBarChart()
        .barHeight(220)
        .reverseLayerOrder(true)
        .capitalizeLabels(true)
        .barColors([ '#9999ff', '#9999ff', '#9999ff', '#9999ff', '#abf9b4', '#abf9b4', '#abf9b4', '#abf9b4', '#ff7f7f', '#ff7f7f', '#9999ff', '#9999ff' /* Pathos */,])  /* can define bar colors b/c fixed location of tactics around circle */
        .domain([0,3])
        .tickValues([0,1,2,3])
        .tickFormat(function(d,i){ return tickLabels[i] })
        .tickCircleValues([2,3]);

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

function checkCookie() {
    let user = getCookie("userId");
    if (user != "") {
        alert("Welcome back!");
    } else {
        user = prompt("Please enter your user ID #:", "");
        if (user != "" && user != null) {
            setCookie("userId", user, 365);
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
