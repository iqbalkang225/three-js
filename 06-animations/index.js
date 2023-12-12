import * as THREE from 'three';
import GSAP from 'gsap';

const canvas = document.querySelector('canvas');

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 'green' });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const sizes = {
  width: 600,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);

GSAP.to(cube.position, { x: 2, duration: 1 });
GSAP.to(cube.position, { x: 0, duration: 1, delay: 1 });

const tick = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
