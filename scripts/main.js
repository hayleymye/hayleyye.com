import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Scene setup
const scene = new THREE.Scene();
// scene.background = new THREE.Color("#f9f9f9");
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5); // Move the camera back

//environment setup
// Create a plain white cube map
const plainWhiteCubeMap = new THREE.CubeTextureLoader().load([
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/CE6LAAAAABJRU5ErkJggg==',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/CE6LAAAAABJRU5ErkJggg==',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/CE6LAAAAABJRU5ErkJggg==',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/CE6LAAAAABJRU5ErkJggg==',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/CE6LAAAAABJRU5ErkJggg==',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/CE6LAAAAABJRU5ErkJggg==',
]);

// Apply the plain white cube map as the environment
scene.environment = plainWhiteCubeMap;
scene.background = new THREE.Color("#f9f9f9");

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


// Add the renderer to the model container
const container = document.getElementById("model-container");
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 15); // Soft ambient light
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 1.5);
scene.add(hemiLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 8, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Fill light
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(-8, 5, 5); // Opposite side
scene.add(directionalLight2);

// Rim light
const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight3.position.set(0, -3, -10); // From behind
scene.add(directionalLight3);


// Ground Plane
const planeGeometry = new THREE.PlaneGeometry(500, 500);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const ground = new THREE.Mesh(planeGeometry, planeMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// Material
const material = new THREE.MeshPhysicalMaterial({
    color: 0xeeeeee,       // Base color (white)
    metalness: 0.98,          // Full metallic effect
    roughness: 0.3,        // Slightly shiny
    reflectivity: 0.95,     // High reflectivity for a chrome-like look
    // clearcoat: 1,     
    // clearcoatRoughness: 0, 
    envMap: plainWhiteCubeMap,
});


// Update model scale based on screen width
function updateModelScale(model) {
    const minScale = 20;  // Minimum model size
    const maxScale = 40;  // Maximum model size

    // Calculate scale factor based on screen width, normalized between min and max
    const scaleFactor = THREE.MathUtils.clamp((window.innerWidth / 1920) * maxScale, minScale, maxScale);
    model.scale.set(scaleFactor, scaleFactor, scaleFactor);
}


// Load the GLTF model
const loader = new GLTFLoader();
loader.load('model/paindemie.gltf', (gltf) => {
    gltf.scene.traverse((node) => {
        if (node.isMesh) {
            node.material = material;
            node.castShadow = true;   // Cast shadows
            node.receiveShadow = true; // Receive shadows
        }
    });

    const model = gltf.scene;
    updateModelScale(model);
    // model.scale.set(30, 30, 30);
    model.position.set(0, 0.5, 0);
    scene.add(model);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        model.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animate();

    // Adjust the scale when the window is resized
    window.addEventListener('resize', () => updateModelScale(model));

    // Mousemove interaction
    document.addEventListener('mousemove', (e) => {
        const x = -(window.innerWidth / 2 - e.clientX) / 300;
        const y = -(window.innerHeight / 2 - e.clientY) / 300 -100;
        model.rotation.x = y;
        model.rotation.y = x;

        // Limit rotation within ±45 degrees
        const maxRotation = Math.PI / 5;
        // model.rotation.x = THREE.MathUtils.clamp(y, -maxRotation, maxRotation);
        model.rotation.y = THREE.MathUtils.clamp(x, -maxRotation, maxRotation);
    });

}, undefined, (error) => {
    console.error('Error loading GLTF:', error);
});

// Set camera position
camera.position.z = 5;
