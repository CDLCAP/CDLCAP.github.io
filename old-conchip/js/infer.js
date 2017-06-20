function onLoadTxtArea() {
	var fileName = getParam('ex');
	var fileType = getParam('type');
	if (fileName != "0") {
		var fileLocation = (fileType == "ss")?"src/hip/":"src/sleek/";
		var filePath = fileLocation + fileName + "." + fileType;
		loadFile(filePath);
	} else {
		var txtArea = parent.frames['inference_frame'].document.getElementById('program_container')
			|| parent.document.getElementById('inference_frame').contentDocument.getElementById('program_container');
		txtArea.value = "// Fill your own code here.";
	}
	var nameField = parent.frames['inference_frame'].document.getElementById('program_name')
		|| parent.document.getElementById('inference_frame').contentDocument.getElementById('program_name');
	nameField.value = fileName;
	var typeField = parent.frames['inference_frame'].document.getElementById('program_type')
		|| parent.document.getElementById('inference_frame').contentDocument.getElementById('program_type');
	typeField.value = fileType;

	editAreaLoader.init({
		id: "program_container"		
		,allow_resize: "both"
		,word_wrap: true
		,syntax: "cpp"
        ,start_highlight: true		// to display with highlight mode on start-up
	});
}

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

function loadFile(fileLocation) {
	var srcFile = new XMLHttpRequest();
	srcFile.open("GET", fileLocation, true);
	srcFile.onreadystatechange = function() {
		if (srcFile.readyState === 4) {  
			if (srcFile.status === 200) {  
				allText = srcFile.responseText; 
				var txtArea = parent.frames['inference_frame'].document.getElementById('program_container')
				|| parent.document.getElementById('inference_frame').contentDocument.getElementById('program_container');
				txtArea.value = allText;
			}
		}
	}
	srcFile.send(null);
}

function clearResultFrame() {
        var resultFrame = window.parent.frames['result_frame'] || parent.document.getElementById('result_frame');
        resultFrame.location.href='result.html';
}

