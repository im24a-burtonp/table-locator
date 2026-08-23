 import * as THREE from "three";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";


// Initialize area light uniforms (Required for RectAreaLight)

RectAreaLightUniformsLib.init();


const container = document.getElementById("locator-display");

const kiosk = document.querySelector(".kiosk");

const kioskContent = document.querySelector(".kiosk-content");


function fitKioskContent() {

kioskContent.style.setProperty("--content-scale", "1");

const contentWidth = kioskContent.scrollWidth;

const contentHeight = kioskContent.scrollHeight;

const scale = Math.min(

1,

kiosk.clientWidth / contentWidth,

kiosk.clientHeight / contentHeight

) * 0.99;

kioskContent.style.setProperty("--content-scale", scale.toString());

}


const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 10);

camera.position.set(0, 1.1, 7.5);


const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

container.appendChild(renderer.domElement);


// --- AREA LIGHTS SETUP ---

const lightWidth = 5;

const lightHeight = 5;


// 1. Front Light

const frontLight = new THREE.RectAreaLight(0xffffff, 0.5, lightWidth, lightHeight);

frontLight.position.set(1, 0, 5);

frontLight.lookAt(0, 0, 0);

scene.add(frontLight);


// 2. Top Light

const topLight = new THREE.RectAreaLight(0xffffff, 0.5, lightWidth, lightHeight);

topLight.position.set(0, 4, 0);

topLight.lookAt(0, 0, 0);

scene.add(topLight);


// 3. Bottom Light

const bottomLight = new THREE.RectAreaLight(0xffffff, 0, lightWidth, lightHeight);

bottomLight.position.set(0, -3, 0);

bottomLight.lookAt(0, 0, 0);

scene.add(bottomLight);


// 4. Left Light

const leftLight = new THREE.RectAreaLight(0xffffff, 1, lightWidth, lightHeight);

leftLight.position.set(-5, 0, 0);

leftLight.lookAt(0, 0, 0);

scene.add(leftLight);


// 5. Right Light

const rightLight = new THREE.RectAreaLight(0xffffff, 2, lightWidth, lightHeight);

rightLight.position.set(5, 1, -0.6);

rightLight.lookAt(0, 0, 0);

scene.add(rightLight);



let model = null;

const loader = new GLTFLoader();


loader.load("assets/locator.glb", (gltf) => {

model = gltf.scene;


model.position.set(0, -0.4, 0);

model.rotation.set(0, 2.1, 0);

model.scale.setScalar(1);


model.traverse((object) => {

if (!object.isMesh) return;


if (object.name === "Plastic") {

object.material = new THREE.MeshStandardMaterial({

color: 0xffffff,

roughness: 1

});

}


if (object.name === "Cover") {

object.material = new THREE.MeshStandardMaterial({

color: 0xc7c7c7,

roughness: 0,

opacity: 0,

transparent: true

});

}


if (object.name === "Graphics") {

object.material.roughness = 0;

}

});


scene.add(model);

});


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


const kioskRo = new ResizeObserver(fitKioskContent);

kioskRo.observe(kiosk);


resizeRendererToContainer();

fitKioskContent();


function animate() {

requestAnimationFrame(animate);

renderer.render(scene, camera);

}

animate(); 