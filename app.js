import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

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

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.75;

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const lightWidth = 5;
const lightHeight = 5;

const frontLight = new THREE.RectAreaLight(0xffffff, 0.5, lightWidth, lightHeight);
frontLight.position.set(1, 0, 5);
frontLight.lookAt(0, 0, 0);
scene.add(frontLight);

const topLight = new THREE.RectAreaLight(0xffffff, 0.6, lightWidth, lightHeight);
topLight.position.set(0, 4, 0);
topLight.lookAt(0, 0, 0);
scene.add(topLight);

const bottomLight = new THREE.RectAreaLight(0xffffff, 0.3, lightWidth, lightHeight);
bottomLight.position.set(0, -3, 0);
bottomLight.lookAt(0, 0, 0);
scene.add(bottomLight);

const leftLight = new THREE.RectAreaLight(0xffffff, 0.75, lightWidth, lightHeight);
leftLight.position.set(-5, 0, 0);
leftLight.lookAt(0, 0, 0);
scene.add(leftLight);

const rightLight = new THREE.RectAreaLight(0xffffff, 3.5, lightWidth, lightHeight);
rightLight.position.set(5, 1, -1);
rightLight.lookAt(0, 0, 0);
scene.add(rightLight);

const numberCanvas = document.createElement("canvas");
numberCanvas.width = 1024;
numberCanvas.height = 1024;
const numberContext = numberCanvas.getContext("2d");
const numberTexture = new THREE.CanvasTexture(numberCanvas);
numberTexture.flipY = false;
numberTexture.colorSpace = THREE.SRGBColorSpace;
const numberPosition = { x: 0.5, y: 0.5 };
let numberOverlay = null;

function updateGraphicNumber(value) {
	numberContext.clearRect(0, 0, numberCanvas.width, numberCanvas.height);
	numberContext.fillStyle = "#080d3a";
	numberContext.font = "bold 260px sans-serif";
	numberContext.textAlign = "center";
	numberContext.textBaseline = "middle";
	numberContext.fillText(
		value,
		numberCanvas.width * numberPosition.x / 2,
		numberCanvas.height * numberPosition.y -225
	);
	numberTexture.needsUpdate = true;
}

function createNumberOverlay(graphics) {
	const material = new THREE.MeshBasicMaterial({
		map: numberTexture,
		transparent: true,
		depthWrite: false,
		polygonOffset: true,
		polygonOffsetFactor: -1,
		polygonOffsetUnits: -1
	});

	numberOverlay = new THREE.Mesh(graphics.geometry, material);
	numberOverlay.renderOrder = 2;
	graphics.add(numberOverlay);
	updateGraphicNumber("");
}

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
				color: 0xffffff,
				roughness: 0,
				opacity: 0.1,
				transparent: true,
				depthWrite: false
			});
			object.renderOrder = 1;
		}

		if (object.name === "Graphics") {
			object.material.roughness = 0;
			createNumberOverlay(object);
		}
	});

	scene.add(model);
});

function resizeRendererToContainer() {
	const width = Math.floor(container.clientWidth);
	const height = Math.floor(container.clientHeight);

	if (!width || !height) return;

	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setSize(width, height, true);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
}

const resizeObserver = new ResizeObserver(resizeRendererToContainer);
resizeObserver.observe(container);

const kioskResizeObserver = new ResizeObserver(fitKioskContent);
kioskResizeObserver.observe(kiosk);

resizeRendererToContainer();
fitKioskContent();

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate();

const maxNumberCharacters = 3;
let enteredNumber = "";
document.querySelectorAll(".number button").forEach((button) => {
	button.addEventListener("click", () => {
		if (enteredNumber.length >= maxNumberCharacters) return;

		enteredNumber += button.textContent.trim();
		updateGraphicNumber(enteredNumber);
	});
});

document.querySelector(".clear button").addEventListener("click", () => {
	enteredNumber = "";
	updateGraphicNumber(enteredNumber);
});