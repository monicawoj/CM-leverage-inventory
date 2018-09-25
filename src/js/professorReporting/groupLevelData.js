// const groupNames = ['MBA','Google','ExecMBA'];
// const factors = ['Allocentrism','Team-building','Exchange','Networks','Sit. Awareness','Coalitions','Agency','Intentionality','Pathos','Logos','Might','Ethos'];
// function randomNum(min,max) {
//   return (Math.random()*(max-min)+min).toFixed(2);
// }
// function randomId() {
//   return Math.floor(randomNum(100000,900000));
// }
//
// let groupLevelData = {};
// groupNames.forEach(name => {
//   let id = randomId();
//   groupLevelData[id] = {};
//   groupLevelData[id]['name'] = name;
//   groupLevelData[id]['data'] = [];
//   factors.forEach((factor,i) => {
//     let avg = randomNum(2,3);
//     let tenth = randomNum(1,2);
//     let ninetieth = randomNum(3,4);
//     const object = {};
//     object['factor'] = factor;
//     object['avg'] = avg;
//     object['tenthPercentile'] = +tenth;
//     object['ninetiethPercentile'] = +ninetieth;
//     object['indexFromSoftToHard'] = +i;
//     groupLevelData[id]['data'].push(object);
//   });
// });

const groupLevelData = {
  "619707": {
    "name": "Google",
    "data": [
      {
        "factor": "Allocentrism",
        "avg": "2.48",
        "tenthPercentile": 1.72,
        "ninetiethPercentile": 3.68,
        "indexFromSoftToHard": 0
      },
      {
        "factor": "Team-building",
        "avg": "2.84",
        "tenthPercentile": 1.38,
        "ninetiethPercentile": 3.45,
        "indexFromSoftToHard": 1
      },
      {
        "factor": "Exchange",
        "avg": "2.24",
        "tenthPercentile": 1.59,
        "ninetiethPercentile": 3.59,
        "indexFromSoftToHard": 2
      },
      {
        "factor": "Networks",
        "avg": "2.13",
        "tenthPercentile": 1.21,
        "ninetiethPercentile": 3.57,
        "indexFromSoftToHard": 3
      },
      {
        "factor": "Sit. Awareness",
        "avg": "2.55",
        "tenthPercentile": 1.23,
        "ninetiethPercentile": 3.76,
        "indexFromSoftToHard": 4
      },
      {
        "factor": "Coalitions",
        "avg": "2.71",
        "tenthPercentile": 1.73,
        "ninetiethPercentile": 3.37,
        "indexFromSoftToHard": 5
      },
      {
        "factor": "Agency",
        "avg": "2.13",
        "tenthPercentile": 1.91,
        "ninetiethPercentile": 3.59,
        "indexFromSoftToHard": 6
      },
      {
        "factor": "Intentionality",
        "avg": "2.58",
        "tenthPercentile": 1.01,
        "ninetiethPercentile": 3.72,
        "indexFromSoftToHard": 7
      },
      {
        "factor": "Pathos",
        "avg": "2.53",
        "tenthPercentile": 1.99,
        "ninetiethPercentile": 3.67,
        "indexFromSoftToHard": 8
      },
      {
        "factor": "Logos",
        "avg": "2.27",
        "tenthPercentile": 1.01,
        "ninetiethPercentile": 3.95,
        "indexFromSoftToHard": 9
      },
      {
        "factor": "Might",
        "avg": "2.70",
        "tenthPercentile": 1.02,
        "ninetiethPercentile": 3.36,
        "indexFromSoftToHard": 10
      },
      {
        "factor": "Ethos",
        "avg": "2.38",
        "tenthPercentile": 1.12,
        "ninetiethPercentile": 3.35,
        "indexFromSoftToHard": 11
      }
    ]
  },
  "653988": {
    "name": "MBA",
    "data": [
      {
        "factor": "Allocentrism",
        "avg": "2.66",
        "tenthPercentile": 1.02,
        "ninetiethPercentile": 3.97,
        "indexFromSoftToHard": 0
      },
      {
        "factor": "Team-building",
        "avg": "2.01",
        "tenthPercentile": 1.73,
        "ninetiethPercentile": 3.17,
        "indexFromSoftToHard": 1
      },
      {
        "factor": "Exchange",
        "avg": "2.09",
        "tenthPercentile": 1.98,
        "ninetiethPercentile": 3.14,
        "indexFromSoftToHard": 2
      },
      {
        "factor": "Networks",
        "avg": "2.76",
        "tenthPercentile": 1.72,
        "ninetiethPercentile": 3.14,
        "indexFromSoftToHard": 3
      },
      {
        "factor": "Sit. Awareness",
        "avg": "2.62",
        "tenthPercentile": 1.97,
        "ninetiethPercentile": 3.75,
        "indexFromSoftToHard": 4
      },
      {
        "factor": "Coalitions",
        "avg": "2.19",
        "tenthPercentile": 1.1,
        "ninetiethPercentile": 3.03,
        "indexFromSoftToHard": 5
      },
      {
        "factor": "Agency",
        "avg": "2.20",
        "tenthPercentile": 1.92,
        "ninetiethPercentile": 3.29,
        "indexFromSoftToHard": 6
      },
      {
        "factor": "Intentionality",
        "avg": "2.29",
        "tenthPercentile": 1.57,
        "ninetiethPercentile": 3.14,
        "indexFromSoftToHard": 7
      },
      {
        "factor": "Pathos",
        "avg": "2.19",
        "tenthPercentile": 1.09,
        "ninetiethPercentile": 3.77,
        "indexFromSoftToHard": 8
      },
      {
        "factor": "Logos",
        "avg": "2.09",
        "tenthPercentile": 1.95,
        "ninetiethPercentile": 3.54,
        "indexFromSoftToHard": 9
      },
      {
        "factor": "Might",
        "avg": "2.51",
        "tenthPercentile": 1.51,
        "ninetiethPercentile": 3.42,
        "indexFromSoftToHard": 10
      },
      {
        "factor": "Ethos",
        "avg": "2.88",
        "tenthPercentile": 1.49,
        "ninetiethPercentile": 3.52,
        "indexFromSoftToHard": 11
      }
    ]
  },
  "688565": {
    "name": "ExecMBA",
    "data": [
      {
        "factor": "Allocentrism",
        "avg": "2.10",
        "tenthPercentile": 1.34,
        "ninetiethPercentile": 3.72,
        "indexFromSoftToHard": 0
      },
      {
        "factor": "Team-building",
        "avg": "2.01",
        "tenthPercentile": 1.46,
        "ninetiethPercentile": 3.6,
        "indexFromSoftToHard": 1
      },
      {
        "factor": "Exchange",
        "avg": "2.99",
        "tenthPercentile": 1.69,
        "ninetiethPercentile": 3.67,
        "indexFromSoftToHard": 2
      },
      {
        "factor": "Networks",
        "avg": "2.08",
        "tenthPercentile": 1.72,
        "ninetiethPercentile": 3.89,
        "indexFromSoftToHard": 3
      },
      {
        "factor": "Sit. Awareness",
        "avg": "2.09",
        "tenthPercentile": 1.05,
        "ninetiethPercentile": 3.18,
        "indexFromSoftToHard": 4
      },
      {
        "factor": "Coalitions",
        "avg": "2.48",
        "tenthPercentile": 1.59,
        "ninetiethPercentile": 3.58,
        "indexFromSoftToHard": 5
      },
      {
        "factor": "Agency",
        "avg": "2.32",
        "tenthPercentile": 1.63,
        "ninetiethPercentile": 3.29,
        "indexFromSoftToHard": 6
      },
      {
        "factor": "Intentionality",
        "avg": "2.74",
        "tenthPercentile": 1.87,
        "ninetiethPercentile": 3.06,
        "indexFromSoftToHard": 7
      },
      {
        "factor": "Pathos",
        "avg": "2.76",
        "tenthPercentile": 1.98,
        "ninetiethPercentile": 3.94,
        "indexFromSoftToHard": 8
      },
      {
        "factor": "Logos",
        "avg": "2.50",
        "tenthPercentile": 1.3,
        "ninetiethPercentile": 3.49,
        "indexFromSoftToHard": 9
      },
      {
        "factor": "Might",
        "avg": "2.36",
        "tenthPercentile": 1.74,
        "ninetiethPercentile": 3.84,
        "indexFromSoftToHard": 10
      },
      {
        "factor": "Ethos",
        "avg": "2.09",
        "tenthPercentile": 1.83,
        "ninetiethPercentile": 3.39,
        "indexFromSoftToHard": 11
      }
    ]
  }
};
//console.log(groupLevelData);
export default groupLevelData;
