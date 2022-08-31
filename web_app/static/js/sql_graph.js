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
    var state_code =  $("#state_code").val();
    var scale = $("#scale").val();

    function format_date(d) {
        return (d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2));   
      } 

    var min_date = format_date(new Date($('#select_min_date').val()));
    var max_date = format_date(new Date($('#select_max_date').val()));


    console.log("metric:"+metric)
    console.log("state_code"+state_code)
    console.log("min_date: "+min_date)
    console.log("max_date: "+max_date)
    console.log("scale:"+scale)

    // Create the payload
    var payload = {
        "metric": metric,
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
            makeGraph(returnedData,metric,state_code);
            // metric = ""
            

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });

}

function makeGraph(inp_data,metric,state_code) {
    var trace1 = {
        x: inp_data.map(x => x.date),
        y: inp_data.map(x => x.value),
        type: 'line',
        marker: {
            "color": "steelblue"
        },
        name: "Actual"
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


    if (metric == "TMAX"){
        dynamic_title = "Temperature Max"
    }
    else if (metric == "TMIN"){
        dynamic_title = "Temperature Min"
    }
    else if (metric == "PRCP"){
        dynamic_title = "Precipitation"
    } 
    else if (metric == "SNOW"){
        dynamic_title = "Snowfall"
    }

    var data = [trace1];
    var layout = {
        title: dynamic_title,
        xaxis: { "title": "Date" },
        yaxis: { "title": metric }
    };

    Plotly.newPlot('linegraph', data, layout);
}

