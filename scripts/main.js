import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//scene setup
const scene = new THREE.Scene();
// scene.background = new THREE.Color("#f9f9f9");
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5); // Move the camera back

//environment setup
//plain white cube map
const plainWhiteCubeMap = new THREE.CubeTextureLoader().load([
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/CE6LAAAAABJRU5ErkJggg==',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/CE6LAAAAABJRU5ErkJggg==',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/CE6LAAAAABJRU5ErkJggg==',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/CE6LAAAAABJRU5ErkJggg==',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/CE6LAAAAABJRU5ErkJggg==',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/CE6LAAAAABJRU5ErkJggg==',
]);

scene.environment = plainWhiteCubeMap;
scene.background = new THREE.Color("#f9f9f9");

//renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

//enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//add renderer to model container
const container = document.getElementById("model-container");
container.appendChild(renderer.domElement);

//lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 15); // Soft ambient light
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 1.5);
scene.add(hemiLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 8, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(-8, 5, 5); // Opposite side
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight3.position.set(0, -3, -10); // From behind
scene.add(directionalLight3)

//ground plane
const planeGeometry = new THREE.PlaneGeometry(500, 500);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const ground = new THREE.Mesh(planeGeometry, planeMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

//material
const material = new THREE.MeshPhysicalMaterial({
    color: 0xF3F5E1,       // Base color (white)
    metalness: 0.98,          // Full metallic effect
    roughness: 0.3,        // Slightly shiny
    reflectivity: 0.95,     // High reflectivity for a chrome-like look
    // clearcoat: 1,     
    // clearcoatRoughness: 0, 
    envMap: plainWhiteCubeMap,
});

//update model scale based on screen width
function updateModelScale(model) {
    const minScale = 20;
    const maxScale = 40;
    const scaleFactor = THREE.MathUtils.clamp((window.innerWidth / 1920) * maxScale, minScale, maxScale);
    model.scale.set(scaleFactor, scaleFactor, scaleFactor);
}

//load gltf model
const loader = new GLTFLoader();
loader.load('model/paindemie.gltf', (gltf) => {
    gltf.scene.traverse((node) => {
        if (node.isMesh) {
            node.material = material;
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    const model = gltf.scene;
    updateModelScale(model);
    // model.scale.set(30, 30, 30);
    model.position.set(0, 0.5, 0);
    scene.add(model);

    //animation loop
    function animate() {
        requestAnimationFrame(animate);
        model.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animate();

    //adjust the scale when the window is resized
    window.addEventListener('resize', () => updateModelScale(model));

    //mousemove interaction
    document.addEventListener('mousemove', (e) => {
        const x = -(window.innerWidth / 2 - e.clientX) / 300;
        const y = -(window.innerHeight / 2 - e.clientY) / 300 -100;
        model.rotation.x = y;
        model.rotation.y = x;

        //limit rotation within ±45 degrees
        const maxRotation = Math.PI / 5;
        // model.rotation.x = THREE.MathUtils.clamp(y, -maxRotation, maxRotation);
        model.rotation.y = THREE.MathUtils.clamp(x, -maxRotation, maxRotation);
    });

}, undefined, (error) => {
    console.error('Error loading GLTF:', error);
});

//set camera position
camera.position.z = 5;
