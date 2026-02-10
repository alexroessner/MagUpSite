/**
 * GEO 42 — Three.js Hero 3D Scene
 * Wireframe icosahedron with breathing vertices, orbital rings,
 * floating satellite shapes, wireframe terrain, physically-based lighting.
 * Desktop-only: skipped on touch devices / reduced motion for performance.
 */
import * as THREE from "three";

(function () {
  "use strict";

  var isTouch = window.matchMedia && window.matchMedia("(hover: none)").matches;
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isTouch || reducedMotion) return;

  var canvas = document.getElementById("hero-3d");
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
  renderer.toneMappingExposure = 2.0;
  renderer.setSize(w, h);

  // ── Scene ──
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0620, 0.04);

  // ── Camera ──
  var camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
  camera.position.set(0, 1.5, 7);
  camera.lookAt(0, 0, 0);

  // ── Central wireframe icosahedron ──
  var icoDetail = 2;
  var icoGeo = new THREE.IcosahedronGeometry(2.2, icoDetail);
  var icosahedron = new THREE.Mesh(icoGeo, new THREE.MeshBasicMaterial({
    color: 0x9775FA,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  }));
  scene.add(icosahedron);

  // Inner solid — emissive purple glow
  var innerMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.1, icoDetail),
    new THREE.MeshStandardMaterial({
      color: 0x110B30,
      emissive: 0x9775FA,
      emissiveIntensity: 0.04,
      metalness: 0.7,
      roughness: 0.4,
      transparent: true,
      opacity: 0.2
    })
  );
  scene.add(innerMesh);

  // Store original positions for breathing displacement
  var origPos = new Float32Array(icoGeo.attributes.position.array);

  // ── Outer wireframe shell (counter-rotating) ──
  var outerShell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.0, 1),
    new THREE.MeshBasicMaterial({
      color: 0x9775FA,
      wireframe: true,
      transparent: true,
      opacity: 0.05
    })
  );
  scene.add(outerShell);

  // ── Orbital rings ──
  var ringMat = new THREE.MeshBasicMaterial({
    color: 0x9775FA,
    transparent: true,
    opacity: 0.16
  });

  var ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.015, 8, 100), ringMat);
  ring1.rotation.x = Math.PI / 3;
  scene.add(ring1);

  var ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(3.5, 0.015, 8, 100),
    new THREE.MeshBasicMaterial({ color: 0x9775FA, transparent: true, opacity: 0.09 })
  );
  ring2.rotation.x = -Math.PI / 4;
  ring2.rotation.z = Math.PI / 5;
  scene.add(ring2);

  var ring3 = new THREE.Mesh(
    new THREE.TorusGeometry(4.5, 0.01, 8, 100),
    new THREE.MeshBasicMaterial({ color: 0xB197FC, transparent: true, opacity: 0.05 })
  );
  ring3.rotation.x = Math.PI / 2.5;
  ring3.rotation.y = Math.PI / 6;
  scene.add(ring3);

  // ── Floating satellite shapes ──
  var shapeGeos = [
    new THREE.OctahedronGeometry(0.12, 0),
    new THREE.TetrahedronGeometry(0.14, 0),
    new THREE.IcosahedronGeometry(0.1, 0)
  ];
  var satellites = [];

  for (var i = 0; i < 18; i++) {
    var m = new THREE.Mesh(shapeGeos[i % 3], new THREE.MeshBasicMaterial({
      color: 0xB197FC,
      wireframe: true,
      transparent: true,
      opacity: 0.1 + Math.random() * 0.22
    }));
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos(Math.random() * 2 - 1);
    var r = 3.5 + Math.random() * 5;
    m.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
    m.userData = { theta: theta, phi: phi, r: r, speed: 0.04 + Math.random() * 0.12, rs: Math.random() * 0.015 };
    scene.add(m);
    satellites.push(m);
  }

  // ── Wireframe terrain floor — FBM-like displacement ──
  var terrainRes = 45;
  var terrainGeo = new THREE.PlaneGeometry(50, 50, terrainRes, terrainRes);
  terrainGeo.rotateX(-Math.PI / 2);

  function fbm(x, z, t) {
    return Math.sin(x * 0.12 + t * 0.08) * Math.cos(z * 0.12 + t * 0.06) * 1.0
         + Math.sin(x * 0.25 + 1.5) * Math.cos(z * 0.3 + 0.8) * 0.5
         + Math.sin(x * 0.5 + 3.0) * Math.cos(z * 0.45 + 2.0) * 0.25
         + Math.sin(x * 1.0 + 5.0) * Math.cos(z * 0.8 + 4.0) * 0.12;
  }

  // Initial displacement
  var tPos = terrainGeo.attributes.position.array;
  for (var ti = 0; ti < tPos.length; ti += 3) {
    tPos[ti + 1] = fbm(tPos[ti], tPos[ti + 2], 0);
  }
  terrainGeo.computeVertexNormals();

  var terrain = new THREE.Mesh(terrainGeo, new THREE.MeshBasicMaterial({
    color: 0x9775FA,
    wireframe: true,
    transparent: true,
    opacity: 0.03
  }));
  terrain.position.y = -5;
  scene.add(terrain);

  // ── Point cloud (ambient floating dust) ──
  var dustCount = 120;
  var dustPositions = new Float32Array(dustCount * 3);
  for (var di = 0; di < dustCount; di++) {
    dustPositions[di * 3] = (Math.random() - 0.5) * 20;
    dustPositions[di * 3 + 1] = (Math.random() - 0.5) * 12;
    dustPositions[di * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  var dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  var dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0xB197FC,
    size: 0.03,
    transparent: true,
    opacity: 0.35,
    sizeAttenuation: true
  }));
  scene.add(dust);

  // ── Lighting ──
  scene.add(new THREE.HemisphereLight(0x1a1040, 0x050208, 0.4));

  var pLight1 = new THREE.PointLight(0x9775FA, 4, 30, 2);
  pLight1.position.set(4, 2, 4);
  scene.add(pLight1);

  var pLight2 = new THREE.PointLight(0x7C5CF7, 2.5, 25, 2);
  pLight2.position.set(-3, -1, 3);
  scene.add(pLight2);

  // ── Mouse tracking ──
  var mouseX = 0, mouseY = 0, targetMX = 0, targetMY = 0;
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
    }, 150);
  }, { passive: true });

  // ── Animation loop ──
  var clock = new THREE.Clock();
  var rafId = null;
  var heroVisible = true;

  function animate() {
    rafId = requestAnimationFrame(animate);
    if (!heroVisible || document.hidden) return;

    var t = clock.getElapsedTime();

    // Central geometry rotation
    icosahedron.rotation.x = t * 0.05;
    icosahedron.rotation.y = t * 0.08;
    innerMesh.rotation.x = t * 0.05;
    innerMesh.rotation.y = t * 0.08;

    // Outer shell counter-rotation
    outerShell.rotation.x = -t * 0.03;
    outerShell.rotation.y = -t * 0.05;

    // Vertex breathing
    var pos = icoGeo.attributes.position.array;
    for (var vi = 0; vi < pos.length; vi += 3) {
      var ox = origPos[vi], oy = origPos[vi + 1], oz = origPos[vi + 2];
      var n = Math.sin(ox * 2 + t * 0.6) * Math.cos(oy * 2 + t * 0.4) * Math.sin(oz * 1.5 + t * 0.5) * 0.07;
      pos[vi] = ox * (1 + n);
      pos[vi + 1] = oy * (1 + n);
      pos[vi + 2] = oz * (1 + n);
    }
    icoGeo.attributes.position.needsUpdate = true;

    // Ring rotation
    ring1.rotation.z = t * 0.1;
    ring2.rotation.y = t * 0.08;
    ring3.rotation.z = -t * 0.06;

    // Satellite orbits
    for (var si = 0; si < satellites.length; si++) {
      var sat = satellites[si];
      sat.userData.theta += sat.userData.speed * 0.006;
      var th = sat.userData.theta, ph = sat.userData.phi, sr = sat.userData.r;
      sat.position.x = sr * Math.sin(ph) * Math.cos(th);
      sat.position.y = sr * Math.sin(ph) * Math.sin(th) + Math.sin(t * 0.25 + si) * 0.15;
      sat.position.z = sr * Math.cos(ph);
      sat.rotation.x += sat.userData.rs;
      sat.rotation.y += sat.userData.rs * 0.7;
    }

    // Terrain wave animation (only first FBM octave moves)
    var tp = terrainGeo.attributes.position.array;
    for (var tii = 0; tii < tp.length; tii += 3) {
      tp[tii + 1] = fbm(tp[tii], tp[tii + 2], t);
    }
    terrainGeo.attributes.position.needsUpdate = true;

    // Dust rotation
    dust.rotation.y = t * 0.02;

    // Orbit lights
    pLight1.position.x = Math.cos(t * 0.2) * 5;
    pLight1.position.z = Math.sin(t * 0.2) * 5;
    pLight1.position.y = 2 + Math.sin(t * 0.35);
    pLight2.position.x = Math.cos(t * 0.3 + 2) * 4;
    pLight2.position.z = Math.sin(t * 0.3 + 2) * 4;

    // Mouse parallax (smooth)
    mouseX += (targetMX - mouseX) * 0.03;
    mouseY += (targetMY - mouseY) * 0.03;
    camera.position.x = mouseX * 1.5;
    camera.position.y = 1.5 - mouseY * 0.7;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  // ── Visibility gating ──
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { heroVisible = entry.isIntersecting; });
    }, { threshold: 0 }).observe(parent);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    } else if (!rafId) {
      animate();
    }
  });

  animate();
})();
