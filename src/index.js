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

const createRegionsFromAnnotations = () => {
  audioInfo.annotations.forEach(annotation => {
    wave.addRegion({
      start: annotation.start,
      end: annotation.end,
      color: getRandomColor(0.2),
      drag: false,
      data: {
        annotation: annotation.label,
      },
    })
  })
}

const createAnnotationTimeline = () => {
  const audioLength = audioInfo['audio-length']
  const timeline = document.getElementById('timeline')

  audioInfo.annotations.forEach(annotation => {
    const percentStart = (annotation.start / audioLength) * 100
    const percentEnd = (annotation.end / audioLength) * 100
    const elPercentWidth = percentEnd - percentStart

    const annotationRegion = document.createElement('div')
    annotationRegion.innerText = annotation.label
    annotationRegion.className = 'timeline-region'
    annotationRegion.style.cssText = `
      width: ${elPercentWidth}%;
      left: ${percentStart}%;
      background-color: green;
    `
    timeline.appendChild(annotationRegion)
  })
}

document.addEventListener('click', event => {
  if (event.target.id === 'play') {
    wave.play()
  }
  if (event.target.id === 'pause') {
    wave.pause()
  }
})

wave.load('./example-media/' + audioInfo['audio-file'])

wave.on('ready', () => {
  document.getElementById('loading').style.display = 'none'
  createRegionsFromAnnotations()
  createAnnotationTimeline()
})

wave.on('region-in', region => {
  const annotation = document.getElementById('annotation')
  annotation.innerText = region.data.annotation
})

wave.on('region-click', (region, event) => {
  event.stopPropagation()
  // Play on click, loop on shift click
  event.shiftKey ? region.playLoop() : region.play()
  annotation.innerText = region.data.annotation
})

document.addEventListener('click', event => {
  if (event.target.id === 'play') {
    wave.play()
  }
  if (event.target.id === 'pause') {
    wave.pause()
  }
})
