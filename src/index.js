import WaveSurfer from 'wavesurfer.js'
import Spectrogram from 'wavesurfer.js/src/plugin/spectrogram'

const wave = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#ddd',
  progressColor: '#333',
  plugins: [
    Spectrogram.create({
      container: '#spectrogram',
      labels: true,
    }),
  ],
})

document.addEventListener('click', event => {
  if (event.target.id === 'play') {
    wave.play()
  }
  if (event.target.id === 'pause') {
    wave.pause()
  }
})

wave.load('example-media/dolphin-2.wav')
