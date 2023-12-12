import * as THREE from 'three';

const canvas = document.querySelector('canvas');

const scene = new THREE.Scene();

const group = new THREE.Group();

const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 'red' }));
const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 'green' }));

cube2.position.x = 2;
group.add(cube1, cube2);

scene.add(group);

const sizes = {
  width: 500,
  height: 500,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 4;

const axes = new THREE.AxesHelper();
scene.add(axes);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
