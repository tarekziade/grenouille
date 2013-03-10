

var temp = new GrenouilleAggregate("temp",
                        "http://0.0.0.0:9901/weather/_search",
                        "#startdate",
                        "#enddate",
                        "chart-temp",
                        "Temperature",
                        "temperature",
                        "hour");


var hum = new GrenouilleAggregate("hum",
                        "http://0.0.0.0:9901/weather/_search",
                        "#startdate",
                        "#enddate",
                        "chart-hum",
                        "Humidity",
                        "humidity",
                        "hour");


var press = new GrenouilleAggregate("press",
                        "http://0.0.0.0:9901/weather/_search",
                        "#startdate",
                        "#enddate",
                        "chart-press",
                        "Pressure",
                        "pressure",
                        "hour");


function setDates() {

  var today = new Date();
  var _7daysago = new Date();
  _7daysago.setDate(today.getDate() - 7);
  $('#startdate').datepicker();
  $('#startdate').datepicker('setValue', _7daysago);
  $('#startdate').datepicker().on('changeDate',
        function(ev) {$('#startdate').datepicker('hide')});

  $('#enddate').datepicker();
  $('#enddate').datepicker('setValue', today);
  $('#enddate').datepicker().on('changeDate',
        function(ev) {$('#enddate').datepicker('hide')});
}


function initCharts() {
  setDates();
  refreshCharts();
};

function refreshCharts() {
  temp.draw(); 
  hum.draw();
  press.draw();
}

initCharts();
