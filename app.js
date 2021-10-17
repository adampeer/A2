// 1. Map
let clientWidth = document.getElementById('map-area').clientWidth;
let clientHeight = document.getElementById('map-vega-lite').clientHeight;

var vg_data = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    "url": "https://raw.githubusercontent.com/adampeer/Choropleth-Map/main/Tourist-Arrival-by-Country-of-Residence.csv"
  },
  "background": "transparent",
  "vconcat": [
    {
      "width": clientWidth - 90,
      "height": 500,
      "projection": {
        "type": "equalEarth"
      },
      "layer": [
        {
          "data": {
            "url": "https://raw.githubusercontent.com/KaneSec/vega_lite/main/2_symbol_map/js/ne_110m_admin_0_countries.topojson",
            "format": {
              "type": "topojson",
              "feature": "ne_110m_admin_0_countries"
            }
          },
          "transform": [
            {
              "calculate": "'Data is not available in ' + datum.properties.NAME",
              "as": "note"
            }
          ],
          "mark": {
            "type": "geoshape",
            "fill": "#ddd",
            "stroke": "#E8F6EF",
            "strokeWidth": 1
          },
          "encoding": {
            "tooltip": {
              "field": "note"
            }
          }
        },
        {
          "transform": [
            {
              "filter": {
                "param": "time_brush"
              }
            },
            {
              "aggregate": [
                {
                  "op": "sum",
                  "field": "Number",
                  "as": "sum_Number"
                }
              ],
              "groupby": [
                "Country"
              ]
            },
            {
              "lookup": "Country",
              "from": {
                "data": {
                  "url": "https://raw.githubusercontent.com/KaneSec/vega_lite/main/2_symbol_map/js/ne_110m_admin_0_countries.topojson",
                  "format": {
                    "type": "topojson",
                    "feature": "ne_110m_admin_0_countries"
                  }
                },
                "key": "properties.NAME"
              },
              "as": "geo"
            }
          ],
          "mark": {
            "type": "geoshape",
            "stroke": "#fff",
            "strokeWidth": 0.5
          },
          "encoding": {
            "shape": {
              "field": "geo",
              "type": "geojson"
            },
            "color": {
              "field": "sum_Number",
              "type": "quantitative",
              "legend": {
                "title": "Total Number of Tourist"
              },
              "scale": {
                "type": "threshold",
                "domain": [
                  1000,
                  5000,
                  10000,
                  100000,
                  1000000,
                  1500000
                ],
                "range": [
                  "#d0d1e6",
                  "#a6bddb",
                  "#74a9cf",
                  "#2b8cbe",
                  "#045a8d",
                  "#084594"
                ]
              }
            },
            "tooltip": [
              {
                "field": "Country",
                "type": "nominal",
                "title": "Country/Region"
              },
              {
                "field": "sum_Number",
                "type": "quantitative",
                "title": "Total Tourists",
                "format": ","
              }
            ]
          }
        }
      ]
    },
    {
      "width": clientWidth * 0.9,
      "height": 100,
      "params": [
        {
          "name": "time_brush",
          "select": {
            "type": "interval",
            "encodings": [
              "x"
            ]
          }
        }
      ],
      "mark": {
        "type": "line"
      },
      "encoding": {
        "x": {
          "timeUnit": "year",
          "field": "Year",
          "type": "temporal",
          "axis": {
            "title": "Year",
            "format": "%Y",
            "tickCount": {
              "interval": "year",
              "step": 1
            },
            "gridOpacity": 0.5
          }
        },
        "y": {
          "field": "Number",
          "aggregate": "sum",
          "axis": {
            "tickCount": 4,
            "title": "Total Number of Tourist Arrival",
            "gridOpacity": 0.5
          },
          "scale": {
            "domain": [
              900000,
              1500000
            ]
          }
        }
      }
    }
  ],
  "config": {
    "view": {
      "stroke": "transparent"
    },
    "legend": {
      "gradientLength": 500,
      "orient": "bottom",
      "layout": {
        "bottom": {
          "anchor": "middle"
        }
      }
    }
  }
}

vegaEmbed('#map-vega-lite', vg_data, {
  "actions": false
});

// 4. Expenditure

let viz_exp_cat = 'exp-cat.vl.json';

vegaEmbed('#exp-vega-lite-1', viz_exp_cat, { "actions": false }).then(function (result) {

}).catch(console.error);

let viz_exp_coun = 'exp-coun.vl.json';

vegaEmbed('#exp-vega-lite-2', viz_exp_coun, { "actions": false }).then(function (result) {

}).catch(console.error);

// 5. Covid Impact
let viz_line = 'covid-impact.vl.json';

vegaEmbed('#covid-impact-vega-lite', viz_line, { "actions": false }).then(function (result) {

}).catch(console.error);

$('.country-icon').click(function () {
  $(this).toggleClass('selected');
});


(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-scale')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-scale'], factory) :
      (factory(global.d3 = global.d3 || {}, global.d3));
}(this, function (exports, d3Scale) {
  'use strict';

  function square (x) {
    return x * x;
  }

  function radial () {
    let linear = d3Scale.scaleLinear();

    function scale (x) {
      return Math.sqrt(linear(x));
    }

    scale.domain = function (_) {
      return arguments.length ? (linear.domain(_), scale) : linear.domain();
    };

    scale.nice = function (count) {
      return (linear.nice(count), scale);
    };

    scale.range = function (_) {
      return arguments.length ? (linear.range(_.map(square)), scale) : linear.range().map(Math.sqrt);
    };

    scale.ticks = linear.ticks;
    scale.tickFormat = linear.tickFormat;

    return scale;
  }

  exports.scaleRadial = radial;

  Object.defineProperty(exports, '__esModule', { value: true });
}));

// Stacked Bar Chart

let svg = d3.select('#chart-peak-season-d3js');
let width = +svg.attr('width');
let height = +svg.attr('height');
let innerRadius = 180;
let outerRadius = Math.min(width, height) / 2;
let g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

let x = d3.scaleBand()
  .range([0, 2 * Math.PI])
  .align(0);

let y = d3.scaleRadial()
  .range([innerRadius, outerRadius]);

let z = d3.scaleOrdinal()
  .range(['#226B73', '#5D9EA6', '#D9BDAD', '#E0C9B9', '#F2E4D8']);

d3.csv('Peak-Season-Month-5-Years.csv', function (d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function (error, data) {
  if (error) throw error;

  x.domain(data.map(function (d) { return d.Month; }));
  y.domain([0, d3.max(data, function (d) { return d.total; })]);
  z.domain(data.columns.slice(1));

  // ----------------
  // Create a tooltip
  // ----------------
  var tooltip = d3.select("#peak-season-d3js")
    .append("div")
    .style("width", "auto")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
    var subgroupName = d3.select(this.parentNode).datum().key;
    var subgroupValue = d.data[subgroupName];
    tooltip
      .html("Year: " + subgroupName + "<br>" + "Number of tourists: " + subgroupValue)
      .style("opacity", 1)
  }
  var mousemove = function (d) {
    tooltip
      .style("left", (d3.mouse(this)[0] + 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }

  var mouseleave = function (d) {
    tooltip
      .style("opacity", 0);
  }

  g.append('g')
    .selectAll('g')
    .data(d3.stack().keys(data.columns.slice(1))(data))
    .enter().append('g')
    .attr('fill', function (d) { return z(d.key); })
    .selectAll('path')
    .data(function (d) { return d; })
    .enter().append('path')
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .attr('d', d3.arc()
      .innerRadius(function (d) { return y(d[0]); })
      .outerRadius(function (d) { return y(d[1]); })
      .startAngle(function (d) { return x(d.data.Month); })
      .endAngle(function (d) { return x(d.data.Month) + x.bandwidth(); })
      .padAngle(0.015)
      .padRadius(innerRadius));

  let label = g.append('g')
    .selectAll('g')
    .data(data)
    .enter().append('g')
    .attr('text-anchor', 'middle')
    .attr('transform', function (d) { return 'rotate(' + ((x(d.Month) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ')translate(' + innerRadius + ',0)'; });

  label.append('line')
    .attr('x2', -5)
    .attr('stroke', '#000');

  label.append('text')
    .attr('transform', function (d) { return (x(d.Month) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? 'rotate(90)translate(0,16)' : 'rotate(-90)translate(0,-9)'; })
    .text(function (d) { return d.Month; });

  let yAxis = g.append('g')
    .attr('text-anchor', 'middle');

  let yTick = yAxis
    .selectAll('g')
    .data(y.ticks(5).slice(1))
    .enter().append('g');

  yTick.append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'none')
    .attr('r', y);

  yTick.append('text')
    .attr('y', function (d) { return -y(d); })
    .attr('dy', '0.35em')
    .attr('fill', 'none')
    .attr('stroke', '#fff')
    .attr('stroke-width', 5)
    .text(y.tickFormat(5, 's'));

  yTick.append('text')
    .attr('y', function (d) { return -y(d); })
    .attr('dy', '0.35em')
    .text(y.tickFormat(5, 's'));

  yAxis.append('text')
    .attr('y', function (d) { return -y(y.ticks(5).pop()); })
    .attr('dy', '-1em')
    .text('Total Number of Tourists per Month');

  let legend = g.append('g')
    .selectAll('g')
    .data(data.columns.slice(1).reverse())
    .enter().append('g')
    .attr('transform', function (d, i) { return 'translate(-40,' + (i - (data.columns.length - 1) / 2) * 20 + ')'; });

  legend.append('rect')
    .attr('width', 18)
    .attr('height', 18)
    .attr('fill', z);

  legend.append('text')
    .attr('x', 24)
    .attr('y', 9)
    .attr('dy', '0.35em')
    .text(function (d) { return d; });
});