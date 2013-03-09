

var temp = new MonolithAggregate("temp",
                        "http://0.0.0.0:9901/weather/_search",
                        "#startdate-temp",
                        "#enddate-temp",
                        "chart-temp",
                        "Temperature",
                        "temperature",
                        "hour");

temp.draw();

var hum = new MonolithAggregate("hum",
                        "http://0.0.0.0:9901/weather/_search",
                        "#startdate-hum",
                        "#enddate-hum",
                        "chart-hum",
                        "Humidity",
                        "humidity",
                        "hour");

hum.draw();

var press = new MonolithAggregate("press",
                        "http://0.0.0.0:9901/weather/_search",
                        "#startdate-press",
                        "#enddate-press",
                        "chart-press",
                        "Pressure",
                        "pressure",
                        "hour");

press.draw();
