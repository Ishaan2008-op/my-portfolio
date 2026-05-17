
// Three.js Premium Atmospheric Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
 canvas: document.querySelector('#bg-canvas'),
 antialias: true,
 alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0a0a0a, 1);
camera.position.setZ(30);

// Premium Lighting Setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x10b981, 0.8);
pointLight1.position.set(50, 50, 50);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xd4af37, 0.4);
pointLight2.position.set(-50, -50, 30);
scene.add(pointLight2);

// Fog for atmospheric depth
const fog = new THREE.Fog(0x0a0a0a, 100, 200);
scene.fog = fog;

// Subtle Floating Particles
function createParticleField() {
 const particleCount = 200;
 const geometry = new THREE.BufferGeometry();
 const positions = new Float32Array(particleCount * 3);
 const sizes = new Float32Array(particleCount);
 
 for (let i = 0; i < particleCount * 3; i += 3) {
  positions[i] = (Math.random() - 0.5) * 200;
  positions[i + 1] = (Math.random() - 0.5) * 200;
  positions[i + 2] = (Math.random() - 0.5) * 200;
  sizes[i / 3] = Math.random() * 2 + 0.5;
 }
 
 geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
 geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
 
 const material = new THREE.PointsMaterial({
  color: 0x10b981,
  size: 0.5,
  transparent: true,
  opacity: 0.15,
  sizeAttenuation: true
 });
 
 const particles = new THREE.Points(geometry, material);
 scene.add(particles);
 return particles;
}

const particles = createParticleField();

// Subtle Floating Geometry (Architectural Element)
const sphereGeometry = new THREE.IcosahedronGeometry(8, 4);
const sphereMaterial = new THREE.MeshPhongMaterial({
 color: 0x10b981,
 wireframe: false,
 transparent: true,
 opacity: 0.05,
 emissive: 0x10b981,
 emissiveIntensity: 0.2
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0, -50);
scene.add(sphere);

// Mouse Interaction (Subtle Parallax)
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

document.addEventListener('mousemove', (event) => {
 targetMouseX = (event.clientX - window.innerWidth / 2) * 0.0001;
 targetMouseY = (event.clientY - window.innerHeight / 2) * 0.0001;
});

// Smooth Scroll Camera Movement
function moveCamera() {
 const t = window.scrollY;
 camera.position.z = 30 - (t * 0.02);
 camera.position.x = t * -0.00005;
}
window.addEventListener('scroll', moveCamera);

// Animation Loop with Smooth Motion
function animate() {
 requestAnimationFrame(animate);
 
 // Smooth mouse parallax
 mouseX += (targetMouseX - mouseX) * 0.08;
 mouseY += (targetMouseY - mouseY) * 0.08;
 
 scene.rotation.y += (mouseX - scene.rotation.y) * 0.05;
 scene.rotation.x += (mouseY - scene.rotation.x) * 0.05;
 
 // Slow sphere rotation
 sphere.rotation.x += 0.0001;
 sphere.rotation.y += 0.00015;
 
 // Slow particle movement
 particles.rotation.y += 0.00005;
 
 renderer.render(scene, camera);
}

// Window Resize Handling
window.addEventListener('resize', () => {
 camera.aspect = window.innerWidth / window.innerHeight;
 camera.updateProjectionMatrix();
 renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
