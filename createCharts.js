const levdata = "levdatasample.csv";

d3.csv(levdata, function(data) {
    console.log(data);

    //initialize charts with student id = 1
    const studentId = 1;
    const chartData = getStudentData(studentId);
    const self_relative = chartData[0];
    const third_relative = chartData[1];
    constructCharts(self_relative,third_relative);

    //update charts when studentId changes
    d3.select("#studentIdInput").on("input", function() {
        update(+this.value)
    });

    function constructCharts(data1,data2) {
        const chartStyling = radialBarChart()
            .barHeight(225)
            .reverseLayerOrder(true)
            .capitalizeLabels(true)
            .barColors([ '#9999ff', '#9999ff', '#9999ff', '#9999ff', '#abf9b4', '#abf9b4', '#abf9b4', '#abf9b4', '#ff7f7f', '#ff7f7f', '#9999ff', '#9999ff' /* Pathos */,])  /* can define bar colors b/c fixed location of tactics around circle */
            .domain([0,4])
            .tickValues([1,2,3,4])
            .tickCircleValues([1,2,3]);

        d3.select('#chart1')
            .datum(data1)
            .call(chartStyling);
        d3.select('#chart2')
            .datum(data2)
            .call(chartStyling);
    }

    function getStudentData(result) {
        let self_relative = [   /* is there a way to not repeat this from above? */
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
        let third_relative = [
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
        return [self_relative, third_relative];
    }

    function update(studentId) {
        d3.select("#studentIdInput").text(studentId);
        d3.select("#studentIdInput").property("value", studentId);
        const result = document.getElementById('studentIdInput').value;
        console.log(result);
        const chartData = getStudentData(result);
        const self_relative = chartData[0];
        const third_relative = chartData[1];
        constructCharts(self_relative,third_relative);
    }

});

