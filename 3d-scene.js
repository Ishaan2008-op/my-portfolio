
// Three.js Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
 canvas: document.querySelector('#bg-canvas'),
 antialias: true,
 alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Background Particles (Starfield)
function addStars() {
 const geometry = new THREE.SphereGeometry(0.12, 12, 12);
 const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
 const star = new THREE.Mesh(geometry, material);

 // Distributed in a much larger and deeper volume for the space theme
 const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1000));
 star.position.set(x, y, z);
 scene.add(star);
}
Array(5000).fill().forEach(addStars);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(50, 50, 50);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(pointLight, ambientLight);

// Floating Octahedron (Kept from original)
const octaGeometry = new THREE.OctahedronGeometry(10, 0);
const octaMaterial = new THREE.MeshStandardMaterial({
 color: 0x58a6ff,
 wireframe: true,
 transparent: true,
 opacity: 0.2
});
const octa = new THREE.Mesh(octaGeometry, octaMaterial);
octa.position.set(0, 0, -20);
scene.add(octa);

// Floating Torus (Kept from original)
const torusGeometry = new THREE.TorusGeometry(15, 0.1, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({
 color: 0xbc8cff,
 wireframe: true,
 transparent: true,
 opacity: 0.1
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 0, -50);
scene.add(torus);

// Mouse Interaction (Parallax)
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
 mouseX = (event.clientX - window.innerWidth / 2) / 200;
 mouseY = (event.clientY - window.innerHeight / 2) / 200;
});

// Direct Continuous Scroll Mapping (Linear Space Travel)
function moveCamera() {
 const t = window.scrollY;

 // Smoothly push camera forward into the stars
 camera.position.z = 30 - (t * 0.05);
 camera.position.x = t * -0.0001;
 camera.rotation.y = t * -0.0001;

 // Rotate the hero shapes slowly
 octa.rotation.x += 0.02;
 octa.rotation.y += 0.02;
}
window.addEventListener('scroll', moveCamera);

// Animation Loop
function animate() {
 requestAnimationFrame(animate);

 // Constant subtle rotation for life
 torus.rotation.x += 0.001;
 torus.rotation.y += 0.001;

 // Smooth Mouse Parallax
 scene.rotation.y += (mouseX - scene.rotation.y) * 0.03;
 scene.rotation.x += (mouseY - scene.rotation.x) * 0.03;

 renderer.render(scene, camera);
}

// Window Resize Handling
window.addEventListener('resize', () => {
 camera.aspect = window.innerWidth / window.innerHeight;
 camera.updateProjectionMatrix();
 renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
