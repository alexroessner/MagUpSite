/**
 * GEO 42 — Three.js Flywheel Scene
 * Replaces SVG flywheel with real 3D: three interlocking torus rings,
 * glowing nodes at vertices, central hub, physically-based lighting.
 * No continuous rotation (per user preference) — gentle bob + pulse.
 * Desktop-only, visibility-gated.
 */
import * as THREE from "three";

(function () {
  "use strict";

  var isTouch = window.matchMedia && window.matchMedia("(hover: none)").matches;
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isTouch || reducedMotion) return;

  var canvas = document.getElementById("flywheel-3d");
  if (!canvas) return;

  var container = canvas.parentElement;
  var w = container.offsetWidth;
  var h = container.offsetHeight;

  // ── Renderer ──
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 2.5;
  renderer.setSize(w, h);

  // ── Scene ──
  var scene = new THREE.Scene();

  // ── Camera ──
  var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50);
  camera.position.set(0, 0.8, 5.5);
  camera.lookAt(0, 0, 0);

  // ── Three interlocking rings (gimbal arrangement) ──
  var ringRadius = 1.8;
  var tubeRadius = 0.02;
  var ringSegments = 80;

  // Ring materials — each a slightly different purple
  var r1Mat = new THREE.MeshStandardMaterial({
    color: 0xB197FC, emissive: 0xB197FC, emissiveIntensity: 0.15,
    metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.7
  });
  var r2Mat = new THREE.MeshStandardMaterial({
    color: 0x9775FA, emissive: 0x9775FA, emissiveIntensity: 0.15,
    metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.7
  });
  var r3Mat = new THREE.MeshStandardMaterial({
    color: 0x7C5CF7, emissive: 0x7C5CF7, emissiveIntensity: 0.15,
    metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.7
  });

  var fwRing1 = new THREE.Mesh(new THREE.TorusGeometry(ringRadius, tubeRadius, 16, ringSegments), r1Mat);
  fwRing1.rotation.x = 0; // horizontal
  scene.add(fwRing1);

  var fwRing2 = new THREE.Mesh(new THREE.TorusGeometry(ringRadius, tubeRadius, 16, ringSegments), r2Mat);
  fwRing2.rotation.x = Math.PI / 3; // tilted 60°
  fwRing2.rotation.z = Math.PI / 6;
  scene.add(fwRing2);

  var fwRing3 = new THREE.Mesh(new THREE.TorusGeometry(ringRadius, tubeRadius, 16, ringSegments), r3Mat);
  fwRing3.rotation.x = -Math.PI / 3; // tilted -60°
  fwRing3.rotation.z = -Math.PI / 6;
  scene.add(fwRing3);

  // ── Wireframe duplicates for depth ──
  var wireRingMat = new THREE.MeshBasicMaterial({
    color: 0x9775FA, wireframe: true, transparent: true, opacity: 0.06
  });
  var wRing = new THREE.Mesh(new THREE.TorusGeometry(ringRadius * 1.3, 0.01, 8, 60), wireRingMat);
  wRing.rotation.x = Math.PI / 4;
  scene.add(wRing);

  // ── Three glowing nodes at ring vertices ──
  var nodeGeo = new THREE.SphereGeometry(0.08, 16, 16);
  var nodePositions = [
    { pos: [0, ringRadius, 0], color: 0xB197FC },       // top — Become the Answer
    { pos: [ringRadius * 0.866, -ringRadius * 0.5, 0], color: 0x9775FA },  // bottom-right — Win Trust
    { pos: [-ringRadius * 0.866, -ringRadius * 0.5, 0], color: 0x7C5CF7 }  // bottom-left — Facilitate
  ];

  var nodes = [];
  for (var ni = 0; ni < nodePositions.length; ni++) {
    var nd = nodePositions[ni];
    var nodeMat = new THREE.MeshStandardMaterial({
      color: nd.color, emissive: nd.color, emissiveIntensity: 0.6,
      metalness: 0.8, roughness: 0.2
    });
    var nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
    nodeMesh.position.set(nd.pos[0], nd.pos[1], nd.pos[2]);
    scene.add(nodeMesh);
    nodes.push(nodeMesh);

    // Glow sprite around each node
    var spriteMat = new THREE.SpriteMaterial({
      color: nd.color, transparent: true, opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    var sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(0.5, 0.5, 1);
    sprite.position.copy(nodeMesh.position);
    scene.add(sprite);
    nodeMesh.userData.sprite = sprite;
  }

  // ── Central hub ──
  var hubGeo = new THREE.SphereGeometry(0.35, 24, 24);
  var hubMat = new THREE.MeshStandardMaterial({
    color: 0x1A1242, emissive: 0x9775FA, emissiveIntensity: 0.08,
    metalness: 0.9, roughness: 0.2, transparent: true, opacity: 0.85
  });
  var hub = new THREE.Mesh(hubGeo, hubMat);
  scene.add(hub);

  // Hub wireframe overlay
  var hubWire = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0x9775FA, wireframe: true, transparent: true, opacity: 0.15 })
  );
  scene.add(hubWire);

  // ── Connecting lines from hub to nodes ──
  for (var li = 0; li < nodes.length; li++) {
    var lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      nodes[li].position
    ]);
    var lineMat = new THREE.LineBasicMaterial({
      color: 0x9775FA, transparent: true, opacity: 0.12
    });
    scene.add(new THREE.Line(lineGeo, lineMat));
  }

  // ── Floating micro-particles around the flywheel ──
  var pCount = 60;
  var pPositions = new Float32Array(pCount * 3);
  for (var pi = 0; pi < pCount; pi++) {
    var pTheta = Math.random() * Math.PI * 2;
    var pPhi = Math.acos(Math.random() * 2 - 1);
    var pR = 2.0 + Math.random() * 1.5;
    pPositions[pi * 3] = pR * Math.sin(pPhi) * Math.cos(pTheta);
    pPositions[pi * 3 + 1] = pR * Math.sin(pPhi) * Math.sin(pTheta);
    pPositions[pi * 3 + 2] = pR * Math.cos(pPhi);
  }
  var particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
  var particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({
    color: 0xB197FC, size: 0.025, transparent: true, opacity: 0.4, sizeAttenuation: true
  }));
  scene.add(particles);

  // ── Lighting ──
  scene.add(new THREE.HemisphereLight(0x1a1040, 0x050208, 0.5));
  var centerLight = new THREE.PointLight(0x9775FA, 3, 10, 2);
  centerLight.position.set(0, 0, 0);
  scene.add(centerLight);
  var topLight = new THREE.PointLight(0xB197FC, 1.5, 8, 2);
  topLight.position.set(0, 3, 2);
  scene.add(topLight);

  // ── Mouse tracking ──
  var targetMX = 0, targetMY = 0, mX = 0, mY = 0;
  container.addEventListener("mousemove", function (e) {
    var rect = container.getBoundingClientRect();
    targetMX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    targetMY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }, { passive: true });
  container.addEventListener("mouseleave", function () {
    targetMX = 0; targetMY = 0;
  }, { passive: true });

  // ── Resize ──
  var resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var nw = container.offsetWidth;
      var nh = container.offsetHeight;
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

    // Gentle bob — entire scene
    var bobY = Math.sin(t * 0.4) * 0.08;
    fwRing1.position.y = bobY;
    fwRing2.position.y = bobY;
    fwRing3.position.y = bobY;
    hub.position.y = bobY;
    hubWire.position.y = bobY;

    // Very subtle ring breathing (scale pulse)
    var breathe = 1 + Math.sin(t * 0.6) * 0.015;
    fwRing1.scale.setScalar(breathe);
    fwRing2.scale.setScalar(breathe);
    fwRing3.scale.setScalar(breathe);

    // Node glow pulse
    for (var ni = 0; ni < nodes.length; ni++) {
      var node = nodes[ni];
      var pulse = 0.4 + Math.sin(t * 0.8 + ni * 2.1) * 0.2;
      node.material.emissiveIntensity = pulse;
      node.position.y = nodePositions[ni].pos[1] + bobY;
      if (node.userData.sprite) {
        node.userData.sprite.position.y = node.position.y;
        node.userData.sprite.material.opacity = 0.15 + Math.sin(t * 0.8 + ni * 2.1) * 0.12;
      }
    }

    // Hub pulse
    hubMat.emissiveIntensity = 0.06 + Math.sin(t * 0.5) * 0.03;
    hubWire.rotation.y = t * 0.15;

    // Outer wireframe ring slow drift
    wRing.rotation.z = t * 0.05;
    wRing.position.y = bobY;

    // Particles slow orbit
    particles.rotation.y = t * 0.03;

    // Center light pulse
    centerLight.intensity = 2.5 + Math.sin(t * 0.5) * 0.8;

    // Mouse parallax
    mX += (targetMX - mX) * 0.05;
    mY += (targetMY - mY) * 0.05;
    camera.position.x = mX * 0.8;
    camera.position.y = 0.8 - mY * 0.5 + bobY * 0.3;
    camera.lookAt(0, bobY * 0.5, 0);

    renderer.render(scene, camera);
  }

  // ── Visibility gating — start only when scrolled into view ──
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible && !rafId) animate();
      });
    }, { threshold: 0, rootMargin: "100px" }).observe(container);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    } else if (isVisible && !rafId) { animate(); }
  });
})();
