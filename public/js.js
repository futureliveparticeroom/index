import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xEEEEEE);
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const planes = [];
const planeCount = 30;
const planeSize = 2;

fetch('http://165.227.122.172:3001/getImages')
  .then((response) => response.json())
  .then((imagePaths) => {


    for (let i = 0; i < planeCount; i++) {
      const texture = new THREE.TextureLoader().load(imagePaths[i % imagePaths.length]);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(planeSize, planeSize), material);
      plane.material.opacity = 1;
   
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 1.0) * 5 -2;
      plane.position.set(x, y, z);

      planes.push(plane);
      scene.add(plane);
    }
  })
  .catch((error) => console.error(error));




camera.position.z = 5;

const moveDirection = new THREE.Vector3(0, 0, 0.005);


const animate = () => {
  requestAnimationFrame(animate);


  planes.forEach((plane) => {
    plane.position.add(moveDirection);

    if (plane.position.z >1) {
      
      plane.position.z = -5;
    }

    if (plane.position.z > 0 && plane.position.z < 1) {

      plane.material.opacity = (1 - (plane.position.z ))/plane.position.z  ;

    } else if (plane.position.z < -2 && plane.position.z > -7) {

      plane.material.opacity = 1 - (-2 - plane.position.z) / 2;

    } else {
      plane.material.opacity = 1;
    }
  
    plane.material.transparent = true;
    plane.material.needsUpdate = true;
    const target = new THREE.Vector3(camera.position.x, plane.position.y, camera.position.z);

    plane.lookAt(target);
  });



  renderer.render(scene, camera);
};


animate();

function updateImages() {
  fetch('http://165.227.122.172:3001/getImages')
    .then((response) => response.json())
    .then((imagePaths) => {
      planes.forEach((plane, i) => {
        const newTexture = new THREE.TextureLoader().load(imagePaths[i % imagePaths.length], () => {
          plane.material.map = newTexture;
          plane.material.needsUpdate = true;
        });
      });
    })
    .catch((error) => console.error(error));
}



const updateInterval = 30000;
setInterval(updateImages, updateInterval);

// function updateImagesWhenIdle() {

//   updateImages();
  

//   // window.requestIdleCallback(() => {
//   //   updateImagesWhenIdle();
//   // }, { timeout: updateInterval });
// }

// const updateInterval = 10000; 
// window.requestIdleCallback(() => {
//   updateImagesWhenIdle();
// }, { timeout: updateInterval });