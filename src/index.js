import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/src/plugin/spectrogram';
import RegionPlugin from 'wavesurfer.js/src/plugin/regions';
// import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline';
import {
  audioFile,
  audioLength,
  timelines,
} from './example-media/dolphin.json';
import { constructTimelines } from './timlineConstructor';

const createPlaybackRegion = (wave, region) => {
  wave.clearRegions();
  const displayRegion = wave.addRegion({
    start: region.start,
    end: region.end,
    color: region.color,
    drag: false,
  });
  displayRegion.play();
};

const highlightRegionsCurrentlyPlaying = playbackTime => {
  const regionEls = document.getElementsByClassName('timeline-region');
  for (const regionEl of regionEls) {
    const startTime = regionEl.getAttribute('data-start');
    const endTime = regionEl.getAttribute('data-end');
    if (startTime <= playbackTime && endTime >= playbackTime) {
      regionEl.classList.add('highlighted');
    } else {
      regionEl.classList.remove('highlighted');
    }
  }
};

(function init() {
  const zoomFactor = 300; // zoom into waveform 6x original amount
  const timelineContainerEl = document.getElementById('timeline-container');
  timelineContainerEl.style.width = audioLength * zoomFactor + 'px';

  const wave = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#ddd',
    progressColor: '#333',
    plugins: [
      RegionPlugin.create(),
      SpectrogramPlugin.create({
        container: '#spectrogram',
        labels: true,
      }),
    ],
  });

  wave.load('./example-media/' + audioFile);
  wave.zoom(zoomFactor);

  wave.on('ready', () => {
    const timelinesFormatted = constructTimelines(timelines, audioLength);
    document.getElementById('loading').style.display = 'none';
    highlightRegionsCurrentlyPlaying(0);

    document.addEventListener('click', ({ target }) => {
      if (target.id === 'play') {
        wave.play();
      }
      if (target.id === 'pause') {
        wave.pause();
      }
      if (target.attributes['data-index']) {
        const timelineName = target.attributes['data-name'].value;
        const regionIndex = target.attributes['data-index'].value;
        const matchingTimeline = timelinesFormatted.find(
          timeline => timeline.name === timelineName
        );
        const region = matchingTimeline.regions[regionIndex];
        createPlaybackRegion(wave, region);
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === ' ') {
        event.preventDefault();
        wave.playPause();
      }
    });

    const playbackHandler = playbackTime => {
      const playbackTimeEl = document.getElementById('playback-time');
      playbackTimeEl.innerText = playbackTime.toFixed(2) + 's';
      highlightRegionsCurrentlyPlaying(playbackTime);
    };

    // Update current playback time as audio plays
    wave.on('audioprocess', playbackTime => playbackHandler(playbackTime));

    // Update current playback time when user manually moves playhead
    wave.on('seek', percentScrubbed =>
      playbackHandler(percentScrubbed * audioLength)
    );
  });

  // Update scroll position of the timelines as audio plays
  wave.on('scroll', event => {
    timelineContainerEl.style.left = `-${event.target.scrollLeft}px`;
  });
})();
