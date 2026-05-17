// Three.js Premium Cinematic Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg-canvas'),
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x030303, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;

camera.position.set(0, 0, 40);

// Cinematic Architectural Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.08);
scene.add(ambientLight);

// Key light
const spotLight1 = new THREE.SpotLight(0xffffff, 2.5);
spotLight1.position.set(20, 50, 30);
spotLight1.angle = Math.PI / 4;
spotLight1.penumbra = 0.9;
spotLight1.decay = 2;
spotLight1.distance = 200;
scene.add(spotLight1);

// Subtle emerald rim light
const spotLight2 = new THREE.SpotLight(0x059669, 1.5);
spotLight2.position.set(-30, -10, 10);
spotLight2.angle = Math.PI / 3;
spotLight2.penumbra = 1;
scene.add(spotLight2);

// Volumetric Fog
scene.fog = new THREE.FogExp2(0x030303, 0.012);

// Realistic Environmental Dust/Particles
function createDustParticles() {
  const particleCount = 600;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 150;
    positions[i + 1] = (Math.random() - 0.5) * 150;
    positions[i + 2] = (Math.random() - 0.5) * 150;
    sizes[i / 3] = Math.random() * 0.08 + 0.02;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const material = new THREE.PointsMaterial({
    color: 0xe0e0e0,
    size: 0.1,
    transparent: true,
    opacity: 0.3,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  });
  
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  return particles;
}

const particles = createDustParticles();

// Subtle Depth Objects (Metallic/Glass monolithic columns)
const group = new THREE.Group();
scene.add(group);

const monolithMaterial = new THREE.MeshStandardMaterial({
  color: 0x080808,
  metalness: 0.95,
  roughness: 0.2,
  envMapIntensity: 1.0
});

for(let i=0; i<4; i++) {
  const geometry = new THREE.BoxGeometry(3 + Math.random(), 60, 3 + Math.random());
  const mesh = new THREE.Mesh(geometry, monolithMaterial);
  mesh.position.x = (i - 1.5) * 20;
  mesh.position.y = (Math.random() - 0.5) * 10;
  mesh.position.z = -30 - (i * 15);
  mesh.rotation.y = Math.PI / 8 * i;
  group.add(mesh);
}

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

document.addEventListener('mousemove', (event) => {
  targetMouseX = (event.clientX - window.innerWidth / 2) * 0.0003;
  targetMouseY = (event.clientY - window.innerHeight / 2) * 0.0003;
});

// Smooth Scroll Camera Movement
function moveCamera() {
  const t = window.scrollY;
  camera.position.z = 40 - (t * 0.012);
  camera.position.y = t * -0.004;
  group.position.z = t * 0.008;
}
window.addEventListener('scroll', moveCamera);

// Cinematic Smooth Animation Loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();
  
  // Heavy inertial mouse parallax
  mouseX += (targetMouseX - mouseX) * 0.03;
  mouseY += (targetMouseY - mouseY) * 0.03;
  
  camera.rotation.y = -mouseX * 0.6;
  camera.rotation.x = -mouseY * 0.6;
  
  // Slow dust movement
  particles.position.y = Math.sin(elapsedTime * 0.05) * 2;
  particles.rotation.y = elapsedTime * 0.01;
  
  // Subtle monolith rotation
  group.children.forEach((mesh, i) => {
    mesh.rotation.y += 0.0002 * (i % 2 === 0 ? 1 : -1);
  });
  
  // Subtle lighting shifts
  spotLight2.position.x = -30 + Math.sin(elapsedTime * 0.2) * 10;
  
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
