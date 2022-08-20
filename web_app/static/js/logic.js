$(document).ready(function() {
    console.log("Page Loaded");

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


// call Flask API endpoint
function makePredictions() {
    var metric = $("#metric").val();
    var state_code = $("#state_code").val();
    
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

    // check if inputs are valid

    // create the payload
    var payload = {
        "metric": metric,
        "state_code": state_code,
        "year": year,
        "month": month,
        "day": day
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

            $("#output").text(predicted_value);

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });

}