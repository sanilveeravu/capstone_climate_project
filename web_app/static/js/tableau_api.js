var viz;

$(document).ready(function() {
    
    var url = ""
    if (document.URL.slice(-3) == "one") {
        url = "https://public.tableau.com/views/FinalProject7_16613026204870/Dashboard1?:language=en-US&:display_count=n&:origin=viz_share_link";
      } else {
        url = "https://public.tableau.com/views/FinalProject7_2/Dashboard2?:language=en-US&publish=yes&:display_count=n&:origin=viz_share_link";
      }
    
    initializeViz(url);

    $("#pdf").click(function() {
        exportPDF();
    });
    $("#image").click(function() {
        exportImage();
    });
    $("#crosstab").click(function() {
        exportCrossTab();
    });
    $("#data").click(function() {
        exportData();
    });
    $("#revert").click(function() {
        revertAll();
    });
});

function initializeViz(url) {
    var placeholderDiv = document.getElementById("tableauViz");
    // var url = "https://public.tableau.com/views/FinalProject7_16613026204870/Dashboard1?:language=en-US&:display_count=n&:origin=viz_share_link";
    // https://public.tableau.com/views/Snowfall_16608483903850/Snow?:language=en-US&:display_count=n&:origin=viz_share_link <-- Amer's Dashboard link
    var options = {
        width: placeholderDiv.offsetWidth,
        height: placeholderDiv.offsetHeight,
        hideTabs: true,
        hideToolbar: true,
        onFirstInteractive: function() {
            workbook = viz.getWorkbook();
            activeSheet = workbook.getActiveSheet();
        }
    };
    viz = new tableau.Viz(placeholderDiv, url, options);
}

function exportPDF() {
    viz.showExportPDFDialog();
}

function exportImage() {
    viz.showExportImageDialog();
}

function exportCrossTab() {
    viz.showExportCrossTabDialog();
}

function exportData() {
    viz.showExportDataDialog();
}

function revertAll() {
    workbook.revertAllAsync();
}