import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import gsap from 'gsap';

const gui = new GUI({ width: 400 });
const cubeDebug = gui.addFolder('cube controls');
const debugObject = {};

const canvas = document.querySelector('canvas');

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshBasicMaterial({ color: '#00ff00', wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

cubeDebug.add(cube.position, 'y').min(-3).max(3).step(0.01).name('y axis');
cubeDebug.add(material, 'wireframe');
cubeDebug.add(material, 'visible');
cubeDebug.addColor(material, 'color').onChange((val) => console.log(val.getHexString()));

debugObject.spin = () => {
  // cube.rotation.y = cube.rotation.y + 100;
  gsap.to(cube.rotation, { y: cube.rotation.y + Math.PI * 2 });
};

cubeDebug.add(debugObject, 'spin');

debugObject.subdivision = 2;
cubeDebug
  .add(debugObject, 'subdivision')
  .min(1)
  .max(10)
  .step(1)
  .onFinishChange(() => {
    cube.geometry.dispose();
    cube.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision
    );
  });

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 4;
scene.add(camera);

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
