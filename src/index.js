import WaveSurfer from 'wavesurfer.js'
import SpectrogramPlugin from 'wavesurfer.js/src/plugin/spectrogram'
import RegionPlugin from 'wavesurfer.js/src/plugin/regions'
import audioInfo from './example-media-annotations/dolphin-2.json'
import { getRandomColor } from './helpers'

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
})

wave.load('./example-media/' + audioInfo['audio-file'])

document.addEventListener('click', event => {
  if (event.target.id === 'play') {
    wave.play()
  }
  if (event.target.id === 'pause') {
    wave.pause()
  }
})

wave.on('ready', () => {
  audioInfo.annotations.forEach(annotation => {
    annotation.color = getRandomColor(0.1)
    wave.addRegion(annotation)
  })
})

wave.on('region-click', (region, event) => {
  event.stopPropagation()
  // Play on click, loop on shift click
  event.shiftKey ? region.playLoop() : region.play()
})

document.addEventListener('click', event => {
  if (event.target.id === 'play') {
    wave.play()
  }
  if (event.target.id === 'pause') {
    wave.pause()
  }
})
