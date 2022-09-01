$(document).ready(function() {
    console.log("Page Loaded");
    $.noConflict();

    var field = document.querySelector('#select_min_date');
    var curr_date = new Date();
    field.value = (curr_date.getFullYear() - 20).toString() + '-' + (curr_date.getMonth() + 1).toString().padStart(2, 0) +
    '-' + curr_date.getDate().toString().padStart(2, 0);

    var field = document.querySelector('#select_max_date');
    var curr_date = new Date();
    field.value = (curr_date.getFullYear() - 1).toString() + '-' + (curr_date.getMonth() + 1).toString().padStart(2, 0) +
    '-' + curr_date.getDate().toString().padStart(2, 0);


    var select_state = document.getElementById("state_code");
    
    $.ajax({
        type: "GET",
        url: "/get_states",
        contentType: 'application/json;charset=UTF-8',
        success: function(returnedStates) {
            var states_parsed = $.parseJSON(returnedStates);
            for (var name in states_parsed.state_name) {
                //console.log(name + "=" + states_parsed.state_name[name]);
                var el = document.createElement("option");
                el.textContent = name + " - " + states_parsed.state_name[name];
                el.value = name;
                select_state.appendChild(el);
            }

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });

    $("#filter").click(function() {
        // alert("button clicked!");
        // $.noConflict();
        getSQLGraph();
    });
});



// call Flask API endpoint
function getSQLGraph() {
    
    // Retrieve and format all four metrics
    var metric = $("#metric").val();
    var metric_2 = $("#metric_2").val();
    var state_code =  $("#state_code").val();
    var scale = $("#scale").val();

    function format_date(d) {
        return (d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2));   
      } 

    var min_date = format_date(new Date($('#select_min_date').val()));
    var max_date = format_date(new Date($('#select_max_date').val()));


    console.log("metric:"+metric)
    console.log("metric_2:"+metric_2)

    console.log("state_code"+state_code)
    console.log("min_date: "+min_date)
    console.log("max_date: "+max_date)
    console.log("scale:"+scale)

    // Create the payload
    var payload = {
        "metric": metric,
        "metric_2": metric_2,
        "state_code": state_code,
        "min_date": min_date,
        "max_date": max_date,
        "scale": scale
    };

    // Perform a POST request to the query URL
    $.ajax({
        type: "POST",
        url: "/getSQLGraph",
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ "data": payload }),
        success: function(returnedData) {
            // print it
            console.log(returnedData);
            makeGraph(returnedData,metric,metric_2,state_code);
            // metric = ""
            

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });

}

function makeGraph(inp_data,metric,metric_2,state_code) {

    if (metric == "TMAX"){
        dynamic_title = "Temperature Max"
        color = "firebrick"
    }
    else if (metric == "TMIN"){
        dynamic_title = "Temperature Min"
        color = "darkslateblue"
    }
    else if (metric == "PRCP"){
        dynamic_title = "Precipitation"
        color = "steelblue"
    } 
    else if (metric == "SNOW"){
        dynamic_title = "Snowfall"
        color = "lightblue"
    }


    if (metric_2 == "TMAX"){
        dynamic_title_2 = "Temperature Max"
        color_2 = "firebrick"
    }
    else if (metric_2 == "TMIN"){
        dynamic_title_2 = "Temperature Min"
        color_2 = "darkslateblue"
    }
    else if (metric_2 == "PRCP"){
        dynamic_title_2 = "Precipitation"
        color_2 = "steelblue"
    } 
    else if (metric_2 == "SNOW"){
        dynamic_title_2 = "Snowfall"
        color_2 = "lightblue"
    }

    var trace1 = {
        x: inp_data.map(x => x.date),
        y: inp_data.map(x => x.value_x),
        type: 'line',
        marker: {
            "color": color
        },
        name: metric
    };

    var trace2 = {
        x: inp_data.map(x => x.date),
        y: inp_data.map(x => x.value_y),
        type: 'line',
        yaxis: 'y2',
        marker: {
            "color": color_2
        },
        name: metric_2
    };

    // var trace2 = {
    //     x: inp_data.map(x => x.date),
    //     y: inp_data.map(x => x.predicted),
    //     type: 'line',
    //     marker: {
    //         "color": "firebrick"
    //     },
    //     name: "Predicted"
    // };



    var data = [trace1, trace2];
    var layout = {
        width: 1250,
        height: 500,
        margin: {
          l: 50,
          r: 50,
          b: 100,
          t: 100,
          pad: 4
        },
        title: dynamic_title + " vs " + dynamic_title_2,
        xaxis: { "title": "Date" },
        yaxis: { "title": dynamic_title },
        yaxis2: {
            title: dynamic_title_2,
            // titlefont: {color: 'rgb(148, 103, 189)'},
            // tickfont: {color: 'rgb(148, 103, 189)'},
            overlaying: 'y',
            side: 'right'
          }
    };

    Plotly.newPlot('linegraph', data, layout);
}

