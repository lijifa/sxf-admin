const fn = (() => {

  const fnMap = [
    [
      'requestFullscreen',
      'exitFullscreen',
      'fullscreenElement',
      'fullscreenEnabled',
      'fullscreenchange',
      'fullscreenerror'
    ],
    // new WebKit
    [
      'webkitRequestFullscreen',
      'webkitExitFullscreen',
      'webkitFullscreenElement',
      'webkitFullscreenEnabled',
      'webkitfullscreenchange',
      'webkitfullscreenerror'

    ],
    // old WebKit (Safari 5.1)
    [
      'webkitRequestFullScreen',
      'webkitCancelFullScreen',
      'webkitCurrentFullScreenElement',
      'webkitCancelFullScreen',
      'webkitfullscreenchange',
      'webkitfullscreenerror'

    ],
    [
      'mozRequestFullScreen',
      'mozCancelFullScreen',
      'mozFullScreenElement',
      'mozFullScreenEnabled',
      'mozfullscreenchange',
      'mozfullscreenerror'
    ],
    [
      'msRequestFullscreen',
      'msExitFullscreen',
      'msFullscreenElement',
      'msFullscreenEnabled',
      'MSFullscreenChange',
      'MSFullscreenError'
    ]
  ]

  let ret = null
  fnMap.map(item => {
    if (item && item[1] in document) {
      ret = {}
      item.map((v, k) => {
        ret[fnMap[0][k]] = v
      })
    }
  })
  
  return ret
})()

let keyboardAllowed = typeof Element !== 'undefined' &&
	    'ALLOW_KEYBOARD_INPUT' in Element

const screenfull = {
  request: function(elem) {
    let request = fn.requestFullscreen
    elem = elem || document.documentElement
    // Work around Safari 5.1 bug: reports support for
    // keyboard in fullscreen even though it doesn't.
    // Browser sniffing, since the alternative with
    // setTimeout is even worse.
    if (/5\.1[\.\d]* Safari/.test(navigator.userAgent)) {
      elem[request]()
    } else {
      elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT)
    }
  },
  exit: function() {
    document[fn.exitFullscreen]()
  },
  toggle: function() {
    if (screenfull.isFullscreen) {
      screenfull.exit()
    } else {
      screenfull.request()
    }
  }
}

Object.defineProperties(screenfull, {
  isFullscreen: {
    get: () => {
      return !!document[fn.fullscreenElement]
    }
  },
  element: {
    enumerable: true,
    get: function() {
      return document[fn.fullscreenElement]
    }
  },
  enabled: {
    enumerable: true,
    get: () => {
      return !!document[fn.fullscreenEnabled]
    }
  }
})


screenfull.VERSION = '3.0.0'

export default fn ? screenfull : {}