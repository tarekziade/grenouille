

var temp = new GrenouilleAggregate("temp",
                        "http://0.0.0.0:9901/weather/_search",
                        "#startdate",
                        "#enddate",
                        "chart-temp",
                        "Temperature",
                        "temperature",
                        "hour");

temp.draw();

var hum = new GrenouilleAggregate("hum",
                        "http://0.0.0.0:9901/weather/_search",
                        "#startdate",
                        "#enddate",
                        "chart-hum",
                        "Humidity",
                        "humidity",
                        "hour");

hum.draw();

var press = new GrenouilleAggregate("press",
                        "http://0.0.0.0:9901/weather/_search",
                        "#startdate",
                        "#enddate",
                        "chart-press",
                        "Pressure",
                        "pressure",
                        "hour");

press.draw();

$('#startdate').datepicker();
$('#startdate').datepicker().on('changeDate',
      function(ev) {$('#startdate').datepicker('hide')});

$('#enddate').datepicker();
$('#enddate').datepicker().on('changeDate',
      function(ev) {$('#enddate').datepicker('hide')});

function refreshChart() {
  temp.draw(); 
  hum.draw();
  press.draw();
}
