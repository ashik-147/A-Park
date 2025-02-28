import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// initializing the scene
const scene = new THREE.Scene();

// setting up camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 50, 150);

// setting up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 0rbitControls for camera interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// adding ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

// adding directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// texture loader
const textureLoader = new THREE.TextureLoader();
const tableTopTexture = textureLoader.load("image/bench.avif");
const groundTexture = textureLoader.load("image/grass.png");

// creating bench seat 
const benchSeatGeometry = new THREE.BoxGeometry(6, 0.3, 1.5); 
const benchSeatMaterial = new THREE.MeshBasicMaterial({ map: tableTopTexture });
const benchSeat = new THREE.Mesh(benchSeatGeometry, benchSeatMaterial);

// create bench legs 
const legGeometry = new THREE.BoxGeometry(0.3, 1.2, 0.3);
const legMaterial = new THREE.MeshBasicMaterial({ map: tableTopTexture });
const leg1 = new THREE.Mesh(legGeometry, legMaterial);
leg1.position.set(-2.2, -0.6, -0.6);

const leg2 = leg1.clone();
leg2.position.set(2.2, -0.6, -0.6);

const leg3 = leg1.clone();
leg3.position.set(-2.2, -0.6, 0.6);

const leg4 = leg1.clone();
leg4.position.set(2.2, -0.6, 0.6);

// creating bench backrest
const backrestGeometry = new THREE.BoxGeometry(6, 1.5, 0.3); // Increased dimensions
const backrest = new THREE.Mesh(backrestGeometry, benchSeatMaterial);
backrest.position.set(0, 0.75, -0.75); // Adjusted position to fit the larger seat

// adding all bench parts
const bench = new THREE.Group();
bench.add(benchSeat, leg1, leg2, leg3, leg4, backrest);
bench.position.set(0, 10, 0);

bench.scale.set(10.5, 10.5, 10.5);
scene.add(bench);

// GLB
const loader = new GLTFLoader();
const trees = [];
const createTree = (x, z) => {
  loader.load("tree.glb", (gltf) => {
    const tree = gltf.scene;

    
    tree.scale.set(10, 10, 10); 

 
    tree.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;

        
        const vibrantMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(Math.random(), Math.random(), Math.random()),
        });

     
        node.material = vibrantMaterial;
      }
    });

    tree.position.set(x, 0, z);
    scene.add(tree);
    trees.push(tree);
  });
};


const gap = 20;


createTree(-30 - gap, -30 - gap);
createTree(30 + gap, 30 + gap);
createTree(-30 - gap, 30 + gap);
createTree(30 + gap, -30 + gap);


const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
const groundGeometry = new THREE.PlaneGeometry(400, 400);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);


let sunDirection = 1;
const updateSunPosition = () => {
  directionalLight.position.x += 0.5 * sunDirection;
  if (directionalLight.position.x > 50 || directionalLight.position.x < -50) {
    sunDirection *= -1;
  }
};

function animate() {
  requestAnimationFrame(animate);
  updateSunPosition();
  controls.update();
  renderer.render(scene, camera);
}

animate();


document.addEventListener("keydown", (event) => {
  const moveDistance = 10;
  switch (event.key) {
    case "ArrowUp":
      camera.position.z -= moveDistance;
      break;
    case "ArrowDown":
      camera.position.z += moveDistance;
      break;
    case "ArrowLeft":
      camera.position.x -= moveDistance;
      break;
    case "ArrowRight":
      camera.position.x += moveDistance;
      break;
  }
});
