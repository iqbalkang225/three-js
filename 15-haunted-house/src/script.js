import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog('#262837', 1, 15);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
doorAlphaTexture.colorSpace = THREE.SRGBColorSpace;
doorAmbientOcclusionTexture.colorSpace = THREE.SRGBColorSpace;
doorHeightTexture.colorSpace = THREE.SRGBColorSpace;
doorMetalnessTexture.colorSpace = THREE.SRGBColorSpace;
doorRoughnessTexture.colorSpace = THREE.SRGBColorSpace;
doorNormalTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * House
 */
// Group
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(new THREE.BoxGeometry(4, 2.5, 4), new THREE.MeshStandardMaterial({ color: '#796a60' }));
walls.geometry.computeBoundingBox();
walls.position.y = walls.geometry.boundingBox.max.y;
house.add(walls);

// roof
const roof = new THREE.Mesh(new THREE.ConeGeometry(3.25, 1, 4), new THREE.MeshStandardMaterial({ color: '#8c5542' }));
roof.geometry.computeBoundingBox();
roof.position.y = walls.geometry.parameters.height + roof.geometry.boundingBox.max.y;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.computeBoundingBox();
door.position.z = walls.geometry.parameters.depth / 2 + 0.01;
door.position.y = door.geometry.boundingBox.max.y;
house.add(door);

/**
 * Graves
 */
// Group
const graves = new THREE.Group();
scene.add(graves);

// grave
const graveGeometry = new THREE.BoxGeometry(0.5, 0.75, 0.1);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#8d908e' });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * (Math.PI * 2);
  const radius = walls.geometry.parameters.width + Math.random() * 5.5;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.3, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial({ color: '#a9c388' }));
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.15);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.26);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(moonLight);

const doorLight = new THREE.PointLight('#ff7d46', 10, 10);
doorLight.position.set(0, 2, 3);
house.add(doorLight);

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
// camera.position.x = 4;
// camera.position.y = 2;
// camera.position.z = 5;

camera.position.x = 0.5;
camera.position.y = 1.75;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#262837');

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
