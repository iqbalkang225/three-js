import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import GUI from 'lil-gui';

/**
 * debug
 */
const gui = new GUI();
const debugObject = {};
debugObject.spheres = 200;
debugObject.donuts = 200;
debugObject.canes = 200;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader();

const matcapTexture = textureLoader.load('/textures/matcaps/8.png');
const matcapTextureYellow = textureLoader.load('/textures/matcaps/9.png');
const matcapTextureGreen = textureLoader.load('/textures/matcaps/10.png');
const matcapTextureRed = textureLoader.load('/textures/matcaps/11.png');
const matcapTextureBlue = textureLoader.load('/textures/matcaps/12.png');
const matcapTextureCandy = textureLoader.load('/textures/matcaps/13.png');
const matcapTextureDonut = textureLoader.load('/textures/matcaps/14.png');
const matcapTextureDonutSprikles = textureLoader.load('/textures/matcaps/15.png');

matcapTexture.colorSpace = THREE.SRGBColorSpace;
matcapTextureYellow.colorSpace = THREE.SRGBColorSpace;
matcapTextureGreen.colorSpace = THREE.SRGBColorSpace;
matcapTextureRed.colorSpace = THREE.SRGBColorSpace;
matcapTextureBlue.colorSpace = THREE.SRGBColorSpace;
matcapTextureCandy.colorSpace = THREE.SRGBColorSpace;
matcapTextureDonut.colorSpace = THREE.SRGBColorSpace;
matcapTextureDonutSprikles.colorSpace = THREE.SRGBColorSpace;

const texturesArray = [matcapTextureYellow, matcapTextureGreen, matcapTextureRed, matcapTextureBlue];

/**
 * Font geometry
 */
const fontLoader = new FontLoader();

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  const generateTextGeometry = (text, depth) => {
    return new TextGeometry(text, {
      font: font,
      size: 0.5,
      height: depth,
      curveSegments: 6,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
  };

  let sphereMeshArr = [];
  let donutMeshArr = [];
  let caneMeshArr = [];

  const repeatGeometry = (shape, times) => {
    let meshArr = [];
    for (let i = 0; i < times; i++) {
      const random = Math.floor(Math.random() * 4);

      const material = new THREE.MeshMatcapMaterial();
      // material.matcap = texturesArray[random];
      // material.map = matcapTextureCandy;
      if (shape === sphereGeometry) material.matcap = texturesArray[random];
      else if (shape === donutGeometry) material.map = matcapTextureDonutSprikles;
      else material.map = matcapTextureCandy;

      const mesh = new THREE.Mesh(shape, material);
      meshArr.push(mesh);

      mesh.position.x = (Math.random() - 0.5) * 10;
      mesh.position.y = (Math.random() - 0.5) * 10;
      mesh.position.z = (Math.random() - 0.5) * 10;

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      const scale = Math.random();
      mesh.scale.set(scale, scale, scale);

      scene.add(mesh);
    }
    return meshArr;
  };

  const textGeometryHolidays = generateTextGeometry('Happy Holidays', 0.2);
  const canesGeometry = generateTextGeometry('J', 0.05);
  const sphereGeometry = new THREE.SphereGeometry(0.25, 50, 50);
  const donutGeometry = new THREE.TorusGeometry(0.2, 0.1, 20, 45);

  const textMaterial = new THREE.MeshMatcapMaterial();
  textMaterial.matcap = matcapTextureRed;

  const text = new THREE.Mesh(textGeometryHolidays, textMaterial);

  textGeometryHolidays.center();

  sphereMeshArr = repeatGeometry(sphereGeometry, debugObject.spheres);
  donutMeshArr = repeatGeometry(donutGeometry, debugObject.donuts);
  caneMeshArr = repeatGeometry(canesGeometry, debugObject.canes);

  const debugGeometry = (property, arr, shape) => {
    gui
      .add(debugObject, property)
      .min(0)
      .max(500)
      .step(1)
      .onChange((val) => {
        debugObject[property] = val;

        arr.forEach((mesh) => scene.remove(mesh));

        arr = repeatGeometry(shape, debugObject[property]);
      });
  };

  debugGeometry('spheres', sphereMeshArr, sphereGeometry);
  debugGeometry('donuts', donutMeshArr, donutGeometry);
  debugGeometry('canes', caneMeshArr, canesGeometry);

  // textGeometry.computeBoundingBox();
  // const { x, y, z } = textGeometry.boundingBox.max;
  // textGeometry.translate(-x * 0.5, -y * 0.5, -z * 0.5);
  // // text.position.x = -text.position.x / 2;

  scene.add(text);
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
