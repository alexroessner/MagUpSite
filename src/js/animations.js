/**
 * GEO 42 Animation Engine
 * Scroll reveals, animated counters, typewriter effects, and touch interactions
 * Respects prefers-reduced-motion for all animations
 * Optimized for iOS Safari: visibility gating, touch detection, debounced resize
 * Mobile-first: touch ripple, tap-to-pause marquee, reduced particle count
 */
(function () {
  "use strict";

  const motionQuery = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  let prefersReducedMotion = motionQuery && motionQuery.matches;
  const isTouch = window.matchMedia && window.matchMedia("(hover: none)").matches;
  const hasPointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Listen for runtime reduced-motion changes (e.g. iOS Settings toggle)
  if (motionQuery && motionQuery.addEventListener) {
    motionQuery.addEventListener("change", function (e) {
      prefersReducedMotion = e.matches;
    });
  }

  // ── Scroll-triggered reveals via IntersectionObserver ──
  const isMobile = window.innerWidth < 640;
  const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .glow-reveal");
  const staggerEls = document.querySelectorAll(".stagger, .stagger-pop");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Mobile stagger children: animate directly via style (bypasses parent .visible)
            if (entry.target.hasAttribute("data-stagger-child")) {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            } else {
              entry.target.classList.add("visible");
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });

    // Stagger: on mobile (single-column), observe each child individually for smooth per-card reveal
    staggerEls.forEach(function (container) {
      if (isMobile) {
        const children = container.children;
        for (let i = 0; i < children.length; i++) {
          children[i].setAttribute("data-stagger-child", "");
          observer.observe(children[i]);
        }
      } else {
        observer.observe(container);
      }
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
    staggerEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // ── Mobile: scroll-triggered glow-border activation ──
  if (isTouch && !prefersReducedMotion && "IntersectionObserver" in window) {
    const glowCards = document.querySelectorAll(".glow-border");
    if (glowCards.length) {
      const glowObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              glowObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      glowCards.forEach(function (el) { glowObserver.observe(el); });
    }
  }

  // ── Animated bar fills on scroll ──
  const barEls = document.querySelectorAll("[data-bar-width]");
  if (barEls.length && "IntersectionObserver" in window) {
    const barObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const targetWidth = el.getAttribute("data-bar-width");
          const delay = parseInt(el.getAttribute("data-bar-delay") || "0", 10);
          setTimeout(function () {
            el.style.width = targetWidth;
          }, delay);
          barObserver.unobserve(el);
        });
      },
      { threshold: 0.3 }
    );
    barEls.forEach(function (el) {
      if (prefersReducedMotion) {
        el.style.width = el.getAttribute("data-bar-width");
      } else {
        barObserver.observe(el);
      }
    });
  }

  // ── Animated counters ──
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    if (prefersReducedMotion) {
      counters.forEach(function (el) {
        const target = el.getAttribute("data-count");
        const prefix = el.getAttribute("data-prefix") || "";
        const suffix = el.getAttribute("data-suffix") || "";
        el.textContent = prefix + target + suffix;
      });
    } else {
      const countObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = el.getAttribute("data-count");
            const prefix = el.getAttribute("data-prefix") || "";
            const suffix = el.getAttribute("data-suffix") || "";
            const num = parseFloat(target);
            const isNum = !isNaN(num);
            if (!isNum) {
              el.textContent = prefix + target + suffix;
              countObserver.unobserve(el);
              return;
            }
            const duration = 1800;
            const start = performance.now();
            function animate(now) {
              const progress = Math.min((now - start) / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(num * ease);
              el.textContent = prefix + current + suffix;
              if (progress < 1) requestAnimationFrame(animate);
              else el.textContent = prefix + target + suffix;
            }
            requestAnimationFrame(animate);
            countObserver.unobserve(el);
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  // ── Mobile: maximize hero font to fill viewport for longest word ──
  function optimizeHeroSize() {
    if (window.innerWidth >= 640) return; // desktop unchanged
    const twEl = document.querySelector("[data-typewriter]");
    if (!twEl) return;
    const line = twEl.parentElement;
    const line1 = line.previousElementSibling;
    const words = twEl.getAttribute("data-typewriter").split("|");
    const prefixEl = line.querySelector(".gradient-text");
    const prefix = prefixEl ? prefixEl.textContent : "";

    // Measure widest phrase using hidden probe with same font
    const cs = getComputedStyle(line);
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;left:-9999px;white-space:nowrap;" +
      "font:" + cs.font + ";letter-spacing:" + cs.letterSpacing;
    document.body.appendChild(probe);

    let maxW = 0;
    words.forEach(function (w) {
      probe.textContent = prefix + w;
      const pw = probe.getBoundingClientRect().width;
      if (pw > maxW) maxW = pw;
    });
    document.body.removeChild(probe);

    if (maxW > 0) {
      const curSize = parseFloat(cs.fontSize);
      // Scale so widest text fills 97% of viewport (1.5% margin each side)
      let optimal = Math.floor(curSize * (window.innerWidth * 0.97) / maxW);
      optimal = Math.min(optimal, 96); // cap at 6rem
      line.style.fontSize = optimal + "px";
      if (line1) line1.style.fontSize = optimal + "px";
    }
  }
  // Run after fonts load — use requestIdleCallback when available for non-blocking init
  function scheduleHeroSize() {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(optimizeHeroSize);
    } else {
      optimizeHeroSize();
    }
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleHeroSize);
  } else {
    scheduleHeroSize();
  }

  // ── Typewriter cycling — with visibility gating for iOS battery ──
  const typers = document.querySelectorAll("[data-typewriter]");
  typers.forEach(function (el) {
    const words = el.getAttribute("data-typewriter").split("|");
    if (words.length < 2) return;

    if (prefersReducedMotion) {
      el.textContent = words[0];
      return;
    }

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const speed = 80;
    let typeTimerId = null;
    let paused = false;

    function tick() {
      if (paused) return;
      const current = words[wordIndex];
      if (deleting) {
        charIndex--;
        el.textContent = current.substring(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          typeTimerId = setTimeout(tick, 400);
          return;
        }
        typeTimerId = setTimeout(tick, 40);
      } else {
        charIndex++;
        el.textContent = current.substring(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          typeTimerId = setTimeout(tick, 2000);
          return;
        }
        typeTimerId = setTimeout(tick, speed);
      }
    }

    typeTimerId = setTimeout(tick, 800);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        paused = true;
        if (typeTimerId) { clearTimeout(typeTimerId); typeTimerId = null; }
      } else {
        paused = false;
        typeTimerId = setTimeout(tick, 400);
      }
    });
  });

  // ── FAQ accordion toggle ──
  const faqToggles = document.querySelectorAll(".faq-toggle");
  faqToggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const parent = btn.parentElement;
      const content = parent.querySelector(".faq-content");
      const isOpen = parent.classList.contains("open");

      // Close all others
      faqToggles.forEach(function (other) {
        const otherParent = other.parentElement;
        if (otherParent !== parent && otherParent.classList.contains("open")) {
          otherParent.classList.remove("open");
          other.setAttribute("aria-expanded", "false");
          const otherContent = otherParent.querySelector(".faq-content");
          otherContent.style.maxHeight = null;
          otherContent.addEventListener("transitionend", function handler() {
            otherContent.classList.add("hidden");
            otherContent.removeEventListener("transitionend", handler);
          });
        }
      });

      if (isOpen) {
        parent.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        content.style.maxHeight = null;
        content.addEventListener("transitionend", function handler() {
          content.classList.add("hidden");
          content.removeEventListener("transitionend", handler);
        });
      } else {
        parent.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        content.classList.remove("hidden");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // ── Dashboard carousel navigation ──
  const dashTrack = document.getElementById("dash-track");
  const dashDots = document.querySelectorAll(".dash-dot");
  const dashPrev = document.querySelector(".dash-arrow-prev");
  const dashNext = document.querySelector(".dash-arrow-next");

  if (dashTrack && dashDots.length) {
    // Measure slide step dynamically (slide width + gap)
    function getSlideStep() {
      const slides = dashTrack.querySelectorAll(".dash-slide");
      if (slides.length < 2) return slides.length ? slides[0].offsetWidth + 16 : 0;
      return slides[1].offsetLeft - slides[0].offsetLeft;
    }

    function updateDashDots() {
      const step = getSlideStep();
      if (!step) return;
      let activeIndex = Math.round(dashTrack.scrollLeft / step);
      activeIndex = Math.max(0, Math.min(activeIndex, dashDots.length - 1));
      dashDots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === activeIndex);
      });
    }

    let dashScrollRafPending = false;
    dashTrack.addEventListener("scroll", function () {
      if (!dashScrollRafPending) {
        dashScrollRafPending = true;
        requestAnimationFrame(function () {
          updateDashDots();
          dashScrollRafPending = false;
        });
      }
    }, { passive: true });

    dashDots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        const step = getSlideStep();
        if (step) dashTrack.scrollTo({ left: step * i, behavior: "smooth" });
      });
    });

    if (dashPrev) {
      dashPrev.addEventListener("click", function () {
        const step = getSlideStep();
        if (step) dashTrack.scrollBy({ left: -step, behavior: "smooth" });
      });
    }

    if (dashNext) {
      dashNext.addEventListener("click", function () {
        const step = getSlideStep();
        if (step) dashTrack.scrollBy({ left: step, behavior: "smooth" });
      });
    }

    // Keyboard navigation for carousel
    var dashCarousel = document.getElementById("dash-carousel");
    if (dashCarousel) {
      dashCarousel.addEventListener("keydown", function (e) {
        var step = getSlideStep();
        if (!step) return;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          dashTrack.scrollBy({ left: step, behavior: "smooth" });
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          dashTrack.scrollBy({ left: -step, behavior: "smooth" });
        }
      });
    }

    // Update aria-current on active dot
    function updateDashDotsAria() {
      dashDots.forEach(function (dot, i) {
        if (dot.classList.contains("active")) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    }

    // Wrap original updateDashDots to also update aria
    var origUpdateDots = updateDashDots;
    updateDashDots = function () {
      origUpdateDots();
      updateDashDotsAria();
    };

    // Initial dot state
    updateDashDots();
  }

  // ── Scroll progress indicator — RAF-throttled, cached docHeight ──
  const progressBar = document.querySelector(".scroll-progress");
  if (progressBar) {
    let progressRafPending = false;
    let cachedDocHeight = document.documentElement.scrollHeight - window.innerHeight;
    // Recalculate on resize (debounced)
    let docHeightTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(docHeightTimer);
      docHeightTimer = setTimeout(function () {
        cachedDocHeight = document.documentElement.scrollHeight - window.innerHeight;
      }, 200);
    }, { passive: true });

    window.addEventListener("scroll", function () {
      if (!progressRafPending) {
        progressRafPending = true;
        requestAnimationFrame(function () {
          var progress = cachedDocHeight > 0 ? window.scrollY / cachedDocHeight : 0;
          progress = Math.max(0, Math.min(1, progress));
          progressBar.style.transform = "scaleX(" + progress + ")";
          progressRafPending = false;
        });
      }
    }, { passive: true });
  }

  // ── Cursor glow — pointer devices only (not touch iPads) ──
  if (!prefersReducedMotion && hasPointer) {
    const glow = document.querySelector(".cursor-glow");
    if (glow) {
      let glowVisible = false;
      let rafPending = false;
      let glowX = 0;
      let glowY = 0;

      document.addEventListener("mousemove", function (e) {
        glowX = e.clientX;
        glowY = e.clientY;
        if (!glowVisible) {
          glow.style.opacity = "1";
          glowVisible = true;
        }
        if (!rafPending) {
          rafPending = true;
          requestAnimationFrame(function () {
            glow.style.left = glowX + "px";
            glow.style.top = glowY + "px";
            rafPending = false;
          });
        }
      }, { passive: true });

      document.addEventListener("mouseleave", function () {
        glow.style.opacity = "0";
        glowVisible = false;
      }, { passive: true });
    }
  }

  // ── Touch ripple — purple burst on tap (mobile replacement for cursor glow) ──
  if (isTouch && !prefersReducedMotion) {
    const ripple = document.createElement("div");
    ripple.className = "touch-ripple";
    ripple.setAttribute("aria-hidden", "true");
    document.body.appendChild(ripple);

    document.addEventListener("touchstart", function (e) {
      if (!e.touches || !e.touches.length) return;
      const touch = e.touches[0];

      ripple.style.left = touch.clientX + "px";
      ripple.style.top = touch.clientY + "px";

      // Reset and replay animation
      ripple.classList.remove("active");
      void ripple.offsetWidth;
      ripple.classList.add("active");

      setTimeout(function () {
        ripple.classList.remove("active");
      }, 600);
    }, { passive: true });
  }

  // ── Platform card 3D tilt on hover (desktop pointer devices only) ──
  if (hasPointer && !prefersReducedMotion) {
    var tiltCards = document.querySelectorAll(".tilt-card");
    tiltCards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var tiltX = (0.5 - y) * 12; // max 6 degrees
        var tiltY = (x - 0.5) * 12;
        card.style.transform = "perspective(600px) rotateX(" + tiltX + "deg) rotateY(" + tiltY + "deg) translateY(-4px)";
      }, { passive: true });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      }, { passive: true });
    });
  }

  // ── Logo marquee — tap to toggle pause on touch devices, keyboard accessible ──
  const marqueeContainer = document.querySelector(".logo-marquee");
  if (marqueeContainer) {
    let marqueePaused = false;
    const marqueeParent = marqueeContainer.parentElement;

    function toggleMarquee() {
      marqueePaused = !marqueePaused;
      // Pause all marquee tracks in the section
      const allTracks = marqueeParent ? marqueeParent.parentElement.querySelectorAll(".logo-marquee") : [marqueeContainer];
      allTracks.forEach(function (track) {
        track.style.animationPlayState = marqueePaused ? "paused" : "running";
      });
    }

    if (isTouch && marqueeParent) {
      marqueeParent.addEventListener("touchstart", toggleMarquee, { passive: true });
    }

    // Keyboard-accessible pause button
    const pauseBtn = document.getElementById("marquee-pause");
    if (pauseBtn) {
      pauseBtn.addEventListener("click", function () {
        toggleMarquee();
        pauseBtn.setAttribute("aria-pressed", String(marqueePaused));
        pauseBtn.textContent = marqueePaused ? "Play" : "Pause";
      });
    }
  }

  // ── WebGL particle system + constellation lines ──
  // GPU-accelerated GL_POINTS with depth + mouse reactivity
  // 2D canvas overlay draws connecting lines between nearby particles
  // Falls back to 2D canvas on devices without WebGL support
  var canvas = document.getElementById("particle-canvas");
  if (!canvas) canvas = document.querySelector(".particle-canvas canvas");
  var conCanvas = document.getElementById("constellation-canvas");
  if (canvas && !prefersReducedMotion) {
    var particleRafId = null;
    var resizeTimer = null;
    var heroVisible = true;
    var particleCount = isTouch ? 80 : 200;
    var mouseX = 0.5, mouseY = 0.5;
    var connectDist = isTouch ? 0.09 : 0.11;
    var connectDistSq = connectDist * connectDist;
    var maxLines = isTouch ? 80 : 250;

    function resizeCanvas() {
      var newW = canvas.parentElement.offsetWidth;
      var newH = canvas.parentElement.offsetHeight;
      if (canvas.width !== newW || canvas.height !== newH) {
        canvas.width = newW;
        canvas.height = newH;
      }
      if (conCanvas && (conCanvas.width !== newW || conCanvas.height !== newH)) {
        conCanvas.width = newW;
        conCanvas.height = newH;
      }
    }
    resizeCanvas();
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resizeCanvas();
        if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
      }, 150);
    }, { passive: true });

    if (hasPointer) {
      canvas.parentElement.addEventListener("mousemove", function (e) {
        var rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width;
        mouseY = (e.clientY - rect.top) / rect.height;
      }, { passive: true });
    }

    var gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    var conCtx = conCanvas ? conCanvas.getContext("2d") : null;

    if (gl) {
      // === WebGL path ===
      var vsSource = [
        "attribute vec4 a_pos;",
        "attribute vec2 a_vel;",
        "attribute float a_phase;",
        "uniform float u_time;",
        "uniform vec2 u_mouse;",
        "uniform vec2 u_res;",
        "varying float v_alpha;",
        "void main() {",
        "  float t = u_time;",
        "  vec2 pos = a_pos.xy + a_vel * t;",
        "  pos = fract(pos);",
        "  vec2 diff = pos - u_mouse;",
        "  float dist = length(diff);",
        "  if (dist < 0.15) {",
        "    pos += normalize(diff) * (0.15 - dist) * 0.3;",
        "    pos = clamp(pos, 0.0, 1.0);",
        "  }",
        "  float depth = a_pos.z;",
        "  float flicker = 0.6 + 0.4 * sin(a_phase + t * 2.0);",
        "  v_alpha = flicker * (0.15 + depth * 0.35);",
        "  float size = a_pos.w * (0.5 + depth * 0.5);",
        "  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);",
        "  gl_PointSize = size * min(u_res.x, u_res.y) / 600.0;",
        "}"
      ].join("\n");

      var fsSource = [
        "precision mediump float;",
        "varying float v_alpha;",
        "void main() {",
        "  float d = length(gl_PointCoord - 0.5) * 2.0;",
        "  if (d > 1.0) discard;",
        "  float soft = 1.0 - d * d;",
        "  gl_FragColor = vec4(0.592, 0.459, 0.98, v_alpha * soft);",
        "}"
      ].join("\n");

      function compileShader(src, type) {
        var s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      }
      var vs = compileShader(vsSource, gl.VERTEX_SHADER);
      var fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
      var prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.useProgram(prog);

      var aPos = gl.getAttribLocation(prog, "a_pos");
      var aVel = gl.getAttribLocation(prog, "a_vel");
      var aPhase = gl.getAttribLocation(prog, "a_phase");
      var uTime = gl.getUniformLocation(prog, "u_time");
      var uMouse = gl.getUniformLocation(prog, "u_mouse");
      var uRes = gl.getUniformLocation(prog, "u_res");

      var posData = new Float32Array(particleCount * 4);
      var velData = new Float32Array(particleCount * 2);
      var phaseData = new Float32Array(particleCount);
      for (var i = 0; i < particleCount; i++) {
        posData[i * 4]     = Math.random();
        posData[i * 4 + 1] = Math.random();
        posData[i * 4 + 2] = Math.random();
        posData[i * 4 + 3] = Math.random() * 3.0 + 1.0;
        velData[i * 2]     = (Math.random() - 0.5) * 0.01;
        velData[i * 2 + 1] = (Math.random() - 0.5) * 0.008 - 0.002;
        phaseData[i]        = Math.random() * 6.283;
      }

      function createBuffer(data, attr, size) {
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(attr);
        gl.vertexAttribPointer(attr, size, gl.FLOAT, false, 0, 0);
      }
      createBuffer(posData, aPos, 4);
      createBuffer(velData, aVel, 2);
      createBuffer(phaseData, aPhase, 1);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.clearColor(0, 0, 0, 0);

      var startTime = performance.now();

      // CPU-side particle position cache for constellation lines
      var cpuPositions = new Float32Array(particleCount * 2);

      function drawGL() {
        var t = (performance.now() - startTime) / 1000;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uTime, t);
        gl.uniform2f(uMouse, mouseX, 1.0 - mouseY);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.drawArrays(gl.POINTS, 0, particleCount);

        // Constellation lines — compute positions on CPU, draw on 2D overlay
        if (conCtx) {
          var cw = conCanvas.width, ch = conCanvas.height;
          conCtx.clearRect(0, 0, cw, ch);

          var mx = mouseX, my = 1.0 - mouseY;
          for (var ci = 0; ci < particleCount; ci++) {
            var px = posData[ci * 4] + velData[ci * 2] * t;
            var py = posData[ci * 4 + 1] + velData[ci * 2 + 1] * t;
            px = px - Math.floor(px);
            py = py - Math.floor(py);
            var dx = px - mx, dy = py - my;
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d < 0.15 && d > 0.001) {
              var f = (0.15 - d) * 0.3;
              px = Math.max(0, Math.min(1, px + (dx / d) * f));
              py = Math.max(0, Math.min(1, py + (dy / d) * f));
            }
            cpuPositions[ci * 2] = px * cw;
            cpuPositions[ci * 2 + 1] = (1 - py) * ch;
          }

          conCtx.lineWidth = 0.8;
          var lc = 0;
          for (var ci = 0; ci < particleCount && lc < maxLines; ci++) {
            var ax = cpuPositions[ci * 2], ay = cpuPositions[ci * 2 + 1];
            for (var cj = ci + 1; cj < particleCount && lc < maxLines; cj++) {
              var bx = cpuPositions[cj * 2], by = cpuPositions[cj * 2 + 1];
              var ndx = (ax - bx) / cw, ndy = (ay - by) / ch;
              var ndSq = ndx * ndx + ndy * ndy;
              if (ndSq < connectDistSq) {
                var alpha = (1 - ndSq / connectDistSq) * 0.18;
                conCtx.strokeStyle = "rgba(151, 117, 250, " + alpha.toFixed(3) + ")";
                conCtx.beginPath();
                conCtx.moveTo(ax, ay);
                conCtx.lineTo(bx, by);
                conCtx.stroke();
                lc++;
              }
            }
          }
        }

        particleRafId = requestAnimationFrame(drawGL);
      }

      function startParticles() {
        if (particleRafId || document.hidden || !heroVisible) return;
        drawGL();
      }
      function stopParticles() {
        if (particleRafId) { cancelAnimationFrame(particleRafId); particleRafId = null; }
      }

      if ("IntersectionObserver" in window) {
        var heroObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            heroVisible = entry.isIntersecting;
            if (heroVisible) startParticles(); else stopParticles();
          });
        }, { threshold: 0 });
        heroObserver.observe(canvas.parentElement);
      }
      startParticles();
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stopParticles(); else startParticles();
      });

    } else {
      // === 2D Canvas fallback with constellation ===
      var ctx = canvas.getContext("2d");
      if (ctx) {
        var particles2d = [];
        var count2d = isTouch ? 30 : 60;
        for (var j = 0; j < count2d; j++) {
          particles2d.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 0.5, opacity: Math.random() * 0.4 + 0.1,
            speedX: (Math.random() - 0.5) * 0.3, speedY: (Math.random() - 0.5) * 0.2 - 0.1,
            pulse: Math.random() * Math.PI * 2
          });
        }
        function startParticles2d() { if (particleRafId || document.hidden || !heroVisible) return; draw2d(); }
        function stopParticles2d() { if (particleRafId) { cancelAnimationFrame(particleRafId); particleRafId = null; } }
        function draw2d() {
          var cw = canvas.width, ch = canvas.height;
          ctx.clearRect(0, 0, cw, ch);

          // Draw constellation lines first (behind particles)
          var cd2d = isTouch ? 80 : 120;
          var cd2dSq = cd2d * cd2d;
          ctx.lineWidth = 0.6;
          var lc2 = 0;
          for (var ci = 0; ci < particles2d.length && lc2 < maxLines; ci++) {
            var pa = particles2d[ci];
            for (var cj = ci + 1; cj < particles2d.length && lc2 < maxLines; cj++) {
              var pb = particles2d[cj];
              var ddx = pa.x - pb.x, ddy = pa.y - pb.y;
              var dSq = ddx * ddx + ddy * ddy;
              if (dSq < cd2dSq) {
                var la = (1 - dSq / cd2dSq) * 0.15;
                ctx.strokeStyle = "rgba(151, 117, 250, " + la.toFixed(3) + ")";
                ctx.beginPath();
                ctx.moveTo(pa.x, pa.y);
                ctx.lineTo(pb.x, pb.y);
                ctx.stroke();
                lc2++;
              }
            }
          }

          // Draw particles
          for (var k = 0; k < particles2d.length; k++) {
            var p = particles2d[k];
            p.x += p.speedX; p.y += p.speedY; p.pulse += 0.02;
            if (p.x < 0) p.x = cw; if (p.x > cw) p.x = 0;
            if (p.y < 0) p.y = ch; if (p.y > ch) p.y = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(151, 117, 250, " + (p.opacity * (0.7 + 0.3 * Math.sin(p.pulse))) + ")";
            ctx.fill();
          }
          particleRafId = requestAnimationFrame(draw2d);
        }
        if ("IntersectionObserver" in window) {
          var heroObs2d = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              heroVisible = entry.isIntersecting;
              if (heroVisible) startParticles2d(); else stopParticles2d();
            });
          }, { threshold: 0 });
          heroObs2d.observe(canvas.parentElement);
        }
        startParticles2d();
        document.addEventListener("visibilitychange", function () {
          if (document.hidden) stopParticles2d(); else startParticles2d();
        });
      }
    }
  }

  // ── Universal 3D card tilt with light shine (desktop pointer devices) ──
  if (hasPointer && !prefersReducedMotion) {
    var allTiltCards = document.querySelectorAll(".tilt-card");
    allTiltCards.forEach(function (card) {
      // Add shine element if not present
      var shine = card.querySelector(".card-shine");
      if (!shine) {
        shine = document.createElement("div");
        shine.className = "card-shine";
        shine.setAttribute("aria-hidden", "true");
        card.style.position = "relative";
        card.appendChild(shine);
      }

      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var tiltX = (0.5 - y) * 14;
        var tiltY = (x - 0.5) * 14;
        card.style.transform = "perspective(800px) rotateX(" + tiltX + "deg) rotateY(" + tiltY + "deg) translateY(-4px) scale(1.02)";
        shine.style.opacity = "1";
        shine.style.setProperty("--shine-x", (x * 100).toFixed(1) + "%");
        shine.style.setProperty("--shine-y", (y * 100).toFixed(1) + "%");
      }, { passive: true });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
        shine.style.opacity = "0";
      }, { passive: true });
    });
  }

  // ── Parallax scroll for hero floating shapes ──
  if (!prefersReducedMotion && !isTouch) {
    var heroShapes = document.querySelectorAll(".hero-shape");
    if (heroShapes.length) {
      var parallaxRafPending = false;
      var depths = [0.3, 0.5, 0.2, 0.6, 0.35, 0.45, 0.15, 0.25];
      window.addEventListener("scroll", function () {
        if (!parallaxRafPending) {
          parallaxRafPending = true;
          requestAnimationFrame(function () {
            var scrollY = window.scrollY;
            heroShapes.forEach(function (shape, i) {
              var depth = depths[i] || 0.3;
              var yOffset = scrollY * depth * 0.5;
              shape.style.transform = shape.style.transform || "";
              shape.style.marginTop = -yOffset + "px";
            });
            parallaxRafPending = false;
          });
        }
      }, { passive: true });
    }
  }

  // ── 3D reveal observer for new reveal-3d classes ──
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var reveal3dEls = document.querySelectorAll(".reveal-3d, .reveal-3d-left, .reveal-3d-right");
    if (reveal3dEls.length) {
      var reveal3dObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              reveal3dObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
      );
      reveal3dEls.forEach(function (el) { reveal3dObserver.observe(el); });
    }
  }
})();
