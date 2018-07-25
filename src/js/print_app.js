//start by getting the unique userId from cookie, or ask for user to provide it
const userId = getCookie('userId');

d3.json(`http://localhost:3000/user${userId}`, function(data) {

    //create options to compare against different subgroups based on the groups that the user belongs to
    const groupData = data[0].groups;
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
    let type='Absolute';
    const hasEnough360Ratings = data[0].hasEnough360Ratings;
    const chartData = getStudentData(data,userId,type,group);
    const self_data = chartData[0];
    const third_data = chartData[1];
    constructCharts(self_data,third_data,hasEnough360Ratings);
    update(data,userId,'Percentile',group,hasEnough360Ratings);

    //header with custom name and today's date
    const name = `<span class="purple">Name:</span> ${data[0].first_name} ${data[0].last_name}`;
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

    document.querySelector('.header-name').innerHTML = name;
    document.querySelector('.header-date').innerHTML = today;

    window.focus();
    window.print();

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

function update(data,userId,type,group,hasEnough360Ratings) {
    const chartData = getStudentData(data,userId,type,group);
    const self_data = chartData[0];
    const third_data = chartData[1];
    if (type==='Absolute') {
        constructCharts(self_data,third_data,hasEnough360Ratings);
    } else {
        constructPercentileCharts(self_data,third_data,hasEnough360Ratings);
    }

}

function getStudentData(data,result,type,group) {

    if (type==='Absolute') {
        const self_data = [
            {
                "data": {
                    "Network": data[0].Network1,
                    "Team-building": data[0].Team1,
                    "Exchange": data[0].Exchange1,
                    "Allocentrism": data[0].Allocentrism1,
                    "Sit. Awareness": data[0].SA1,
                    "Agency": data[0].Agency1,
                    "Intentionality": data[0].Intentionality1,
                    "Logos": data[0].Logos1,
                    "Might": data[0].Might1,
                    "Ethos": data[0].Ethos1,
                    "Coalition": data[0].Coalition1,
                    "Pathos": data[0].Pathos1,
                }
            }
        ];
        const third_data = [
            {
                "data": {
                    "Network": data[0].Network3,
                    "Team-building": data[0].Team3,
                    "Exchange": data[0].Exchange3,
                    "Allocentrism": data[0].Allocentrism3,
                    "Sit. Awareness": data[0].SA3,
                    "Agency": data[0].Agency3,
                    "Intentionality": data[0].Intentionality3,
                    "Logos": data[0].Logos3,
                    "Might": data[0].Might3,
                    "Ethos": data[0].Ethos3,
                    "Coalition": data[0].Coalition3,
                    "Pathos": data[0].Pathos3,
                }
            }
        ];
        return [self_data, third_data];
    } else {
        const self_data = [
            {
                "data": {
                    "Network": percentRank(getArrayForPercentRank(data,group,'Network1'),data[0].Network1),
                    "Team-building": percentRank(getArrayForPercentRank(data,group,'Team1'),data[0].Team1),
                    "Exchange": percentRank(getArrayForPercentRank(data,group,'Exchange1'),data[0].Exchange1),
                    "Allocentrism": percentRank(getArrayForPercentRank(data,group,'Allocentrism1'),data[0].Allocentrism1),
                    "Situation Awareness": percentRank(getArrayForPercentRank(data,group,'SA1'),data[0].SA1),
                    "Agency": percentRank(getArrayForPercentRank(data,group,'Agency1'),data[0].Agency1),
                    "Intentionality": percentRank(getArrayForPercentRank(data,group,'Intentionality1'),data[0].Intentionality1),
                    "Logos": percentRank(getArrayForPercentRank(data,group,'Logos1'),data[0].Logos1),
                    "Might": percentRank(getArrayForPercentRank(data,group,'Might1'),data[0].Might1),
                    "Ethos": percentRank(getArrayForPercentRank(data,group,'Ethos1'),data[0].Ethos1),
                    "Coalition": percentRank(getArrayForPercentRank(data,group,'Coalition1'),data[0].Coalition1),
                    "Pathos": percentRank(getArrayForPercentRank(data,group,'Pathos1'),data[0].Pathos1),
                }
            }
        ];
        const third_data = [
            {
                "data": {
                    "Network": percentRank(getArrayForPercentRank(data,group,'Network3'),data[0].Network3),
                    "Team-building": percentRank(getArrayForPercentRank(data,group,'Team3'),data[0].Team3),
                    "Exchange": percentRank(getArrayForPercentRank(data,group,'Exchange3'),data[0].Exchange3),
                    "Allocentrism": percentRank(getArrayForPercentRank(data,group,'Allocentrism3'),data[0].Allocentrism3),
                    "Situation Awareness": percentRank(getArrayForPercentRank(data,group,'SA3'),data[0].SA3),
                    "Agency": percentRank(getArrayForPercentRank(data,group,'Agency3'),data[0].Agency3),
                    "Intentionality": percentRank(getArrayForPercentRank(data,group,'Intentionality3'),data[0].Intentionality3),
                    "Logos": percentRank(getArrayForPercentRank(data,group,'Logos3'),data[0].Logos3),
                    "Might": percentRank(getArrayForPercentRank(data,group,'Might3'),data[0].Might3),
                    "Ethos": percentRank(getArrayForPercentRank(data,group,'Ethos3'),data[0].Ethos3),
                    "Coalition": percentRank(getArrayForPercentRank(data,group,'Coalition3'),data[0].Coalition3),
                    "Pathos": percentRank(getArrayForPercentRank(data,group,'Pathos3'),data[0].Pathos3),
                }
            }
        ];
        return [self_data, third_data];
    }
}

function radialBarChart() {
    // Configurable variables
    var margin = {top: 20, right: 20, bottom: 20, left: 20};
    var barHeight = 100;
    var reverseLayerOrder = false;
    var barColors = undefined;
    var capitalizeLabels = false;
    var domain = [0, 100];
    var tickValues = undefined;
    var colorLabels = false;
    var tickCircleValues = [];
    var transitionDuration = 1000;

    // Scales & other useful things
    var numBars = null;
    var barScale = null;
    var keys = null;
    var labelRadius = 0;


    function init(d) {
        barScale = d3.scale.linear().domain(domain).range([0, barHeight]);

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
            .style('fill', 'none');
    }

    function renderOverlays(container) {
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
        var axisScale = d3.scale.linear().domain(domain).range([0, -barHeight]);
        var axis = d3.svg.axis().scale(axisScale).orient('right');
        if(tickValues)
            axis.tickValues(tickValues);
        g.append('g')
            .classed('axis', true)
            .call(axis);

        // Outer circle
        g.append('circle')
            .attr('r', barHeight)
            .classed('outer', true)
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

            // Segment enter/exit/update
            var segments = layers
                .selectAll('path')
                .data(function(d) {
                    var m = d3.map(d.data);
                    return m.values();
                });

            segments
                .enter()
                .append('path')
                .style('fill', function(d, i) {
                    if(!barColors) return;
                    return barColors[i % barColors.length];
                });

            segments.exit().remove();

            segments
                .transition()
                .duration(transitionDuration)
                .attr('d', d3.svg.arc().innerRadius(0).outerRadius(or).startAngle(sa).endAngle(ea))

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

    //filter data by the comparison group
    filteredData.forEach((student) => array.push(+student[string]));
    return array;
}

function constructPercentileCharts(data1,data2,hasEnough360Ratings) {
    console.log('constructing percentile');
    const chartStyling = radialBarChart()
        .barHeight(220)
        .reverseLayerOrder(true)
        .capitalizeLabels(true)
        .barColors([ '#9999ff', '#9999ff', '#9999ff', '#9999ff', '#abf9b4', '#abf9b4', '#abf9b4', '#abf9b4', '#ff7f7f', '#ff7f7f', '#9999ff', '#9999ff' /* Pathos */,])  /* can define bar colors b/c fixed location of tactics around circle */
        .domain([0,1])
        .tickValues([0.25,0.50,0.75,1.0])
        .tickCircleValues([.25,.50,.75]);

    document.querySelector("#chart1abs").classList.remove('hidden');
    document.querySelector("#chart2abs").classList.remove('hidden');
    document.querySelector("#chart1perc").classList.remove('hidden');
    document.querySelector("#chart2perc").classList.remove('hidden');

    d3.select('#chart1perc')
        .datum(data1)
        .call(chartStyling);
    d3.select('#chart2perc')
        .datum(data2)
        .call(chartStyling);

    if (hasEnough360Ratings == 0) {
        document.querySelectorAll('.third').forEach(elem => elem.style.display = 'none');
    }
}

function constructCharts(data1,data2,hasEnough360Ratings) {
    console.log('constructing absolute');
    const chartStyling = radialBarChart()
        .barHeight(220)
        .reverseLayerOrder(true)
        .capitalizeLabels(true)
        .barColors([ '#9999ff', '#9999ff', '#9999ff', '#9999ff', '#abf9b4', '#abf9b4', '#abf9b4', '#abf9b4', '#ff7f7f', '#ff7f7f', '#9999ff', '#9999ff' /* Pathos */,])  /* can define bar colors b/c fixed location of tactics around circle */
        .domain([1,4])
        .tickValues([1,2,3,4])
        .tickCircleValues([1,2,3]);

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