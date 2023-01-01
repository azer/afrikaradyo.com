const events = {
  play: audioEvent("play", { playing: true, loading: false }),
  mute: audioEvent("mute", { playing: true, loading: false, muted: true }),
  unmute: audioEvent("unmute", { playing: true, loading: false, muted: false }),
};

const defaultState = {
  src: "",
  title: "",
  cover: "/cover.jpeg",
  loading: false,
  playing: false,
  muted: false,
  listeners: 0,
};

let state = {
  ...defaultState,
};

init();

function init() {
  renderWallpaper();
  renderWrapper();
  renderAudio();
  renderPlayer();
  renderMeta();

  window.addEventListener("online", function () {
    setTimeout(restart, 1000);
  });

  window.addEventListener("keyup", function (e) {
    if (e.keyCode !== 32 && e.keyCode !== 13) return;
    if (!state.playing) return play();
    if (state.muted) return unmute();
    mute();
  });

  scheduleNextLoad(0);
}

function onStateChange() {
  document.querySelector("#button").innerHTML = playIcon();
  document.querySelector("#title").innerHTML = `${state.title}`;
  document.querySelector("#cover").src = state.cover;
  document.querySelector("#outer").className =
    state.playing && !state.loading && !state.muted ? "playing" : "";
  /*document.querySelector("#listeners").style.display =
    state.listeners < 2 ? "hidden" : "block";
  document.querySelector(
    "#listeners"
  ).innerHTML = `${state.listeners} Dinleyici`;*/
}

function onClickPlayButton() {
  if (state.loading) {
    return;
  }

  if (!state.playing) {
    return play();
  }

  if (state.muted) {
    return unmute();
  }

  mute();
}

function renderPlayer() {
  const root = document.querySelector("#outer");

  const player = createElement(
    "div",
    {
      id: "player",
      style: {},
    },
    root
  );

  const img = createElement(
    "img",
    {
      id: "cover",
      src: state.cover,
      style: {},
    },
    player
  );

  img.onclick = onClickPlayButton;

  const meta = createElement(
    "div",
    {
      id: "meta",
      style: {},
    },
    player
  );

  const middle = createElement(
    "div",
    {
      id: "middle",
    },
    player
  );

  const button = createElement(
    "div",
    {
      id: "button",
      style: {
        cursor: "pointer",
      },
    },
    middle
  );

  button.innerHTML = playIcon();

  button.addEventListener("click", onClickPlayButton);

  const right = createElement(
    "div",
    {
      id: "right",
    },
    player
  );

  const eq = createElement(
    "div",
    {
      id: "eq",
    },
    right
  );
  eq.innerHTML = `<div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>`;

  const rightContent = createElement(
    "div",
    {
      id: "right-content",
    },
    right
  );

  const title = createElement(
    "div",
    {
      id: "title",
    },
    rightContent
  );

  title.innerHTML = "Afrika Radyo";
}

function renderAudio() {
  const root = document.querySelector("#outer");
  const audio = createElement("audio", {}, root);
  const mp3 = createElement(
    "source",
    {
      src: "/listen.mp3",
      type: "audio/mp3",
    },
    audio
  );

  const ogg = createElement(
    "source",
    {
      src: "/listen.ogg",
      type: "audio/ogg",
    },
    audio
  );

  audio.volume = 1;
  audio.addEventListener("play", events.play);
  audio.addEventListener(
    "playing",
    audioEvent("playing", { playing: true, loading: false })
  );
  audio.addEventListener("ended", audioEvent("ended", { loading: true }));
  audio.addEventListener("pause", audioEvent("pause", { playing: false }));
  audio.addEventListener("stalled", audioEvent("stalled", { loading: true }));
  audio.addEventListener("waiting", audioEvent("waiting", { loading: true }));
}

function renderMeta() {
  const player = document.querySelector("#player");
  const meta = document.querySelector("#meta");
  const right = document.querySelector("#right-content");

  const info = createElement(
    "div",
    {
      id: "info",
    },
    meta
  );

  const songTitle = createElement(
    "div",
    {
      id: "title",
      style: {
        margin: "0",
        padding: "0",
        color: "#fff",
        "letter-spacing": "-0.35px",
        "line-height": "1.3",
      },
    },
    info
  );

  const listeners = createElement(
    "div",
    {
      id: "listeners",
    },
    right
  );

  listeners.innerHTML = `${state.listeners} Dinleyici`;
}

function renderWrapper() {
  const root = document.querySelector("#app");

  const outer = createElement(
    "div",
    {
      id: "outer",
      style: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        "z-index": "9999999",
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
      },
    },
    root
  );
}

function renderWallpaper() {
  const root = document.querySelector("#app");

  const wallpaper = createElement(
    "div",
    {
      id: "wallpaper",
      class: "wallpaper",
    },
    root
  );

  const backdropWallpaper = createElement(
    "div",
    {
      id: "backdrop-wallpaper",
      class: "wallpaper",
      style: {
        top: "initial",
        bottom: "0",
        "z-index": "0",
      },
    },
    root
  );
}

function createElement(tag, attrs, parentEl) {
  const el = document.createElement(tag);

  for (var key in attrs) {
    if (key === "style") {
      el.setAttribute(key, css(attrs[key]));
    } else {
      el.setAttribute(key, attrs[key]);
    }
  }

  (parentEl || document.documentElement).appendChild(el);

  return el;
}

function css(style) {
  var result = [];

  for (var key in style) {
    result.push(`${key}: ${style[key]}`);
  }

  return result.join("; ");
}

function forcePlay() {
  const audio = document.querySelector("audio");

  if (audio.paused) {
    audio.play();
  }
}

function setAsMuted() {
  document.querySelector("audio").muted = muted;
}

function playIcon() {
  const playButton = `<svg width="36" height="36px" viewBox="0 0 1200 1200"><path fill="#fff" opacity="0.9" d="M 600,1200 C 268.65,1200 0,931.35 0,600 0,268.65 268.65,0 600,0 c 331.35,0 600,268.65 600,600 0,331.35 -268.65,600 -600,600 z M 450,300.45 450,899.55 900,600 450,300.45 z"></path></svg>`;
  const pauseButton = `<svg width="36px" height="36px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#fff" opacity="0.9">
<path d="M256,0C114.617,0,0,114.617,0,256s114.617,256,256,256s256-114.617,256-256S397.383,0,256,0z M224,320
	c0,8.836-7.156,16-16,16h-32c-8.844,0-16-7.164-16-16V192c0-8.836,7.156-16,16-16h32c8.844,0,16,7.164,16,16V320z M352,320
	c0,8.836-7.156,16-16,16h-32c-8.844,0-16-7.164-16-16V192c0-8.836,7.156-16,16-16h32c8.844,0,16,7.164,16,16V320z"/>
</svg>`;
  const spinner = `<svg width="36px" height="36px" viewBox="0 0 40 40" enable-background="new 0 0 32 32" x="0px" y="0px"><path d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946 s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634 c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" opacity="0.2" fill="#fff"></path><path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0 C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"></animateTransform></path></svg>`;
  const volumeOn = pauseButton; //`<svg width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M20 16 C20 8 15 2 15 2 L8 10 2 10 2 22 8 22 15 30 C15 30 20 24 20 16 Z M21 2 C21 2 25 6 25 16 25 26 21 30 21 30 M27 4 C27 4 30 8 30 16 30 24 27 28 27 28"></path></svg>`;
  const volumeOff = playButton; //`<svg width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M20 16 C20 8 15 2 15 2 L8 10 2 10 2 22 8 22 15 30 C15 30 20 24 20 16 Z"></path></svg>`;

  if (!state.playing) {
    return playButton;
  }

  if (state.loading) {
    return spinner;
  }

  if (state.muted) {
    return volumeOff;
  }

  return volumeOn;
}

function audioEvent(name, newState) {
  return function () {
    state = { ...state, ...newState };
    onStateChange();
  };
}

function restart() {
  const audio = document.querySelector("audio");
  audio.parentElement.removeChild(audio);

  renderAudio();

  setTimeout(function () {
    const audio = document.querySelector("audio");

    state = {
      ...defaultState,
    };

    audio.play();
    play();
    scheduleNextLoad(0);
  }, 500);
}

function play() {
  const audio = document.querySelector("audio");
  audio.play();
  events.play();
}

function unmute() {
  const audio = document.querySelector("audio");
  audio.muted = false;
  events.unmute();
}

function mute() {
  const audio = document.querySelector("audio");
  audio.muted = true;
  events.mute();
}

function loadTitle() {
  state.scheduler = undefined;

  fetch("/status.json")
    .then((response) => response.json())
    .then((data) => {
      const meta = data.icestats.source.find(
        (source) => source.server_type === "application/ogg"
      );
      const title = `${meta.title}<br /><span>${meta.artist}</span>`;
      const listeners = listenerCount(data);

      if (listeners != listenerCount) {
        state = { ...state, listeners };
        onStateChange();
      }

      if (title == state.title) {
        return scheduleNextLoad(3000);
      }

      cover =
        defaultState.cover +
        "?" +
        (meta.artist + meta.title).replace(/[^a-zA-Z]+/, "");

      state = {
        ...state,
        title,
        cover,
      };

      onStateChange();

      scheduleNextLoad(10000);
    });
}

function scheduleNextLoad(ms) {
  if (state.scheduler) clearTimeout(state.scheduler);
  state.scheduler = setTimeout(loadTitle, ms);
}

function listenerCount(data) {
  return data.icestats.source
    .map(function (source) {
      return source.listeners;
    })
    .reduce(function (a, b) {
      return a + b;
    }, 0);
}
