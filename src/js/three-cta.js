/**
 * GEO 42 — Three.js CTA Terrain Crescendo
 * Wireframe terrain with rising peaks and ascending particles.
 * Bookends the hero scene: terrain returns at the page climax.
 * Desktop-only, visibility-gated.
 */
import * as THREE from "three";

(function () {
  "use strict";

  var isTouch = window.matchMedia && window.matchMedia("(hover: none)").matches;
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isTouch || reducedMotion) return;

  var canvas = document.getElementById("cta-3d");
  if (!canvas) return;

  var parent = canvas.parentElement;
  var w = parent.offsetWidth;
  var h = parent.offsetHeight;

  // ── Renderer ──
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 1.8;
  renderer.setSize(w, h);

  // ── Scene ──
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0620, 0.025);

  // ── Camera — looking slightly upward like approaching mountains ──
  var camera = new THREE.PerspectiveCamera(65, w / h, 0.1, 100);
  camera.position.set(0, 2, 8);
  camera.lookAt(0, 1.5, -5);

  // ── Terrain — taller peaks than hero, more dramatic ──
  var terrainGeo = new THREE.PlaneGeometry(60, 60, 55, 55);
  terrainGeo.rotateX(-Math.PI / 2);

  function ctaFbm(x, z, t) {
    return Math.sin(x * 0.1 + t * 0.05) * Math.cos(z * 0.1 + t * 0.04) * 2.5
         + Math.sin(x * 0.2 + 1.5) * Math.cos(z * 0.25 + 0.8) * 1.2
         + Math.sin(x * 0.4 + 3.0) * Math.cos(z * 0.35 + 2.0) * 0.6
         + Math.sin(x * 0.8 + 5.0) * Math.cos(z * 0.6 + 4.0) * 0.3;
  }

  var tPos = terrainGeo.attributes.position.array;
  for (var ti = 0; ti < tPos.length; ti += 3) {
    tPos[ti + 1] = ctaFbm(tPos[ti], tPos[ti + 2], 0);
  }
  terrainGeo.computeVertexNormals();

  var terrainMat = new THREE.MeshBasicMaterial({
    color: 0x9775FA, wireframe: true, transparent: true, opacity: 0.045
  });
  var terrain = new THREE.Mesh(terrainGeo, terrainMat);
  terrain.position.y = -3;
  terrain.position.z = -8;
  scene.add(terrain);

  // ── Ascending particles — streams upward like rising data ──
  var particleCount = 200;
  var pPositions = new Float32Array(particleCount * 3);
  var pVelocities = new Float32Array(particleCount);
  var pSizes = new Float32Array(particleCount);

  for (var pi = 0; pi < particleCount; pi++) {
    pPositions[pi * 3] = (Math.random() - 0.5) * 30;
    pPositions[pi * 3 + 1] = Math.random() * 20 - 5;
    pPositions[pi * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
    pVelocities[pi] = 0.3 + Math.random() * 0.7;
    pSizes[pi] = 0.02 + Math.random() * 0.03;
  }

  var particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));

  var particleMat = new THREE.PointsMaterial({
    color: 0xB197FC, size: 0.035, transparent: true, opacity: 0.5,
    sizeAttenuation: true, blending: THREE.AdditiveBlending
  });
  var particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ── Central ascending geometry — icosahedron emerging from terrain ──
  var ascendGeo = new THREE.IcosahedronGeometry(1.2, 1);
  var ascendMat = new THREE.MeshBasicMaterial({
    color: 0x9775FA, wireframe: true, transparent: true, opacity: 0.12
  });
  var ascendShape = new THREE.Mesh(ascendGeo, ascendMat);
  ascendShape.position.set(0, 2, -3);
  scene.add(ascendShape);

  var ascendInner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.0, 1),
    new THREE.MeshStandardMaterial({
      color: 0x110B30, emissive: 0x9775FA, emissiveIntensity: 0.06,
      metalness: 0.7, roughness: 0.3, transparent: true, opacity: 0.15
    })
  );
  ascendInner.position.copy(ascendShape.position);
  scene.add(ascendInner);

  // ── Orbital ring around ascending shape ──
  var ctaRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.0, 0.012, 8, 80),
    new THREE.MeshBasicMaterial({ color: 0xB197FC, transparent: true, opacity: 0.1 })
  );
  ctaRing.position.copy(ascendShape.position);
  ctaRing.rotation.x = Math.PI / 3;
  scene.add(ctaRing);

  // ── Lighting ──
  scene.add(new THREE.HemisphereLight(0x1a1040, 0x050208, 0.3));

  var glow = new THREE.PointLight(0x9775FA, 3, 20, 2);
  glow.position.set(0, 4, -3);
  scene.add(glow);

  var rimLight = new THREE.PointLight(0x7C5CF7, 2, 15, 2);
  rimLight.position.set(-5, 1, 0);
  scene.add(rimLight);

  // ── Scroll-driven reveal (mountains grow when visible) ──
  var revealProgress = 0;
  var targetReveal = 0;

  // ── Mouse tracking ──
  var targetMX = 0, targetMY = 0, mX = 0, mY = 0;
  document.addEventListener("mousemove", function (e) {
    targetMX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // ── Resize ──
  var resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var nw = parent.offsetWidth;
      var nh = parent.offsetHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    }, 200);
  }, { passive: true });

  // ── Animation ──
  var clock = new THREE.Clock();
  var isVisible = false;
  var rafId = null;

  function animate() {
    rafId = requestAnimationFrame(animate);
    if (!isVisible || document.hidden) return;

    var t = clock.getElapsedTime();

    // Smooth reveal ramp-up
    revealProgress += (targetReveal - revealProgress) * 0.02;
    var rp = revealProgress;

    // Terrain animation — wave + scale by reveal
    var tp = terrainGeo.attributes.position.array;
    for (var tii = 0; tii < tp.length; tii += 3) {
      tp[tii + 1] = ctaFbm(tp[tii], tp[tii + 2], t) * rp;
    }
    terrainGeo.attributes.position.needsUpdate = true;
    terrainMat.opacity = 0.045 * rp;

    // Ascending particles — move upward, reset when above view
    var pp = particleGeo.attributes.position.array;
    for (var pii = 0; pii < particleCount; pii++) {
      pp[pii * 3 + 1] += pVelocities[pii] * 0.02 * rp;
      // Reset when too high
      if (pp[pii * 3 + 1] > 15) {
        pp[pii * 3 + 1] = -5;
        pp[pii * 3] = (Math.random() - 0.5) * 30;
        pp[pii * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
      }
    }
    particleGeo.attributes.position.needsUpdate = true;
    particleMat.opacity = 0.5 * rp;

    // Ascending shape — hover + slow rotation
    ascendShape.position.y = 2 + Math.sin(t * 0.3) * 0.15;
    ascendShape.rotation.x = t * 0.04;
    ascendShape.rotation.y = t * 0.06;
    ascendMat.opacity = 0.12 * rp;

    ascendInner.position.y = ascendShape.position.y;
    ascendInner.rotation.x = t * 0.04;
    ascendInner.rotation.y = t * 0.06;

    ctaRing.position.y = ascendShape.position.y;
    ctaRing.rotation.z = t * 0.08;

    // Glow pulse
    glow.intensity = (2.5 + Math.sin(t * 0.4) * 0.8) * rp;

    // Mouse parallax
    mX += (targetMX - mX) * 0.02;
    mY += (targetMY - mY) * 0.02;
    camera.position.x = mX * 0.8;
    camera.position.y = 2 - mY * 0.4;
    camera.lookAt(0, 1.5 + Math.sin(t * 0.2) * 0.1, -5);

    renderer.render(scene, camera);
  }

  // ── Visibility gating + scroll-driven reveal ──
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible) {
          targetReveal = 1;
          if (!wasVisible && !rafId) animate();
        }
      });
    }, { threshold: 0, rootMargin: "50px" }).observe(parent);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    } else if (isVisible && !rafId) { animate(); }
  });
})();
