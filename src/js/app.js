const levdata = "levdatasample.csv";

d3.csv(levdata, function(data) {

    //initialize charts with student id = 1
    let type='Absolute';
    let studentId = 1;
    const chartData = getStudentData(data,studentId,type);
    const self_data = chartData[0];
    const third_data = chartData[1];
    if (type==='Absolute') {
        constructCharts(self_data,third_data);
    } else {
        constructPercentileCharts(self_data,third_data);
    }

    //update charts when absolute/percentile toggle changes
    document.querySelectorAll(".type-toggle button").forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            document.querySelectorAll(".type-toggle button").forEach(button => {
                button.classList.remove('button-clicked');
            });
            this.classList.add('button-clicked');
            update(data,document.querySelector("#studentIdInput").value,this.innerText);
            if (this.innerText === 'Percentile') {
                type='Percentile';
                document.querySelector(".percentile-options").classList.remove('hidden');
            } else {
                type='Absolute';
                document.querySelector(".percentile-options").classList.add('hidden');
            }
        });
    });

    //update charts when studentId changes
    d3.select("#studentIdInput").on("input", function() {
        update(data,+this.value,type);
    });

});

function update(data,studentId,type) {
    d3.select("#studentIdInput").text(studentId);
    d3.select("#studentIdInput").property("value", studentId);
    const chartData = getStudentData(data,studentId,type);
    const self_data = chartData[0];
    const third_data = chartData[1];
    if (type==='Absolute') {

        constructCharts(self_data,third_data);
    } else {
        constructPercentileCharts(self_data,third_data);
    }

}

function getStudentData(data,result,type) {

    if (type==='Absolute') {
        const self_data = [
            {
                "data": {
                    "Network": data[result-1].Network1,
                    "Team-building": data[result-1].Team1,
                    "Exchange": data[result-1].Exchange1,
                    "Allocentrism": data[result-1].Allocentrism1,
                    "Situation Awareness": data[result-1].SA1,
                    "Agency": data[result-1].Agency1,
                    "Intentionality": data[result-1].Intentionality1,
                    "Logos": data[result-1].Logos1,
                    "Might": data[result-1].Might1,
                    "Ethos": data[result-1].Ethos1,
                    "Coalition": data[result-1].Coalition1,
                    "Pathos": data[result-1].Pathos1,
                }
            }
        ];
        const third_data = [
            {
                "data": {
                    "Network": data[result-1].Network3,
                    "Team-building": data[result-1].Team3,
                    "Exchange": data[result-1].Exchange3,
                    "Allocentrism": data[result-1].Allocentrism3,
                    "Situation Awareness": data[result-1].SA3,
                    "Agency": data[result-1].Agency3,
                    "Intentionality": data[result-1].Intentionality3,
                    "Logos": data[result-1].Logos3,
                    "Might": data[result-1].Might3,
                    "Ethos": data[result-1].Ethos3,
                    "Coalition": data[result-1].Coalition3,
                    "Pathos": data[result-1].Pathos3,
                }
            }
        ];
        return [self_data, third_data];
    } else {
        const self_data = [
            {
                "data": {
                    "Network": percentRank(getArrayForPercentRank(data,'Network1'),data[result-1].Network1),
                    "Team-building": percentRank(getArrayForPercentRank(data,'Team1'),data[result-1].Team1),
                    "Exchange": percentRank(getArrayForPercentRank(data,'Exchange1'),data[result-1].Exchange1),
                    "Allocentrism": percentRank(getArrayForPercentRank(data,'Allocentrism1'),data[result-1].Allocentrism1),
                    "Situation Awareness": percentRank(getArrayForPercentRank(data,'SA1'),data[result-1].SA1),
                    "Agency": percentRank(getArrayForPercentRank(data,'Agency1'),data[result-1].Agency1),
                    "Intentionality": percentRank(getArrayForPercentRank(data,'Intentionality1'),data[result-1].Intentionality1),
                    "Logos": percentRank(getArrayForPercentRank(data,'Logos1'),data[result-1].Logos1),
                    "Might": percentRank(getArrayForPercentRank(data,'Might1'),data[result-1].Might1),
                    "Ethos": percentRank(getArrayForPercentRank(data,'Ethos1'),data[result-1].Ethos1),
                    "Coalition": percentRank(getArrayForPercentRank(data,'Coalition1'),data[result-1].Coalition1),
                    "Pathos": percentRank(getArrayForPercentRank(data,'Pathos1'),data[result-1].Pathos1),
                }
            }
        ];
        const third_data = [
            {
                "data": {
                    "Network": percentRank(getArrayForPercentRank(data,'Network3'),data[result-1].Network3),
                    "Team-building": percentRank(getArrayForPercentRank(data,'Team3'),data[result-1].Team3),
                    "Exchange": percentRank(getArrayForPercentRank(data,'Exchange3'),data[result-1].Exchange3),
                    "Allocentrism": percentRank(getArrayForPercentRank(data,'Allocentrism3'),data[result-1].Allocentrism3),
                    "Situation Awareness": percentRank(getArrayForPercentRank(data,'SA3'),data[result-1].SA3),
                    "Agency": percentRank(getArrayForPercentRank(data,'Agency3'),data[result-1].Agency3),
                    "Intentionality": percentRank(getArrayForPercentRank(data,'Intentionality3'),data[result-1].Intentionality3),
                    "Logos": percentRank(getArrayForPercentRank(data,'Logos3'),data[result-1].Logos3),
                    "Might": percentRank(getArrayForPercentRank(data,'Might3'),data[result-1].Might3),
                    "Ethos": percentRank(getArrayForPercentRank(data,'Ethos3'),data[result-1].Ethos3),
                    "Coalition": percentRank(getArrayForPercentRank(data,'Coalition3'),data[result-1].Coalition3),
                    "Pathos": percentRank(getArrayForPercentRank(data,'Pathos3'),data[result-1].Pathos3),
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
        labelRadius = barHeight * 1.025;
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

function getArrayForPercentRank(data,string){
    const array = [];
    data.forEach((student) => array.push(+student[string]));
    return array;
}

function constructPercentileCharts(data1,data2) {
    console.log('constructing percentile');
    const chartStyling = radialBarChart()
        .barHeight(220)
        .reverseLayerOrder(true)
        .capitalizeLabels(true)
        .barColors([ '#9999ff', '#9999ff', '#9999ff', '#9999ff', '#abf9b4', '#abf9b4', '#abf9b4', '#abf9b4', '#ff7f7f', '#ff7f7f', '#9999ff', '#9999ff' /* Pathos */,])  /* can define bar colors b/c fixed location of tactics around circle */
        .domain([0,1])
        .tickValues([0.25,0.50,0.75,1.0])
        .tickCircleValues([.25,.50,.75]);

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

}

function constructCharts(data1,data2) {
    console.log('constructing absolute');
    const chartStyling = radialBarChart()
        .barHeight(220)
        .reverseLayerOrder(true)
        .capitalizeLabels(true)
        .barColors([ '#9999ff', '#9999ff', '#9999ff', '#9999ff', '#abf9b4', '#abf9b4', '#abf9b4', '#abf9b4', '#ff7f7f', '#ff7f7f', '#9999ff', '#9999ff' /* Pathos */,])  /* can define bar colors b/c fixed location of tactics around circle */
        .domain([0,4])
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
}