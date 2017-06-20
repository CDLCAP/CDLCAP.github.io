/*
function onLoadTxtArea() {
  var fileName = getParam('ex');
  var fileType = getParam('type');
  var fileOptions = getParam('options');
  if (fileName != "0") {
    var fileLocation = (fileType == "ss")?"src/hip/":"src/sleek/";
    var filePath = fileLocation + fileName + "." + fileType;
    loadFile(filePath);
  } else {
    var txtArea = document.getElementById('program_container')
      || document.getElementById('program_container');
    txtArea.value = "// Enter your own example here.";
  }
  var nameField = document.getElementById('program_name')
    || document.getElementById('program_name');
  nameField.value = fileName;
  var typeField = document.getElementById('program_type')
    || document.getElementById('program_type');
  typeField.value = fileType;
  var optionsField = document.getElementById('program_options')
    || document.getElementById('program_options');
  optionsField.value = fileOptions;
  var resultFrame = window;
        resultFrame.location.href='result.html';
  editAreaLoader.init({
    id: "program_container"   
    ,allow_resize: "both"
    ,word_wrap: true
    ,syntax: "cpp"  
  });
} 
*/

function getParam(name) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

function loadFileResult(fileLocation,container) {
  var srcFile = new XMLHttpRequest();
  srcFile.open("GET", fileLocation, true);
  srcFile.onreadystatechange = function() {
    if (srcFile.readyState === 4) {  
      if (srcFile.status === 200) {  
        allText = srcFile.responseText; 
        var txtArea = window.document.getElementById(container); 
        //parent.frames['inference_frame'].document.getElementById('program_container')
        //|| parent.document.getElementById('inference_frame').contentDocument.getElementById('program_container')
        //|| parent.document.getElementById('program_container'); 
        var lines = populateTable(allText); 
        var noRows = 16;
        if ((lines * 2 > 16)) noRows = lines * 2;
        if ((lines * 2 > 30)) noRows = 30;
        txtArea.rows = noRows;
        txtArea.value = allText;
      }
    }
  }
  srcFile.send(null);
}

function loadFile(fileLocation,container) {
  var srcFile = new XMLHttpRequest();
  srcFile.open("GET", fileLocation, true);
  srcFile.onreadystatechange = function() {
    if (srcFile.readyState === 4) {  
      if (srcFile.status === 200) {  
        allText = srcFile.responseText; 
        var txtArea = window.document.getElementById(container); 
        /* parent.frames['inference_frame'].document.getElementById('program_container')
        || parent.document.getElementById('inference_frame').contentDocument.getElementById('program_container')
        || parent.document.getElementById('program_container'); */
        txtArea.value = allText;  
        //window.alert("sometext");
        var textHeight = txtArea.value.offsetHeight;
        var myCodeMirror = CodeMirror.fromTextArea(txtArea, {lineNumbers: true, matchBrackets: true, mode: "text/x-csharp"});
        //myCodeMirror.setSize(700,300);
        
        function jumpToLine(i) {
          myCodeMirror.setCursor(i);
          window.setTimeout(function() {
            myCodeMirror.setLineClass(i, null, "center-me");
            var line = $('.CodeMirror-lines .center-me');
            var h = line.parent();
            $('.CodeMirror-scroll').scrollTop(0).scrollTop(line.offset().top 
              - $('.CodeMirror-scroll').offset().top 
              - Math.round($('.CodeMirror-scroll').height()/2));
          }, 200);
        }
        var lineOfMain = lineOfWord(allText, "main");
        jumpToLine(lineOfMain + 15);
      }
    }
  }
  srcFile.send(null);
}

function lineOfWord(text, word) {
  var lines = text.split('\n');
  var cnt = 0;
  for (var i in lines) {
    if (lines[i].indexOf(word) != -1)
      return cnt + 1;
    else cnt = cnt + 1;
  }
  return 0;
}

function clearResultFrame() {
  var fileName = getParam('ex');
  var fileType = getParam('type');
  var fileOptions = getParam('options');
  window.open("infer.html?ex=" + fileName + "&type=" + fileType + "&options=" + fileOptions,"_self")  
}

function addRow(data1, valid, startS, endS, focus) {
  var table = document.getElementById("tresult");
 
  var rowCount = table.rows.length;
  var row = table.insertRow(rowCount);
 
  var cell1 = row.insertCell(0);
  cell1.innerHTML = data1; 
  
  //var alink = document.createElement('a');
  //alink.setAttribute('href', "javascript:selectText(" + startS + "," + endS + "," + focus + ")"); 
  //alink.innerHTML = data1; 
  //cell1.appendChild(alink);  

  var cell2 = row.insertCell(1);
  var alink = document.createElement('a');
  alink.setAttribute('href', "javascript:selectText(" + startS + "," + endS + "," + focus + ")"); 
  var img = document.createElement("img");
  if (valid) {
    //img.src = "imgs/greenchecksquare.bmp";
    img.src = "imgs/greencheckround_orig.png";
  } else {
    //img.src = "imgs/redcrosssquare.bmp";
    img.src = "imgs/redcrossround_orig.png";
  }
  img.style.width = "16px";
  img.style.height = "16px";
  alink.appendChild(img)
  cell2.appendChild(alink);        
}

function populateTable(text){
  var fileType = getParam('type');
  // HIP
  if (fileType === "ss" || fileType === "c") {
    var token = "Checking procedure";
    var tnt_token = "Termination Inference Result:";
    var meths = text.split(token);
    var noLines = text.split('\n').length;
    /*  window.alert("sometext"); */
    for (var i in meths) {
      //addRow(meths[i],true);
      //window.alert(meths[i]);
      if((meths[i].indexOf("Procedure")) != -1){
         /* var proc = meths[i].match("(.*?)\\$"); */
        var proc = meths[i].match("[^\\$]+");
        var start  = text.indexOf(token + proc+"$");          
        var end   = start + meths[i].length + token.length;
        var prefix = text.substring(0,text.indexOf(token + proc));
        var focus  = prefix.split('\n').length;
        /* window.alert(focus); */
        if(meths[i].indexOf("SUCCESS") != -1){ 
          addRow(proc,true, start, end, focus/noLines);
        }else{
          addRow(proc,false, start, end, focus/noLines);
        }
      }
    }
    
    // If there is no added row, showing the error
    //var table = document.getElementById("tresult");
    //var rowCount = table.rows.length;
    //alert(rowCount);
    //if (rowCount == 1) {
      var cbDetails = document.getElementById('cb_details');
      cbDetails.checked = true;
      toggleVisibility(cbDetails);
    //}
    
    return meths.length;
  } 
  // SLEEK
  else {
    token = "Entail"
    var meths = text.split(token);
    var noLines = text.split('\n').length;
    /*  window.alert("sometext"); */
    for (var i in meths) {
      //addRow(meths[i],true);
      //window.alert(meths[i]);
      if(((meths[i].indexOf("Valid")) != -1)||((meths[i].indexOf("Fail")) != -1)){
         /* var proc = meths[i].match("(.*?)\\$"); */
        var proc = meths[i].match("[^:]+");
        var procE = token + proc;
        var start = text.indexOf(procE+":");
        var end   = start + meths[i].length + token.length;
        var prefix = text.substring(0,text.indexOf(procE+":"));
        var focus  = prefix.split("\n").length;
        if(meths[i].indexOf("Valid") != -1){ 
          addRow(procE, true, start, end, focus/noLines);
        }else{
          addRow(procE, false, start, end, focus/noLines);
        }
      }
    }
    return meths.length;
  }
}

function loadResults(fileName) {
  /* parent.frames['inference_frame'].document.getElementById('program_container')
  || parent.document.getElementById('inference_frame').contentDocument.getElementById('program_container')
  || parent.document.getElementById('program_container'); */
  if (fileName != "") {
    var fileLocation = "src/temp/";
    var filePath = fileLocation + fileName;
    loadFileResult(filePath, 'result_container');
  } else {
    var txtArea = window.document.getElementById('result_container');
    txtArea.value = "";
  }
}

window.onload = function(evt) {
  /* window.alert("sometext");  */
  var fileName = getParam('ex');
  var fileType = getParam('type');
  var fileOptions = getParam('options');
  var fileResult = getParam('result');
  /* window.alert("sometext"); */
  if (fileName != "0") {
    if(fileName.split(".").length > 1) {
      var fileLocation = "src/temp/";
      var filePath = fileLocation + fileName;
      loadFile(filePath,'program_container');
    } else {
      var fileLocation = (fileType == "ss" || fileType == "c")?"src/hip/":"src/sleek/";
      var filePath = fileLocation + fileName + "." + fileType;
      loadFile(filePath,'program_container');
    }
  } else {
    var txtArea = document.getElementById('program_container')
      || document.getElementById('program_container');
    txtArea.value = "// Enter your own example here or\n// Choose an example on the left panel.\n";
    var textHeight = txtArea.value.offsetHeight;
    var myCodeMirror = CodeMirror.fromTextArea(txtArea, {lineNumbers: true, matchBrackets: true, mode: "text/x-csharp"});
    //myCodeMirror.setSize(700,250);
  }
  loadResults(fileResult);
  var nameField = document.getElementById('program_name')
    || document.getElementById('program_name');
  nameField.value = fileName;
  var typeField = document.getElementById('program_type')
    || document.getElementById('program_type');
  typeField.value = fileType;
  var optionsField = document.getElementById('program_options')
    || document.getElementById('program_options');
  optionsField.value = fileOptions;
  //var resultFrame = window;
  //resultFrame.location.href='result.html';
  editAreaLoader.init({
    id: "program_container",
    allow_resize: "both",
    display:  "later",
    word_wrap: true,
    syntax: "cpp"  
  });
  editAreaLoader.init({
    id: "result_container",
    allow_resize: "both",
    allow_toggle: false,
    display:  "later",
    word_wrap: true,
    syntax: "cpp"  
  });
}

function toggleVisibility(cb)
{
  var x = document.getElementById("details_container");
  if(cb.checked==false)
   x.style.visibility = "hidden"; // or x.style.display = "none";
  else
   x.style.visibility = "visible"; //or x.style.display = "block";
}

function selectText(selectionStart, selectionEnd, focus) {
  var txtArea = document.getElementById('result_container');
  var cbDetails = document.getElementById('cb_details');
  cbDetails.checked = true;
  toggleVisibility(cbDetails); 
  txtArea.setSelectionRange(0, 0);
  txtArea.focus();
  //txtArea.setCursor(txtArea, selectionStart, selectionEnd);
  txtArea.setSelectionRange(selectionStart, selectionEnd);
  var h = txtArea.scrollHeight;
  txtArea.scrollTop = (h * focus)-20;
  /* txtArea.focus(); */
}

