import * as THREE from 'three';
import GUI from 'lil-gui';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
  materialColor: '#ffeded',
};

gui.addColor(parameters, 'materialColor').onFinishChange((color) => {
  material.color.set(color);
  particlesMaterial.color.set(parameters.materialColor);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Textrues
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('textures/gradients/3.jpg');
texture.magFilter = THREE.NearestFilter;

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

// Material
const material = new THREE.MeshToonMaterial({ color: parameters.materialColor, gradientMap: texture });

/**
 * Objects
 */
// Meshes
const objectsDistance = 4;

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);

const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material);

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

const meshArr = [mesh1, mesh2, mesh3];

gsap.to(mesh1.rotation, { y: '+=3' });
document.querySelectorAll('.section').forEach((section, index) => {
  console.log(section);
  ScrollTrigger.create({
    trigger: section,
    markers: true,
    start: 'top 50%',
    animation: gsap.to(meshArr[index].rotation, { y: '+=3', x: '+=5', duration: 1.5 }),
  });
});

scene.add(mesh1, mesh2, mesh3);

gsap.to(mesh1.rotation, { y: '+=3' });

/**
 * Particles
 */
// Geometry
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * meshArr.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.03,
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Cursor
 */
const cursor = { x: 0, y: 0 };

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Camera
 */

// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
// renderer.setClearAlpha(0);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let scrollY = window.scrollY;

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Objects animation
  meshArr.forEach((mesh) => {
    mesh.rotation.y += deltaTime * 0.1;
    mesh.rotation.x += deltaTime * 0.12;
    // gsap.to(mesh.rotation, { y: deltaTime * 0.1 });
    // gsap.to(mesh.rotation, { x: deltaTime * 0.1 });
  });

  // Camera Animation
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  // Parallax
  const parallaxX = cursor.x;
  const parallaxY = -cursor.y;

  gsap.to(cameraGroup.position, { x: parallaxX, ease: 'none' });
  gsap.to(cameraGroup.position, { y: parallaxY, ease: 'none' });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
