import * as THREE from 'three';
import { projects } from './data.js';

const state = {
  progress: 0,
  pointerX: 0,
  pointerY: 0,
  activeProject: null
};

let scene;
let camera;
let renderer;
let laptop;
let hotspotMeshes = [];
let particles;
let ocean;
let rafId = 0;
let resizeHandler;
let pointerMoveHandler;
let pointerLeaveHandler;
let clickHandler;
let raycaster;
let mouse;
let canvas;
let modalCallback = null;
let running = false;
let lowPower = false;
let visibilityHandler = null;

function buildLaptop() {
  const group = new THREE.Group();
  group.name = 'laptop';

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x1b1b1b,
    metalness: 0.9,
    roughness: 0.3,
    clearcoat: 0.8,
    clearcoatRoughness: 0.12
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x080808,
    metalness: 0.2,
    roughness: 0.12,
    transparent: true,
    opacity: 0.9
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xd6b26e,
    metalness: 1,
    roughness: 0.18
  });

  const base = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.18, 2.55), bodyMat);
  base.position.y = -0.75;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const deck = new THREE.Mesh(new THREE.BoxGeometry(3.68, 0.07, 2.42), new THREE.MeshStandardMaterial({
    color: 0x202020,
    metalness: 0.85,
    roughness: 0.25
  }));
  deck.position.y = -0.62;
  group.add(deck);

  const screenHinge = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.0, 24), accentMat);
  screenHinge.rotation.z = Math.PI / 2;
  screenHinge.position.set(0, -0.58, -1.18);
  group.add(screenHinge);

  const screen = new THREE.Mesh(new THREE.BoxGeometry(3.55, 2.1, 0.08), glassMat);
  screen.position.set(0, 0.48, -1.2);
  screen.rotation.x = -0.16;
  group.add(screen);

  const screenBack = new THREE.Mesh(new THREE.BoxGeometry(3.56, 2.12, 0.08), bodyMat);
  screenBack.position.set(0, 0.48, -1.26);
  screenBack.rotation.x = -0.16;
  group.add(screenBack);

  const trackpad = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.04, 0.7), new THREE.MeshStandardMaterial({
    color: 0x2d2d2d,
    metalness: 0.4,
    roughness: 0.35
  }));
  trackpad.position.set(0, -0.56, 0.55);
  group.add(trackpad);

  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(3.18, 0.03, 1.35), new THREE.MeshStandardMaterial({
    color: 0x141414,
    metalness: 0.6,
    roughness: 0.5
  }));
  keyboard.position.set(0, -0.56, -0.12);
  group.add(keyboard);

  const keyRows = new THREE.Group();
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const key = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.03, 0.16),
        new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.2, roughness: 0.7 })
      );
      key.position.set(-0.88 + col * 0.25, -0.52, -0.42 + row * 0.25);
      keyRows.add(key);
    }
  }
  group.add(keyRows);

  const glow = new THREE.Mesh(
    new THREE.CircleGeometry(0.45, 32),
    new THREE.MeshBasicMaterial({
      color: 0xd6b26e,
      transparent: true,
      opacity: 0.12
    })
  );
  glow.position.set(0, 0.38, -1.16);
  glow.rotation.y = Math.PI;
  group.add(glow);

  const hotspots = projects.map((project, index) => {
    const hotspot = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 20, 20),
      new THREE.MeshBasicMaterial({ color: index % 2 === 0 ? 0xd6b26e : 0xffffff, transparent: true, opacity: 0.95 })
    );
    hotspot.position.set(-1.2 + index * 0.8, -0.05 + Math.sin(index) * 0.15, 0.9);
    hotspot.userData = {
      type: 'project',
      projectId: project.id,
      label: project.name
    };
    return hotspot;
  });
  hotspots.forEach((hotspot) => group.add(hotspot));
  hotspotMeshes = hotspots;

  group.rotation.y = -0.25;
  group.position.set(0, -0.05, 0);
  return group;
}

function buildParticles() {
  const geometry = new THREE.BufferGeometry();
  const count = lowPower ? 72 : 128;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 16;
    positions[i3 + 1] = Math.random() * 8 - 2;
    positions[i3 + 2] = (Math.random() - 0.5) * 14;

    const gold = new THREE.Color(i % 3 === 0 ? 0xd6b26e : 0x8c8c8c);
    colors[i3] = gold.r;
    colors[i3 + 1] = gold.g;
    colors[i3 + 2] = gold.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: lowPower ? 0.028 : 0.035,
    transparent: true,
    opacity: 0.72,
    vertexColors: true,
    depthWrite: false
  });

  particles = new THREE.Points(geometry, material);
  particles.position.y = 0.5;
  return particles;
}

function buildOcean() {
  const geometry = new THREE.PlaneGeometry(40, 16, lowPower ? 72 : 104, lowPower ? 30 : 48);
  const uniforms = {
    uTime: { value: 0 },
    uColorTop: { value: new THREE.Color(0x0a1018) },
    uColorBottom: { value: new THREE.Color(0x050505) },
    uAccent: { value: new THREE.Color(0xd6b26e) }
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        vUv = uv;
        vec3 pos = position;
        float waveA = sin((pos.x * 1.1) + (uTime * 0.8)) * 0.06;
        float waveB = cos((pos.x * 0.5) - (uTime * 0.95)) * 0.035;
        float waveC = sin((pos.x * 1.8) + (pos.y * 1.2) + uTime * 0.5) * 0.02;
        pos.z += waveA + waveB + waveC;
        vWave = pos.z;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColorTop;
      uniform vec3 uColorBottom;
      uniform vec3 uAccent;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        float fade = smoothstep(0.0, 0.85, vUv.y);
        vec3 base = mix(uColorBottom, uColorTop, fade);
        float foam = smoothstep(0.02, 0.0, abs(vWave));
        vec3 color = base + foam * uAccent * 0.08;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    transparent: false,
    side: THREE.DoubleSide
  });

  ocean = new THREE.Mesh(geometry, material);
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.set(0, -1.85, -3);
  return ocean;
}

function updateHotspotTooltip(target) {
  const tooltip = document.querySelector('[data-hotspot-tooltip]');
  if (!tooltip) return;
  tooltip.textContent = target?.userData?.label || '';
  tooltip.classList.toggle('is-visible', Boolean(target));
}

function openProject(projectId) {
  const project = projects.find((item) => item.id === projectId);
  if (!project || !modalCallback) return;
  state.activeProject = project;
  modalCallback({
    title: project.name,
    category: project.category,
    summary: project.summary,
    details: project.details,
    stack: project.stack,
    github: project.github
  });
}

function animate() {
  if (!running) return;
  rafId = requestAnimationFrame(animate);
  const time = performance.now() * 0.001;

  if (laptop) {
    laptop.rotation.y = -0.35 + state.progress * 0.75 + state.pointerX * 0.2;
    laptop.rotation.x = -0.08 + state.pointerY * 0.06;
    laptop.position.y = -0.06 + Math.sin(time * 0.75) * 0.05 + state.progress * 0.18;
  }

  if (particles) {
    particles.rotation.y = time * 0.03;
    particles.rotation.x = Math.sin(time * 0.12) * 0.02;
  }

  if (ocean?.material?.uniforms) {
    ocean.material.uniforms.uTime.value = time;
  }

  if (camera) {
    const targetX = state.pointerX * 0.12;
    const targetY = 0.2 + state.pointerY * 0.08 + state.progress * 0.25;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.position.z += ((6.2 - state.progress * 0.6) - camera.position.z) * 0.04;
    camera.lookAt(0, 0.1, 0);
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function resize() {
  if (!renderer || !camera) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1 : 1.25));
}

function handlePointerMove(event) {
  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -((event.clientY / window.innerHeight) * 2 - 1);
  state.pointerX = x;
  state.pointerY = y;

  document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
  document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);

  if (!raycaster || !camera || !hotspotMeshes.length) return;
  raycaster.setFromCamera(mouse.set(state.pointerX, state.pointerY), camera);
  const hits = raycaster.intersectObjects(hotspotMeshes, true);
  updateHotspotTooltip(hits[0]?.object || null);
}

function handlePointerLeave() {
  state.pointerX = 0;
  state.pointerY = 0;
  updateHotspotTooltip(null);
}

function handleClick(event) {
  if (event.target.closest?.('.project-modal')) {
    return;
  }
  raycaster.setFromCamera(mouse.set(state.pointerX, state.pointerY), camera);
  const hits = raycaster.intersectObjects(hotspotMeshes, true);
  const hit = hits[0]?.object;
  if (hit?.userData?.projectId) {
    openProject(hit.userData.projectId);
    return;
  }
  const target = event.target.closest?.('[data-open-project]');
  if (target) {
    openProject(target.getAttribute('data-open-project'));
  }
}

export function initThreeScene({
  canvasElement,
  onProjectOpen
}) {
  canvas = canvasElement;
  modalCallback = onProjectOpen;
  lowPower = window.innerWidth < 900 || window.matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.hardwareConcurrency <= 4;
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x050505, 8, 22);
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 80);
  camera.position.set(0, 0.45, 6.1);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !lowPower,
    alpha: true,
    powerPreference: lowPower ? 'low-power' : 'high-performance'
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1 : 1.25));

  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffe4b8, 1.9);
  keyLight.position.set(4, 6, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x5b6996, 0.5);
  fillLight.position.set(-4, 3, 4);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xd6b26e, 1.35, 14, 2);
  rimLight.position.set(0, 1.8, 2.8);
  scene.add(rimLight);

  laptop = buildLaptop();
  scene.add(laptop);
  scene.add(buildParticles());
  scene.add(buildOcean());

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  resizeHandler = resize;
  pointerMoveHandler = handlePointerMove;
  pointerLeaveHandler = handlePointerLeave;
  clickHandler = handleClick;

  window.addEventListener('resize', resizeHandler);
  window.addEventListener('pointermove', pointerMoveHandler, { passive: true });
  window.addEventListener('pointerleave', pointerLeaveHandler);
  window.addEventListener('click', clickHandler);
  visibilityHandler = () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(rafId);
      return;
    }
    if (!running) {
      running = true;
      animate();
    }
  };
  document.addEventListener('visibilitychange', visibilityHandler);

  running = true;
  animate();
}

export function setScrollProgress(progress) {
  state.progress = Math.max(0, Math.min(1, progress));
}

export function setProjectIndex(index) {
  return index;
}

export function setProjectOpenHandler(handler) {
  modalCallback = handler;
}

export function destroyThreeScene() {
  cancelAnimationFrame(rafId);
  running = false;
  window.removeEventListener('resize', resizeHandler);
  window.removeEventListener('pointermove', pointerMoveHandler);
  window.removeEventListener('pointerleave', pointerLeaveHandler);
  window.removeEventListener('click', clickHandler);
  document.removeEventListener('visibilitychange', visibilityHandler);
  renderer?.dispose?.();
}
