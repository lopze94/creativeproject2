/*var numberOfFields = 0;

$('#addStock').click(function(e) {
  e.preventDefault();
  //Get input field value
  var tempVal = $('#stockInput').val();
  if (tempVal !== "") {
    //console.log("Value" + numberOfFields + ": \"" + tempVal + "\"");
    var currHTML = $('#inputFields').html();
    var newField = "<input id=\"stockInput" + numberOfFields + "\" type=\"text\" class=\"stockText\" value=\"" + tempVal + "\"></input>\n";
    var removeButton = $("<input type=\"button\" class=\"remove\" value=\"-\" />");
        removeButton.click(function() {
            $(this).parent().remove();
        });
    if (currHTML == ""){
      currHTML += newField + removeButton;
    } else {
      currHTML += "<br>" + newField + removeButton;
    }
    $('#inputFields').html(currHTML);
    numberOfFields++;
    $('#stockInput').val("");
  } else {
    //console.log("Input field is empty");
    return 0;
  }


});*/

$(document).ready(function() {
  $("#buildyourform").hide();
});

$(document).keypress(function(e) {
  var tempSymbol = $("#stockInput").val();
  if (e.which == 13 && tempSymbol !== "") {
    checkEmpty();
  }
});

$("#addStock").click(function(e) {
  e.preventDefault();
  checkEmpty();

});

$("#stockClear").click(function(e) {
  e.preventDefault();
  $("#yourform").remove();
  $("#buildyourform").html("<legend>Stock Symbols Added</legend>");
  $("#buildyourform").hide();
  $("#stockResults").html('');

});

function checkEmpty(tempSymbol) {
  $("#warn").remove();

  var tempSymbol = $("#stockInput").val();
  if (tempSymbol !== "") {
    addToField(tempSymbol);
    $("#buildyourform").append('<p id=\"warn\">Submit to get results (ctrl + Enter)</p>');
    $("#stockInput").val('');
  } else {
    //console.log("Input field is empty");
  }
}

function addToField(tempSymbol) {
  $("#buildyourform").show();
  var lastField = $("#buildyourform div:last");
  var intId = (lastField && lastField.length && lastField.data("idx") + 1) || 1;
  var fieldWrapper = $("<div class=\"fieldwrapper\" id=\"field" + intId + "\"/>");
  fieldWrapper.data("idx", intId);
  var symbolStr = "<input id=\"stockAdded\" type=\"text\" class=\"fieldname\" value=\"" + tempSymbol + "\"/>";
  var stockSymbol = $(symbolStr);
  var removeButton = $("<input id=\"removeStock\" type=\"button\" class=\"remove\" value=\"-\" />");
  removeButton.click(function() {
    $(this).parent().remove();
  });
  fieldWrapper.append(stockSymbol);
  fieldWrapper.append(removeButton);
  $("#buildyourform").append(fieldWrapper);
}

$('#stockInput').keydown(function(e) {

  if (e.ctrlKey && e.keyCode == 13) {
    // Ctrl-Enter pressed
    submitStocks();

  }
});



$("#stockSubmit").click(function(e) {
  e.preventDefault();
  submitStocks();

});

function submitStocks() {
  var stocksArray = [];
  $("#yourform").remove();
  var fieldSet = $("<fieldset id=\"yourform\"><legend>Your Stock Symbols</legend></fieldset>");
  $("#buildyourform div").each(function() {
    var id = "input" + $(this).attr("id").replace("field", "");
    //console.log(id);
    //console.log($(this));
    var str = $(this).find("input.fieldname").first().val();
    //console.log(str);
    var label = "";
    if (str !== "" || str != typeof undefined) {
      stocksArray.push(str);
      //console.log("Pushed " +str);
      label = $("<label for=\"" + id + "\"><h2>" + str + "</h2></label><br>");
    } else {
      $(this).find("input.fieldname").first().parent().remove();
      //console.log("Input field is empty");
    }
    //   fieldSet.append(label);
  });
  //  $("body").append(fieldSet);
  //console.log(stocksArray);
  stockAPI(stocksArray);
}

function stockAPI(stocksArray) {
  $("#stockResults").html('');
  var str = "";
  for (var i = 0; i < stocksArray.length; i++) {
    if (i < (stocksArray.length - 1)) {
      str += stocksArray[i] + ",";
    } else {
      str += stocksArray[i];
    }
  }

  var myurl = "https://api.iextrading.com/1.0/stock/market/batch?symbols=" + str + "&types=quote&range=1m&last=1";
  $.ajax({
    url: myurl,
    dataType: "json",
    success: function(json) {
      //console.log(json);
      var pWarn = 'Price refers to the 15 minute delayed market price';
      $("#warn").remove();
      $("#buildyourform").append('<p id=\"warn\">' + pWarn + '</p>');
  //    $("#stockResults").append('<div id="stocksInfo" class="stocksInfo">\n');
      for (var i = 0; i < stocksArray.length; i++) {
        var tempName = stocksArray[i];
        var toStr = tempName.toString();
        var toUpper = toStr.toUpperCase();
        //console.log('UPPER: ' + toUpper);
        var compName = json[toUpper].quote.companyName;
        var openPrice = json[toUpper].quote.close;
        var closePrice = json[toUpper].quote.open;
        var delPrice = json[toUpper].quote.delayedPrice;
        //var  = json[toUpper].quote.companyName;
        var results = '<h2>' + compName + '</h2>\n';
        results += '<div class=\"openP\">&nbspOPEN&emsp;&emsp;&emsp;USD&emsp;&emsp;&emsp;';
        results += openPrice + '</div><div class=\"closeP\">CLOSE&emsp;&emsp;&emsp;USD&emsp;&emsp;&emsp;';
        results += closePrice + '</div><div class=\"price\">&nbspPRICE&emsp;&emsp;&emsp;USD&emsp;&emsp;&emsp;' + delPrice + '</div>\n';
        $("#stockResults").append(results);

      }
    //  $("#stockResults").append('\n</div>');

    }
  });
}
