$(document).ready(function() {
    console.log("Page Loaded");

    var field = document.querySelector('#select_date');
    var curr_date = new Date();
    field.value = curr_date.getFullYear().toString() + '-' + (curr_date.getMonth() + 1).toString().padStart(2, 0) +
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
        makePredictions();
    });
});

function convertToFahrenheit(temp){
    return Math.round(((temp * 1.8) + 32) * 10) / 10
}

// call Flask API endpoint
function makePredictions() {
    var metric = $("#metric").val();
    var state_code = $("#state_code").val();
    var scale = $("#scale").val();
    
    var date = new Date($('#select_date').val());
    var day = date.getUTCDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    
    // var year = $("#year").val();
    // var month = $("#month").val();
    // var day = $("#day").val();

    console.log("metric:"+metric)
    console.log("state_code"+state_code)
    console.log("year"+year)
    console.log("month"+month)
    console.log("day"+day)
    console.log("scale:"+scale)

    // check if inputs are valid

    // create the payload
    var payload = {
        "metric": metric,
        "state_code": state_code,
        "year": year,
        "month": month,
        "day": day,
        "scale": scale
    }



    // Perform a POST request to the query URL
    $.ajax({
        type: "POST",
        url: "/makePredictions",
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ "data": payload }),
        success: function(returnedData) {
            // print it
            console.log(returnedData);

            predicted_value = returnedData["prediction"]
            actual_value = returnedData["actual"]
            graph_data = returnedData["graph_data"]
            // if (scale === "fahrenheit") {
            //     actual_value=convertToFahrenheit(actual_value)
            //     predicted_value=convertToFahrenheit(predicted_value)

            // }  
            makeGraph(graph_data)


            $("#output").text("Actual: " + actual_value + "     ,     Predicted: " + predicted_value)

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });

}

function makeGraph(inp_data) {
    var trace1 = {
        x: inp_data.map(x => x.date),
        y: inp_data.map(x => x.actual),
        type: 'line',
        marker: {
            "color": "steelblue"
        },
        name: "Actual"
    };

    var trace2 = {
        x: inp_data.map(x => x.date),
        y: inp_data.map(x => x.predicted),
        type: 'line',
        marker: {
            "color": "firebrick"
        },
        name: "Predicted"
    };

    var data = [trace1, trace2];
    var layout = {
        title: 'Predicted vs Actual',
        xaxis: { "title": "Date" },
        yaxis: { "title": "Metric Value" }
    };

    Plotly.newPlot('linegraph', data, layout);
}