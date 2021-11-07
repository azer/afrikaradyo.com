const events = {
  play: audioEvent('play', { playing: true, loading: false }),
  mute: audioEvent('mute', { playing: true, loading: false, muted: true }),
  unmute: audioEvent('unmute', { playing: true, loading: false, muted: false }),
}

const defaultState = {
  src: '',
  title: '',
  cover: 'http://afrikaradyo.com/cover.jpeg',
  loading: false,
  playing: false,
  muted: false,
}

let state = {
  ...defaultState,
}

init()

function init() {
  renderWallpaper()
  renderWrapper()
  renderPlayer()
  renderAudio()

  window.addEventListener('online', function () {
    setTimeout(restart, 1000)
  })

  scheduleNextLoad(0)
}

function onClickPlayButton() {
  if (state.loading) {
    return
  }

  if (!state.playing) {
    return play()
  }

  if (state.muted) {
    return unmute()
  }

  mute()
}

function onStateChange() {
  document.querySelector('#button').innerHTML = playIcon()
  document.querySelector('#title').innerHTML = `${state.title}`
  document.querySelector('#cover').src = state.cover
}

function renderPlayer() {
  const root = document.querySelector('#outer')

  const player = createElement(
    'div',
    {
      style: {
        width: '330px',
      },
    },
    root
  )

  const columns = createElement(
    'div',
    {
      style: {
        display: 'grid',
        'grid-template-columns': '60px auto',
      },
    },
    player
  )

  const button = createElement(
    'div',
    {
      id: 'button',
      style: {
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        color: '#fff',
        cursor: 'pointer',
      },
    },
    columns
  )

  button.innerHTML = playIcon()

  button.addEventListener('click', onClickPlayButton)

  const title = createElement(
    'h1',
    {
      style: {
        color: '#fff',
        font: '500 48px "Calibre", "Helvetica", "-apple-system", "BlinkMacSystemTypography", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "sans-serif"',
        margin: '0',
        padding: '0',
      },
    },
    columns
  )

  title.innerHTML = 'Afrika Radyo'

  const line = createElement(
    'div',
    {
      style: {
        margin: '10px auto',
        width: '300px',
        'border-top': '1px solid rgba(255, 255, 255, 0.125)',
      },
    },
    player
  )

  const img = createElement(
    'img',
    {
      id: 'cover',
      src: state.cover,
      style: {
        display: 'block',
        width: '280px',
        margin: '20px auto',
        border: '10px solid #fff',
        'border-radius': '2px',
      },
    },
    player
  )

  const meta = createElement(
    'div',
    {
      id: 'meta',
      style: {
        display: 'grid',
        width: '300px',
        margin: '20px auto',
        'grid-template-columns': '10px auto',
        'grid-column-gap': '10px',
      },
    },
    player
  )

  const note = createElement(
    'div',
    {
      style: {
        color: 'rgba(255, 255, 255)',
        opacity: '0.1',
        '-webkit-animation': 'fadeinout 4s linear forwards infinite',
        animation: 'fadeinout 4s linear forwards infinite',
      },
    },
    meta
  )
  note.innerHTML = `♫`

  const songTitle = createElement(
    'h2',
    {
      id: 'title',
      style: {
        margin: '0',
        padding: '0',
        font: `300 14px "Menlo", "Apercu Mono", "sans-serif"`,
        color: '#fff',
        'letter-spacing': '-0.35px',
        'line-height': '1.3',
      },
    },
    meta
  )
}

function renderAudio() {
  const root = document.querySelector('#outer')
  const audio = createElement('audio', {}, root)
  const mp3 = createElement(
    'source',
    {
      src: 'http://afrikaradyo.com:8000/listen.mp3',
      type: 'audio/mp3',
    },
    audio
  )

  const ogg = createElement(
    'source',
    {
      src: 'http://afrikaradyo.com:8000/listen.ogg',
      type: 'audio/ogg',
    },
    audio
  )

  audio.volume = 1
  audio.addEventListener('play', events.play)
  audio.addEventListener('playing', audioEvent('playing', { playing: true, loading: false }))
  audio.addEventListener('ended', audioEvent('ended', { loading: true }))
  audio.addEventListener('pause', audioEvent('pause', { loading: true }))
  audio.addEventListener('stalled', audioEvent('stalled', { loading: true }))
  audio.addEventListener('waiting', audioEvent('waiting', { loading: true }))
}

function renderWrapper() {
  const root = document.querySelector('#app')

  const outer = createElement(
    'div',
    {
      id: 'outer',
      style: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        'z-index': '9999999',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
      },
    },
    root
  )
}

function renderWallpaper() {
  const root = document.querySelector('#app')

  const wallpaper = createElement(
    'div',
    {
      id: 'wallpaper',
      style: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        'z-index': '0',
      },
    },
    root
  )
}

function createElement(tag, attrs, parentEl) {
  const el = document.createElement(tag)

  for (var key in attrs) {
    if (key === 'style') {
      el.setAttribute(key, css(attrs[key]))
    } else {
      el.setAttribute(key, attrs[key])
    }
  }

  ;(parentEl || document.documentElement).appendChild(el)

  return el
}

function css(style) {
  var result = []

  for (var key in style) {
    result.push(`${key}: ${style[key]}`)
  }

  return result.join('; ')
}

function forcePlay() {
  const audio = document.querySelector('audio')

  if (audio.paused) {
    audio.play()
  }
}

function setAsMuted() {
  document.querySelector('audio').muted = muted
}

function playIcon() {
  const playButton = `<svg width="36" height="36" viewBox="0 0 1200 1200"><path fill="#fff" opacity="0.9" d="M 600,1200 C 268.65,1200 0,931.35 0,600 0,268.65 268.65,0 600,0 c 331.35,0 600,268.65 600,600 0,331.35 -268.65,600 -600,600 z M 450,300.45 450,899.55 900,600 450,300.45 z"></path></svg>`
  const spinner = `<svg width="36px" height="36px" viewBox="0 0 40 40" enable-background="new 0 0 32 32" x="0px" y="0px"><path d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946 s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634 c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" opacity="0.2" fill="#fff"></path><path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0 C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"></animateTransform></path></svg>`
  const volumeOn = `<svg width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M20 16 C20 8 15 2 15 2 L8 10 2 10 2 22 8 22 15 30 C15 30 20 24 20 16 Z M21 2 C21 2 25 6 25 16 25 26 21 30 21 30 M27 4 C27 4 30 8 30 16 30 24 27 28 27 28"></path></svg>`
  const volumeOff = `<svg width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M20 16 C20 8 15 2 15 2 L8 10 2 10 2 22 8 22 15 30 C15 30 20 24 20 16 Z"></path></svg>`

  if (!state.playing) {
    return playButton
  }

  if (state.loading) {
    return spinner
  }

  if (state.muted) {
    return volumeOff
  }

  return volumeOn
}

function audioEvent(name, newState) {
  return function () {
    state = { ...state, ...newState }
    onStateChange()
  }
}

function restart() {
  const audio = document.querySelector('audio')
  audio.parentElement.removeChild(audio)

  renderAudio()

  setTimeout(function () {
    const audio = document.querySelector('audio')

    state = {
      ...defaultState,
    }

    audio.play()
    play()
    scheduleNextLoad(0)
  }, 500)
}

function loadTitle() {
  state.scheduler = undefined

  fetch('/status.json')
    .then((response) => response.json())
    .then((data) => {
      const meta = data.icestats.source.find((source) => source.server_type === 'application/ogg')
      const title = `${meta.artist}<br />${meta.title}`

      if (title == state.title) {
        return scheduleNextLoad(3000)
      }

      cover = defaultState.cover + '?' + (meta.artist + meta.title).replace(/[^a-zA-Z]+/, '')

      state = {
        ...state,
        title,
        cover,
      }

      onStateChange()

      scheduleNextLoad(10000)
    })
}

function scheduleNextLoad(ms) {
  console.log(state.scheduler)
  if (state.scheduler) clearTimeout(state.scheduler)
  state.scheduler = setTimeout(loadTitle, ms)
}

function play() {
  const audio = document.querySelector('audio')
  audio.play()
  events.play()
}

function unmute() {
  const audio = document.querySelector('audio')
  audio.muted = false
  events.unmute()
}

function mute() {
  const audio = document.querySelector('audio')
  audio.muted = true
  events.mute()
}
