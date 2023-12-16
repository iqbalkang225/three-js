import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import GUI from 'lil-gui';

/**
 * debug
 */
const gui = new GUI();
const debugObject = {};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 32);

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
const matcapTexture = textureLoader.load('/textures/matcaps/1.png');
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

// THREE.MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new THREE.Color('green');
// material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;

// THREE.MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial();
// material.side = THREE.DoubleSide;
// material.map = doorColorTexture;

// THREE.MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;
// material.map = matcapTexture;

// THREE.MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial();

// THREE.MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 10;
// material.specular = new THREE.Color(0x1188ff);

// // THREE.MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial();
// material.roughness = 1;
// material.metalness = 1;
// material.map = doorColorTexture;
// // material.aoMap = doorAmbientOcclusionTexture;
// // material.displacementMap = doorHeightTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.metalnessMap = doorMetalnessTexture;
// material.normalMap = doorNormalTexture;

// THREE.MeshPhysicalMaterial
const material = new THREE.MeshPhysicalMaterial();
material.roughness = 0;
material.metalness = 0;
material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;

gui.add(material, 'roughness').min(0).max(1).step(0.0001);
gui.add(material, 'metalness').min(0).max(1).step(0.0001);

const sphere = new THREE.Mesh(sphereGeometry, material);
const plane = new THREE.Mesh(planeGeometry, material);
const torus = new THREE.Mesh(torusGeometry, material);

sphere.position.x = -1.5;
torus.position.x = 1.5;

scene.add(plane, sphere, torus);

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight('white', 1);
// const pointLight = new THREE.PointLight('white', 50);
// pointLight.position.y = 4;
// pointLight.position.x = 3;
// scene.add(pointLight, ambientLight);

/**
 * Environment
 */
const rgbeLoader = new RGBELoader();
rgbeLoader.load('/textures/environmentMap/2k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

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
// camera.position.x = 1;
// camera.position.y = 1;
camera.position.z = 5;
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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Rotate shapes
  plane.rotation.y = 0.1 * elapsedTime;
  plane.rotation.x = -0.15 * elapsedTime;

  sphere.rotation.y = 0.1 * elapsedTime;
  sphere.rotation.x = -0.15 * elapsedTime;

  torus.rotation.y = 0.1 * elapsedTime;
  torus.rotation.x = -0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
