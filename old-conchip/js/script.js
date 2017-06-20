function enable_noresize() {
	parent.document.getElementById('content_frame').setAttribute('rows', '100%,0%', 0);
	
	parent.document.getElementById('inference_frame').noResize = true;
	
	parent.document.getElementById('result_frame').noResize = true;
}

function disable_noresize() {
	parent.document.getElementById('content_frame').setAttribute('rows', '70%,30%', 0);
	
	parent.document.getElementById('inference_frame').noResize = false;
	
	parent.document.getElementById('result_frame').noResize = false;
}
