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
        getSQL();
    });
});



// call Flask API endpoint
function getSQL() {
    
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

    // Create the payload
    var payload = {
        "metric": metric,
        "state_code": state_code,
        "min_date": min_date,
        "max_date": max_date
    };

    // Perform a POST request to the query URL
    $.ajax({
        type: "POST",
        url: "/getSQL",
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ "data": payload }),
        success: function(returnedData) {
            // print it
            console.log(returnedData);
            renderTable(returnedData, scale);
            // metric = ""
            

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });

}

function renderTable(inp_data, scale) {
    // init html string
    let html = "";

    // destroy datatable
    $('#sql_table').DataTable().clear().destroy();

    // loop through all rows
    inp_data.forEach(function(row) {
        html += "<tr>";

        // loop through each cell (order matters)
        html += `<td>${row.state_name}</td>`;
        html += `<td>${row.date}</td>`;

        // Convert to F if selected
        if (scale == "fahrenheit") {
            html += `<td>${Math.round((row.value * 9 / 5 + 32)*100)/100}</td>`;
        } else {
            html += `<td>${Math.round((row.value)*100)/100}</td>`;
        }

        // close the row
        html += "</tr>";
    });

    // shove the html in our elements
    console.log(html);
    $("#sql_table tbody").html("");
    $("#sql_table tbody").append(html);

    // remake data table
    $('#sql_table').DataTable({searching: false, info: false});
}