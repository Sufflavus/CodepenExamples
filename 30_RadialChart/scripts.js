var lifeAreas = ["Career", "Spirituality", "Finance", "Fun", "Health", "Relationships"];
var rates = ["0-5", "6-10", "11-15"];

var data = [{
  name: "Ammy",
  points: [{
    area: "Career",
    value: 8,
  }, {
    area: "Spirituality",
    value: 3,
  }, {
    area: "Finance",
    value: 7,
  }, {
    area: "Fun",
    value: 12,
  }, {
    area: "Health",
    value: 5,
  }, {
    area: "Relationships",
    value: 7,
  }]
}, {
  name: "Bob",
  points: [{
    area: "Career",
    value: 12,
  }, {
    area: "Spirituality",
    value: 5,
  }, {
    area: "Finance",
    value: 10,
  }, {
    area: "Fun",
    value: 3,
  }, {
    area: "Health",
    value: 7,
  }, {
    area: "Relationships",
    value: 2,
  }]
}];

Highcharts.theme = {
  colors: ['#95C471', '#35729E', '#251735', '#F3E796'],

  colorAxis: {
    maxColor: '#05426E',
    minColor: '#F3E796'
  },

  plotOptions: {
    map: {
      nullColor: '#fcfefe'
    }
  },

  navigator: {
    maskFill: 'rgba(170, 205, 170, 0.5)',
    series: {
      color: '#95C471',
      lineColor: '#35729E'
    }
  }
};

Highcharts.setOptions(Highcharts.theme);
      
Highcharts.chart('container', {
  chart: {
    type: 'column',
    polar: true,
    backgroundColor: 'transparent',
    spacingTop: 40,     
    spacingBottom: 0,   
  },
  title: {
    text: null
  },
  subTitle: {
    text: null
  },
  pane: {
    startAngle: -90,
    endAngle: 90,
    center: ['50%', '100%'],
    size: '200%',
    background: {
      backgroundColor: '#FFFFFF',
      borderColor: "transparent",
      borderWidth: 0,
      innerRadius: "0",
      outerRadius: "100%"
    }
  },
  legend: {
    enabled: false
  },
  xAxis: {
    type: 'category',
    categories: lifeAreas,
    lineColor: 'transparent',
    lineWidth: 0,
    min: 0,
    max: 6,       
    reversed: true,
    title: {
      text: null
    },
    labels: {
      rotation: 'auto',
      align: "center",
    },
    tickmarkPlacement: "between"
  },

  yAxis: [{
    min: 0,
    max: 3,
    tickPositions: [0, 1, 2, 3],
    labels: {            
      align: "left", 
      x: -110,           
      formatter: function() {
        return rates[this.value];
      }
    },
  }, {
    min: 0,
    max: 3,
    endOnTick: true,
    tickPositions: [0, 1, 2, 3],
    labels: {            
      align: "right", 
      x: 470, 
      formatter: function() {
        return rates[this.value];
      }
    },
    reversed: true
  }],
  plotOptions: {
  },
  series: data.map(function(person) {
      return {
        name: person.name,
        data: person.points.map(function(point) {
          return {
            x: lifeAreas.indexOf(point.area),
            y: point.value/5
          };
        })
      };
    })
});