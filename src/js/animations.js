/**
 * GEO 42 Animation Engine
 * Scroll reveals, animated counters, typewriter effects, and touch interactions
 * Respects prefers-reduced-motion for all animations
 * Optimized for iOS Safari: visibility gating, touch detection, debounced resize
 * Mobile-first: touch ripple, tap-to-pause marquee, reduced particle count
 */
(function () {
  "use strict";

  var motionQuery = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  var prefersReducedMotion = motionQuery && motionQuery.matches;
  var isTouch = window.matchMedia && window.matchMedia("(hover: none)").matches;
  var hasPointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Listen for runtime reduced-motion changes (e.g. iOS Settings toggle)
  if (motionQuery && motionQuery.addEventListener) {
    motionQuery.addEventListener("change", function (e) {
      prefersReducedMotion = e.matches;
    });
  }

  // ── Scroll-triggered reveals via IntersectionObserver ──
  var isMobile = window.innerWidth < 640;
  var revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .glow-reveal");
  var staggerEls = document.querySelectorAll(".stagger, .stagger-pop");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var observer = new IntersectionObserver(
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
        var children = container.children;
        for (var i = 0; i < children.length; i++) {
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
    var glowCards = document.querySelectorAll(".glow-border");
    if (glowCards.length) {
      var glowObserver = new IntersectionObserver(
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
  var barEls = document.querySelectorAll("[data-bar-width]");
  if (barEls.length && "IntersectionObserver" in window) {
    var barObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var targetWidth = el.getAttribute("data-bar-width");
          var delay = parseInt(el.getAttribute("data-bar-delay") || "0", 10);
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
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    if (prefersReducedMotion) {
      counters.forEach(function (el) {
        var target = el.getAttribute("data-count");
        var prefix = el.getAttribute("data-prefix") || "";
        var suffix = el.getAttribute("data-suffix") || "";
        el.textContent = prefix + target + suffix;
      });
    } else {
      var countObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var target = el.getAttribute("data-count");
            var prefix = el.getAttribute("data-prefix") || "";
            var suffix = el.getAttribute("data-suffix") || "";
            var num = parseFloat(target);
            var isNum = !isNaN(num);
            if (!isNum) {
              el.textContent = prefix + target + suffix;
              countObserver.unobserve(el);
              return;
            }
            var duration = 1800;
            var start = performance.now();
            function animate(now) {
              var progress = Math.min((now - start) / duration, 1);
              var ease = 1 - Math.pow(1 - progress, 3);
              var current = Math.round(num * ease);
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
    var twEl = document.querySelector("[data-typewriter]");
    if (!twEl) return;
    var line = twEl.parentElement;
    var line1 = line.previousElementSibling;
    var words = twEl.getAttribute("data-typewriter").split("|");
    var prefixEl = line.querySelector(".gradient-text");
    var prefix = prefixEl ? prefixEl.textContent : "";

    // Measure widest phrase using hidden probe with same font
    var cs = getComputedStyle(line);
    var probe = document.createElement("span");
    probe.style.cssText = "position:absolute;left:-9999px;white-space:nowrap;" +
      "font:" + cs.font + ";letter-spacing:" + cs.letterSpacing;
    document.body.appendChild(probe);

    var maxW = 0;
    words.forEach(function (w) {
      probe.textContent = prefix + w;
      var pw = probe.getBoundingClientRect().width;
      if (pw > maxW) maxW = pw;
    });
    document.body.removeChild(probe);

    if (maxW > 0) {
      var curSize = parseFloat(cs.fontSize);
      // Scale so widest text fills 97% of viewport (1.5% margin each side)
      var optimal = Math.floor(curSize * (window.innerWidth * 0.97) / maxW);
      optimal = Math.min(optimal, 96); // cap at 6rem
      line.style.fontSize = optimal + "px";
      if (line1) line1.style.fontSize = optimal + "px";
    }
  }
  // Run after fonts load for accurate measurement
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(optimizeHeroSize);
  } else {
    optimizeHeroSize();
  }

  // ── Typewriter cycling — with visibility gating for iOS battery ──
  var typers = document.querySelectorAll("[data-typewriter]");
  typers.forEach(function (el) {
    var words = el.getAttribute("data-typewriter").split("|");
    if (words.length < 2) return;

    if (prefersReducedMotion) {
      el.textContent = words[0];
      return;
    }

    var wordIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var speed = 80;
    var typeTimerId = null;
    var paused = false;

    function tick() {
      if (paused) return;
      var current = words[wordIndex];
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
  var faqToggles = document.querySelectorAll(".faq-toggle");
  faqToggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var parent = btn.parentElement;
      var content = parent.querySelector(".faq-content");
      var isOpen = parent.classList.contains("open");

      // Close all others
      faqToggles.forEach(function (other) {
        var otherParent = other.parentElement;
        if (otherParent !== parent && otherParent.classList.contains("open")) {
          otherParent.classList.remove("open");
          other.setAttribute("aria-expanded", "false");
          var otherContent = otherParent.querySelector(".faq-content");
          otherContent.style.maxHeight = null;
          setTimeout(function () { otherContent.classList.add("hidden"); }, 300);
        }
      });

      if (isOpen) {
        parent.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        content.style.maxHeight = null;
        setTimeout(function () { content.classList.add("hidden"); }, 300);
      } else {
        parent.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        content.classList.remove("hidden");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // ── Dashboard carousel navigation ──
  var dashTrack = document.getElementById("dash-track");
  var dashDots = document.querySelectorAll(".dash-dot");
  var dashPrev = document.querySelector(".dash-arrow-prev");
  var dashNext = document.querySelector(".dash-arrow-next");

  if (dashTrack && dashDots.length) {
    // Measure slide step dynamically (slide width + gap)
    function getSlideStep() {
      var slides = dashTrack.querySelectorAll(".dash-slide");
      if (slides.length < 2) return slides.length ? slides[0].offsetWidth + 16 : 0;
      return slides[1].offsetLeft - slides[0].offsetLeft;
    }

    function updateDashDots() {
      var step = getSlideStep();
      if (!step) return;
      var activeIndex = Math.round(dashTrack.scrollLeft / step);
      activeIndex = Math.max(0, Math.min(activeIndex, dashDots.length - 1));
      dashDots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === activeIndex);
      });
    }

    dashTrack.addEventListener("scroll", updateDashDots, { passive: true });

    dashDots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        var step = getSlideStep();
        if (step) dashTrack.scrollTo({ left: step * i, behavior: "smooth" });
      });
    });

    if (dashPrev) {
      dashPrev.addEventListener("click", function () {
        var step = getSlideStep();
        if (step) dashTrack.scrollBy({ left: -step, behavior: "smooth" });
      });
    }

    if (dashNext) {
      dashNext.addEventListener("click", function () {
        var step = getSlideStep();
        if (step) dashTrack.scrollBy({ left: step, behavior: "smooth" });
      });
    }

    // Initial dot state
    updateDashDots();
  }

  // ── Scroll progress indicator — clamped for iOS rubber-band scrolling ──
  var progressBar = document.querySelector(".scroll-progress");
  if (progressBar) {
    window.addEventListener("scroll", function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progress = Math.max(0, Math.min(100, progress));
      progressBar.style.width = progress + "%";
    }, { passive: true });
  }

  // ── Cursor glow — pointer devices only (not touch iPads) ──
  if (!prefersReducedMotion && hasPointer) {
    var glow = document.querySelector(".cursor-glow");
    if (glow) {
      var glowVisible = false;
      var rafPending = false;
      var glowX = 0;
      var glowY = 0;

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
    var ripple = document.createElement("div");
    ripple.className = "touch-ripple";
    ripple.setAttribute("aria-hidden", "true");
    document.body.appendChild(ripple);

    document.addEventListener("touchstart", function (e) {
      if (!e.touches || !e.touches.length) return;
      var touch = e.touches[0];

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

  // ── Logo marquee — tap to toggle pause on touch devices ──
  if (isTouch) {
    var marqueeContainer = document.querySelector(".logo-marquee");
    if (marqueeContainer) {
      var marqueePaused = false;
      var marqueeParent = marqueeContainer.parentElement;
      if (marqueeParent) {
        marqueeParent.addEventListener("touchstart", function () {
          marqueePaused = !marqueePaused;
          marqueeContainer.style.animationPlayState = marqueePaused ? "paused" : "running";
        }, { passive: true });
      }
    }
  }

  // ── Gold particle canvas — with visibility + viewport gating ──
  var canvas = document.querySelector(".particle-canvas canvas");
  if (canvas && !prefersReducedMotion) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var particleCount = isTouch ? 20 : 40;
    var particleRafId = null;
    var resizeTimer = null;
    var heroVisible = true;

    function resizeCanvas() {
      var newW = canvas.parentElement.offsetWidth;
      var newH = canvas.parentElement.offsetHeight;
      if (canvas.width !== newW || canvas.height !== newH) {
        canvas.width = newW;
        canvas.height = newH;
      }
    }
    resizeCanvas();

    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 150);
    }, { passive: true });

    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.2 - 0.1,
        pulse: Math.random() * Math.PI * 2
      });
    }

    function startParticles() {
      if (particleRafId || document.hidden || !heroVisible) return;
      drawParticles();
    }

    function stopParticles() {
      if (particleRafId) {
        cancelAnimationFrame(particleRafId);
        particleRafId = null;
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var j = 0; j < particles.length; j++) {
        var p = particles[j];
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.02;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        var flickerOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(151, 117, 250, " + flickerOpacity + ")";
        ctx.fill();
      }
      particleRafId = requestAnimationFrame(drawParticles);
    }

    // IntersectionObserver to pause particles when hero is off-screen
    if ("IntersectionObserver" in window) {
      var heroObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            heroVisible = entry.isIntersecting;
            if (heroVisible) startParticles();
            else stopParticles();
          });
        },
        { threshold: 0 }
      );
      heroObserver.observe(canvas.parentElement);
    }

    startParticles();

    // Pause when page is hidden (iOS battery optimization)
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopParticles();
      else startParticles();
    });
  }
})();
