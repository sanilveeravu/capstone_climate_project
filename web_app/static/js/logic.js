$(document).ready(function() {
    console.log("Page Loaded");

    $("#filter").click(function() {
        // alert("button clicked!");
        makePredictions();
    });
});


// call Flask API endpoint
function makePredictions() {
    var metric = $("#metric").val();
    var state_code = $("#state_code").val();
    var year = $("#year").val();
    var month = $("#month").val();
    var day = $("#day").val();


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