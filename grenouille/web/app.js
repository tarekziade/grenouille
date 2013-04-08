
/*
     defining three Charts.  
*/ 

var temp = new ElasticChart("temp",
                        "http://0.0.0.0:9901/weather/_search",
                        "startdate",
                        "enddate",
                        "chart-temp",
                        "temperature",
                        "hour");


var hum = new ElasticChart("hum",
                        "http://0.0.0.0:9901/weather/_search",
                        "startdate",
                        "enddate",
                        "chart-hum",
                        "humidity",
                        "hour");


var press = new ElasticChart("press",
                        "http://0.0.0.0:9901/weather/_search",
                        "startdate",
                        "enddate",
                        "chart-press",
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
