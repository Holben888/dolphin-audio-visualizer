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
  const timeline = document.getElementById('timeline')

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
  addColorsToAnnotations()
  createRegionsFromAnnotations()
  createAnnotationTimeline()
  document.getElementById('loading').style.display = 'none'
})

wave.on('region-in', region => {
  const annotation = document.getElementById('annotation')
  annotation.innerText = region.data.annotation
})

wave.on('region-created', region => {
  const match = annotationRegions.find(
    annotation => annotation.start === region.start
  )
  // add the "region" object to the annotation list item to allow playback
  match.region = region
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
  if (event.target.attributes['data-index']) {
    const annotationIndex = event.target.attributes['data-index'].value
    annotationRegions[annotationIndex].region.play()
  }
})
