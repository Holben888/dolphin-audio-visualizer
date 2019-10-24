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

const annotationRegions = audioInfo.annotations

const addColorsToAnnotations = () => {
  annotationRegions.forEach(
    annotation => (annotation.color = getRandomColor(0.2))
  )
}

const createRegionsFromAnnotations = () => {
  annotationRegions.forEach(annotation => {
    wave.addRegion({
      start: annotation.start,
      end: annotation.end,
      color: annotation.color,
      drag: false,
      data: {
        annotation: annotation.label,
      },
    })
  })
}

const createAnnotationTimeline = () => {
  const audioLength = audioInfo['audio-length']
  const annotationEl = document.getElementById('annotations')

  annotationRegions.forEach((annotation, index) => {
    const percentStart = (annotation.start / audioLength) * 100
    const percentEnd = (annotation.end / audioLength) * 100
    const elPercentWidth = percentEnd - percentStart

    const annotationRegion = document.createElement('button')
    annotationRegion.innerText = annotation.label
    annotationRegion.setAttribute('data-index', index) // add an index attr to each button to see which was clicked
    annotationRegion.className = 'timeline-region'
    annotationRegion.style.cssText = `
      width: ${elPercentWidth}%;
      left: ${percentStart}%;
      background-color: ${annotation.color};
    `
    annotationEl.appendChild(annotationRegion)
  })
}

wave.load('./example-media/' + audioInfo['audio-file'])

wave.on('ready', () => {
  addColorsToAnnotations()
  createRegionsFromAnnotations()
  createAnnotationTimeline()
  document.getElementById('loading').style.display = 'none'

  audioInfo['audio-length'] * 300
})

// Set scale of waveform / spectrogram to 6x
wave.zoom(300)

// When region is playing, show the corresponding annotation
wave.on('region-in', region => {
  const annotation = document.getElementById('annotation')
  annotation.innerText = region.data.annotation
})

wave.on('region-created', region => {
  // Find region by start time
  const match = annotationRegions.find(
    annotation => annotation.start === region.start
  )
  // Add the "region" object to the annotation list item to access playback methods later
  match.region = region
})

wave.on('audioprocess', playbackTime => {
  const playbackTimeEl = document.getElementById('playback-time')
  playbackTimeEl.innerText = playbackTime.toFixed(2) + 's'
})

wave.on('seek', percentScrubbed => {
  const playbackTime = audioInfo['audio-length'] * percentScrubbed
  const playbackTimeEl = document.getElementById('playback-time')
  playbackTimeEl.innerText = playbackTime.toFixed(2) + 's'
})

document.addEventListener('click', event => {
  if (event.target.id === 'play') {
    wave.play()
  }
  if (event.target.id === 'pause') {
    wave.pause()
  }
  if (event.target.attributes['data-index']) {
    const annotationIndex = event.target.attributes['data-index'].value
    annotationRegions[annotationIndex].region.play()
  }
})
