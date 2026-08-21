import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const container = document.getElementById("locator-display");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 10);
camera.position.set(0, 1.1, 7.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.1);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 1.2);
dir.position.set(2, 3, 2);
scene.add(dir);

let model = null;
const loader = new GLTFLoader();

loader.load(
  "assets/locator.glb",
  (gltf) => {
    model = gltf.scene;
    model.position.set(0, -0.4, 0);
    model.rotation.set(0, 2.1, 0)
    model.scale.setScalar(1);
    scene.add(model);
  },
  undefined,
  (err) => console.error("Model load failed:", err)
);

function resizeRendererToContainer() {
  const w = Math.floor(container.clientWidth);
  const h = Math.floor(container.clientHeight);
  if (!w || !h) return;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, true);

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

const ro = new ResizeObserver(resizeRendererToContainer);
ro.observe(container);

resizeRendererToContainer();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();