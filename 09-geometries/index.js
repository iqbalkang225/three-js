import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.querySelector('canvas');

const scene = new THREE.Scene();

// const geometry = new THREE.BoxGeometry(1, 1, 1);
const geometry = new THREE.BufferGeometry();
const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAttribute);

const material = new THREE.MeshBasicMaterial({ color: 'green', wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 4;
scene.add(camera);

// const axes = new THREE.AxesHelper();
// scene.add(axes);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
