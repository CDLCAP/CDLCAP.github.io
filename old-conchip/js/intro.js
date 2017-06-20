function onLoadPage() {
	var contentFrame = parent.frames['content_frame'] || parent.document.getElementById('content_frame');
	contentFrame.setAttribute('rows', '100%,0%', 0);
}
