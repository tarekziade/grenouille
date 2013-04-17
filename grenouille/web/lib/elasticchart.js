/*
   elasticchart.js

   Provides an ElasticChart class that will draw a Rickshaw chart 
   querying an Elastic Search server.

   ElasticChart options:

   - server: the elastic server full URL
   - start_date: the id of the start date picker
   - end_date: the id of the end date picker
   - container: the id of the chart container
   - field: field to aggregate on
   - aggregation interval (any of: day, week, month, year, hour, minute)

*/
var colors = ["#c05020", "#30c020"];
var one_day = 1000 * 60 * 60 * 24;


function sortbyx(a, b){
  if (a.x > b.x) {
    return 1;
  }
  else if (a.x < b.x) {
    return -1;
  }
  else {
    return 0;
  }
};


$.Class.extend("ElasticChart", {}, {
  init: function(id, server, start_date, end_date, container, field, interval, min, max) {
    this.start_date = '#' + start_date;
    this.end_date = '#' + end_date;
    this._init_datepicker(start_date);
    this._init_datepicker(end_date);
    this.es_server = server;
    this.container = container;
    this.series = [];
    this.yAxis = [];
    this._fields = [];
    this.id = id;
    this.type = 'line';
    this.interval = interval;
    this.field = field;
    this.series = [{color: colors[0], name: field, data: [{x: 0, y: 0 }]}];
    this.min = min;
    this.max = max;
    this.chart = this._getChart();
  },

  _init_datepicker: function(selector) {
    // init the date pickers
    $(selector).datepicker();
    $(selector).datepicker().on('changeDate',
      function(ev) {$(selector).datepicker('hide')});
  },

  draw: function (field, interval) {
    if (field) {
      self.field = field;
    }
    if (interval) {
      self.interval = interval;
    }

    // picking the dates
    var start_date =  $(this.start_date).data('datepicker').date;
    var end_date = $(this.end_date).data('datepicker').date;
    var start_date_str = start_date.toISOString().split("T")[0];
    var end_date_str = end_date.toISOString().split("T")[0];
    var delta = end_date.getTime() - start_date.getTime();

    delta = Math.round(delta / one_day);

    // building the elastic search query
    var match = {'match_all': {}};
    var query = {"query": match,
        "facets": {
            "facet_histo" : {"date_histogram" : {
                "key_field" : "date",
                "value_field": this.field,
                "interval": this.interval},
                "facet_filter": {
                          "range": {"date": {"gte": start_date_str,
                                             "lte": end_date_str}
                          }
                }
            }
        },
        "sort": [{"date": {"order" : "asc"}}],
        "size": 0
    };

    // calling the query asynchronously
    query = JSON.stringify(query);
    this._async(query);

  },

  _async: function (query) {
    var _asyncr = this._async_receive;
    var _chart = this.chart;
    var _fields = this._fields;

    $.ajax({
      type: "POST",
      url: this.es_server,
      contentType: "application/json; charset=utf-8",
      processData: false,
      dataType: "json",
      data: query,
      success: function (json) {_asyncr(json, _chart, _fields)},
      error: function (xhr, textStatus, errorThrown) {
        alert(xhr.responseText);
      },
      failure: function(errMsg) {
        alert(errMsg);
      }
    });
  },

  _async_receive: function(json, chart, fields) {
      var name;
      var data = [];
      var series = chart.series;
       
     // XXX display the day, week or month in the label...
      $.each(json.facets.facet_histo.entries, function(i, item) {
        //var epoch = item.time;
        var date = new Date(item.time);
        // XXX should look at this.interval here 
        // hardcoded on hours for now
        var hour = date.getHours();
        var mean = Number((item.mean).toFixed(2));
        var line = {x: item.time / 1000, y: mean, hour: hour};
        data.push(line);
      });

      data.sort(sortbyx);
      series[0].data = data;
      chart.render();
    },

  _getChart: function () {
    // building the graph instance
    if (this.min) {
      var chart = new Rickshaw.Graph ({
        element: document.getElementById(this.container),
        renderer: this.type,
        series: this.series,
        height: 200,
        min: this.min,
        max: this.max});
    }
    else {
      var chart = new Rickshaw.Graph ({
        element: document.getElementById(this.container),
        renderer: this.type,
        series: this.series,
        height: 200});
    }

    var axes = new Rickshaw.Graph.Axis.Time( {
      graph:chart
    } );
    axes.render();

    // hover window
    var hoverDetail = new Rickshaw.Graph.HoverDetail( {
      graph: chart,
        formatter: function(series, x, y) {
          var cdate = new Date(x*1000);
          var hour = '<span class="hour">' + cdate.toUTCString() + '</span>';
          var swatch = '<span class="detail_swatch" style="background-color: '
      + series.color + '"></span>';
      var content = swatch + y + '<br>' + hour;
      return content;
        }
    });

    // legend
    var y_ticks = new Rickshaw.Graph.Axis.Y( {
      graph: chart,
        orientation: 'left',
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        element: document.getElementById('y_axis-' + this.id ),
    } );

    return chart;
   }
 }
);
