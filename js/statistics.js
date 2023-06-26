var winChart = c3.generate({
    bindto: '#win-chart',
    data: {
        x: 'Month',
        columns: winData,
        type: 'bar',
        colors: {
            'Win Count': '#ff9429',
        },
    },
    axis : {
        x : {
            type : 'timeseries',
            tick: {
                format: function (x) { return monthNamesShort[x.getMonth()] + " - " + x.getFullYear(); }
            }
        }
    },
    bar: {
        width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
        }
    },
    legend: {
        show: false
    }
});

var winTimeChart = c3.generate({
    bindto: '#win-time-chart',
    data: {
        x: 'Month',
        columns: winTimeData,
        colors: {
            'Win Rate': '#ff9429',
        },
        type: 'spline'
    },
    axis : {
        x : {
            type : 'timeseries',
            tick: {
                format: function (x) { return monthNamesShort[x.getMonth()] + " - " + x.getFullYear(); }
            }
        },
        y: {
            max: 100,
            min: 0,
            padding: {top: 0, bottom: 0}
        }
    },
    legend: {
        show: false
    }
});

var rankTimeChart = c3.generate({
    bindto: '#rank-time-chart',
    data: {
        x: 'Month',
        columns: rankTimeData,
        colors: {
            'Win Rate': '#ff9429',
        },
        type: 'spline'
    },
    axis : {
        x : {
            type : 'timeseries',
            tick: {
                format: function (x) { return monthNamesShort[x.getMonth()] + " - " + x.getFullYear(); }
            }
        },
        y: {
            inverted: true,
            max: 5,
            min: 1,
            padding: {top: 0, bottom: 0}
        }
    },
    legend: {
        show: false
    },
    line: {
        connect_null: false
    }
});

var favoriteChart = c3.generate({
    bindto: '#favorite-chart',
    data: {
        // iris data from R
        columns: favoriteData,
        type : 'pie',
        onclick: function (d, i) { console.log("onclick", d, i); },
        // onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        // onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    }
});

var winGameChart = c3.generate({
    bindto: '#win-game-chart',
    data: {
        columns: winGameData,
        type: 'bar',
        colors: {
            'Win Rate': '#ff9429',
        },
    },
    axis: {
        x: {
            type: 'category',
            categories: winGameData[0]
        },
        y: {
            max: 100,
            min: 0,
            padding: {top: 0, bottom: 0}
        }
    },
    bar: {
        width: {
            ratio: 0.75 // this makes bar width 50% of length between ticks
        }
    },
    legend: {
        show: false
    }
});

// Code sourced from https://github.com/DKirwan/calendar-heatmap
var now = moment().endOf('day').toDate();
var yearAgo = moment().startOf('day').subtract(1, 'year').toDate();
var chartData = d3.timeDays(yearAgo, now).map(function (dateElement) {
    return {
        date: dateElement,
        count: (dateElement.getDay() !== 0 && dateElement.getDay() !== 6) ? Math.floor(Math.random() * 60) : Math.floor(Math.random() * 10)
    };
});

var activityChart = calendarHeatmap()
    .data(activityData)
    .selector('#activity-chart')
    .colorRange(['#D8E6E7', '#ff9429'])
    .tooltipEnabled(true)
    .legendEnabled(false)
    .onClick(function (data) {
        console.log('onClick callback. Data:', data);
    });
activityChart();  // render the chart