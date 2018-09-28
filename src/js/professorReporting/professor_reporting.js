import groupLevelData from './groupLevelData';
import scatterPlotWithErrorBars from './scatterPlotWithErrorBars';
import scatterPlotMultipleGroups from './scatterPlotMultipleGroups';
import * as d3 from "d3";

//dev
// const userId = getCookie('resultsid');
// const url = "https://app.levinvstaging.com/backend/results/";
// const finalUrl = `${url}?id=${userId}`;

//production
// const userId = getCookie('resultsid');
// const url = "https://app.leverageinventory.com/backend/results/";
// const finalUrl = `${url}?id=${userId}`;

//local dev
//const proxy = 'https://cors-anywhere.herokuapp.com/';
//const finalUrl = `${proxy}${url}?id=${userId}`;


// d3.json(pathToData, function(error, data) {
//   scatterPlotWithErrorBars(testData);
// });

document.addEventListener("DOMContentLoaded", function(event) {
  const groupId = 619707;
  const groupData = groupLevelData[groupId];

  scatterPlotWithErrorBars(groupData, ".group-results-chart");
  //d3.select(".group-results-chart .chart-title").html(`${groupData.name}`);

  scatterPlotMultipleGroups(groupLevelData, groupId, groupData, ".group-results-chart-2");
  //d3.select(".group-results-chart-2 .chart-title").html(`${groupData.name} vs. Other Groups`);

  d3.selectAll('.legend-holder')
    .on('mouseover', function() {
      this.style.opacity = 1;
    })
    .on('mouseout', function() {
      this.style.opacity = 0.3;
    });

});
