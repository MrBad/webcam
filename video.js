
(function(){
	navigator.getUserMedia=(navigator.getUserMedia || navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia || navigator.msGetUserMedia);

	window.URL = window.URL || window.webkitURL || {};
	if(!window.URL.createObjectURL) {
		window.URL.createObjectURL = function(obj){return obj;};
	}

	window.requestAnimationFrame = requestAnimationFrame || webkitRequestAnimationFrame ||
		mozRequestAnimationFrame || msRequestAnimationFrame;

})();


function Video(opts) {

	// declarations
	this.width = 640;
	this.height = 480;

	/** @type {Element} */
	this.container = null;

	// merge options
	for(var key in opts) {
		if(this.hasOwnProperty(key)) {
			this[key] = opts[key];
		}
	}

	//this.getUserMedia = navigator.mediaDevices.getUserMedia;
	if(!navigator.getUserMedia) {
		throw('getUserMedia is not supported!');
	}

	if(!this.container) {
		throw('Please specify a container!');
	}
	if(typeof this.container == 'string') {
		this.container = document.getElementById(this.container);
		if(!this.container) {
			throw('Invalid container ID');
		}
	}
	if(window.location.protocol !='https:') {
		throw('This script should be run on secure server (https)');
	}


	this.video = document.createElement('video');
	this.video.setAttribute('autoplay', true);
	this.video.setAttribute('width', this.width);
	this.video.setAttribute('height', this.height);
	this.container.appendChild(this.video);


	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('width', this.width);
	this.canvas.setAttribute('height', this.height);
	this.canvas.style.border = 'solid 1px red';
	this.video.style.display = 'none';
	this.container.appendChild(this.canvas);

// 	this.snap = document.createElement('a');
// 	var txt = document.createTextNode('SNAP');
// 	this.snap.appendChild(txt);
// 	this.snap.setAttribute('href', '#');
// 	this.snap.addEventListener('click', this);
// 	this.container.appendChild(this.snap);

	
	navigator.getUserMedia({video: true}, 
			
			function(stream) {
				this.video.setAttribute('src', window.URL.createObjectURL(stream));
				this.video.play();

				this.loop();

			}.bind(this), 
			
			function(err){
				console.log(err, typeof err);
				switch (err) {
					case 'NO_DEVICES_FOUND':
						this.showErr('We cannot detect any webcam. Please connect your webcam and hit F5');
						break;
					case 'HARDWARE_UNAVAILABLE':
						this.showErr('Your webcam is in use by other application. Please close that application and hit F5');
						break;
					default:
						this.showErr('Please connect your webcam and hit F5. Also make shure your webcam is not in use by other application! ');
						console.log(err);
				}
			}.bind(this));
}

Video.prototype.handleEvent = function(e) {
	var type = e.type;
	var target = e.target;
	
	if(type == 'click') {
		if(target == this.snap) {
			this.takeSnapshot();
		}
	}
}

Video.prototype.loop = function() {
// 	console.log('loop');
	this.takeSnapshot();
	window.requestAnimationFrame(this.loop.bind(this));
// 	this.timer = setTimeout(this.loop.bind(this), 50);
}

Video.prototype.takeSnapshot = function() {
	var context = this.canvas.getContext('2d');
	context.drawImage(this.video, 0, 0, this.width, this.height);
	
	var data = this.canvas.toDataURL('image/jpeg');
	// send data to server //
	
}

Video.prototype.showErr = function(msg) {
	alert(msg);
}

if(window.location.protocol != 'https:') {
	window.location = 'https:' + window.location.href.substring(window.location.protocol.length);
}

new Video({
	width: 320,
	height: 240,
	container: document.getElementById('container')
});
