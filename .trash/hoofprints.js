/* NietBegin - wandering hoof print trails.
   Every so often a trail of hoof prints (some shod) walks across the screen
   in a random direction, then fades away. Purely decorative. */
(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var SVG_NS = "http://www.w3.org/2000/svg";

  function hoofSvg() {
    var s = document.createElementNS(SVG_NS, "svg");
    s.setAttribute("viewBox", "0 0 40 48");
    s.setAttribute("aria-hidden", "true");
    s.innerHTML =
      '<path d="M20 6c-5 0-8 5-8 11 0 5 2 8 2 13 0 4-1 7-1 9 0 2 3 3 7 3s7-1 7-3c0-2-1-5-1-9 0-5 2-8 2-13 0-6-3-11-8-11z"/>' +
      '<ellipse cx="10" cy="8" rx="3.4" ry="4.4"/>' +
      '<ellipse cx="30" cy="8" rx="3.4" ry="4.4"/>';
    return s;
  }

  function shoeSvg() {
    var s = document.createElementNS(SVG_NS, "svg");
    s.setAttribute("viewBox", "0 0 40 48");
    s.setAttribute("aria-hidden", "true");
    s.innerHTML =
      '<path d="M6 8c-1 10-1 20 4 28 3 5 7 8 10 8s7-3 10-8c5-8 5-18 4-28h-7c1 8 1 16-2 22-2 4-4 6-5 6s-3-2-5-6c-3-6-3-14-2-22H6z"/>' +
      '<circle cx="8" cy="14" r="1.6"/><circle cx="8" cy="24" r="1.6"/>' +
      '<circle cx="32" cy="14" r="1.6"/><circle cx="32" cy="24" r="1.6"/>' +
      '<circle cx="14" cy="38" r="1.6"/><circle cx="26" cy="38" r="1.6"/>';
    return s;
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function runTrail() {
    var layer = document.createElement("div");
    layer.className = "hoof-trail";
    document.body.appendChild(layer);

    // Random direction of travel, anchored somewhere in the visible middle
    // of the screen so the trail always crosses on-screen ground.
    var narrow = Math.min(window.innerWidth, window.innerHeight) < 480;
    var angle = rand(0, Math.PI * 2);
    var step = narrow ? rand(30, 38) : rand(46, 62);
    var count = Math.round(narrow ? rand(5, 7) : rand(7, 11));
    var trailLength = count * step;
    var cx = window.innerWidth * rand(0.25, 0.75) - (Math.cos(angle) * trailLength) / 2;
    var cy = window.innerHeight * rand(0.25, 0.75) - (Math.sin(angle) * trailLength) / 2;

    var delay = 0;
    var stepDelay = rand(240, 340);

    for (var i = 0; i < count; i++) {
      var leftSide = i % 2 === 0;
      var perp = angle + Math.PI / 2;
      var spread = narrow ? 8 : 11;
      var px = cx + Math.cos(perp) * (leftSide ? -spread : spread) + rand(-3, 3);
      var py = cy + Math.sin(perp) * (leftSide ? -spread : spread) + rand(-3, 3);

      var rotation = (angle * 180) / Math.PI + (leftSide ? -6 : 6) + rand(-5, 5);
      // About one in three prints is a shod print.
      var svg = Math.random() < 0.33 ? shoeSvg() : hoofSvg();
      var wrap = document.createElement("span");
      wrap.className = "hoof-print";
      wrap.appendChild(svg);
      wrap.style.left = px + "px";
      wrap.style.top = py + "px";
      wrap.style.transform = "translate(-50%, -50%) rotate(" + rotation + "deg)";
      wrap.dataset.delay = delay;
      layer.appendChild(wrap);
      delay += stepDelay;
    }

    // The whole trail lingers a moment, then fades out together.
    var total = delay + 2200;
    var prints = layer.querySelectorAll(".hoof-print");
    for (var j = 0; j < prints.length; j++) {
      prints[j].style.animationDelay = prints[j].dataset.delay + "ms, " + total + "ms";
    }
    setTimeout(function () {
      layer.remove();
    }, total + 1800);
  }

  function schedule() {
    setTimeout(function () {
      runTrail();
      schedule();
    }, rand(18000, 45000));
  }

  // First trail a little sooner so visitors actually see it.
  setTimeout(function () {
    runTrail();
    schedule();
  }, rand(4000, 8000));
})();
