/**
 * GEO 42 Animation Engine
 * Scroll reveals, animated counters, and typewriter effects
 * Respects prefers-reduced-motion for all animations
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Scroll-triggered reveals via IntersectionObserver ──
  var revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger, .stagger-pop, .glow-reveal");
  if (revealEls.length && "IntersectionObserver" in window && !prefersReducedMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(function (el) { el.classList.add("visible"); });
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
      // Show final values immediately for reduced motion
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

  // ── Typewriter cycling ──
  var typers = document.querySelectorAll("[data-typewriter]");
  typers.forEach(function (el) {
    var words = el.getAttribute("data-typewriter").split("|");
    if (words.length < 2) return;

    // Show first word statically for reduced motion
    if (prefersReducedMotion) {
      el.textContent = words[0];
      return;
    }

    var wordIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var speed = 80;

    function tick() {
      var current = words[wordIndex];
      if (deleting) {
        charIndex--;
        el.textContent = current.substring(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 40);
      } else {
        charIndex++;
        el.textContent = current.substring(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 2000);
          return;
        }
        setTimeout(tick, speed);
      }
    }

    setTimeout(tick, 800);
  });

  // ── Scroll progress indicator ──
  var progressBar = document.querySelector(".scroll-progress");
  if (progressBar) {
    window.addEventListener("scroll", function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + "%";
    }, { passive: true });
  }

  // ── Cursor glow — desktop only ──
  if (!prefersReducedMotion && window.innerWidth > 768) {
    var glow = document.querySelector(".cursor-glow");
    if (glow) {
      var glowVisible = false;
      document.addEventListener("mousemove", function (e) {
        if (!glowVisible) {
          glow.style.opacity = "1";
          glowVisible = true;
        }
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      }, { passive: true });

      document.addEventListener("mouseleave", function () {
        glow.style.opacity = "0";
        glowVisible = false;
      });
    }
  }

  // ── Gold particle canvas — floating dots in hero ──
  var canvas = document.querySelector(".particle-canvas canvas");
  if (canvas && !prefersReducedMotion) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var particleCount = 40;

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

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

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var j = 0; j < particles.length; j++) {
        var p = particles[j];
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.02;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        var flickerOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(212, 160, 23, " + flickerOpacity + ")";
        ctx.fill();
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }
})();
