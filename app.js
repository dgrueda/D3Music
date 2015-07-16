'use strict';
(function(){

	// webaudio api
	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	var audioElement = document.getElementById('audioElement');
	var audioSrc = audioCtx.createMediaElementSource(audioElement);
	var analyser = audioCtx.createAnalyser();
 
	audioSrc.connect(analyser);
	audioSrc.connect(audioCtx.destination);

	var frequencyData = new Uint8Array(10);

	// Play button
	document.getElementById('play-button')
		.addEventListener("click", function (e) {
			var audio = document.getElementById('audioElement');

			if (audio.paused) {
				e.target.innerHTML = "Pause Music";
				audio.play()
			}
			else {
				e.target.innerHTML = "Play Music";
				audio.pause()
			}
		});

	// svg
	var svgHeight = '600';
	var svgWidth = '600';

	function createSvg(parent, height, width) {
		return d3.select(parent)
			.append('svg')
			.attr('height', height)
			.attr('width', width);
	}

	var svg = createSvg('#visualization', svgHeight, svgWidth);

	// init visualization
	svg.selectAll('circle')
		.data(frequencyData)
		.enter()
		.append('circle')
		.attr('cx', function (d) {
			return svgWidth / 2;
		})
		.attr('cy', function (d) {
			return svgHeight / 2;
		})
		.attr('r', svgWidth / frequencyData.length);

	// updates the visualization in a continous loop
	function renderChart() {
		requestAnimationFrame(renderChart);

		// puts the frequency data in frequencyData array
		analyser.getByteFrequencyData(frequencyData);

		svg.selectAll('circle')
			.data(frequencyData)
			.attr('r', function (d) {
				return d;
			})
			.attr('stroke', function (d) {
				var color = 'rgb(0, 0, ' + d / 2 + ')';
				if (d > 127) {
					color = 'rgb(' + d / 2 + ', 0, 0)';
				}
				return color;
			})
			.attr('fill', function (d) {
				var color = 'transparent';
				if (d < 40) {
					color = 'rgb(0, ' + d / 2 + ', 0)';
				}
				if (d < 10) {
					color = 'green';
				}
				if (d > 240) {
					color = 'red';
				}
				return color;
			})
			.attr('stroke-width', 2);
	}

	renderChart();

}());