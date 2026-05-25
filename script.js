const scene=
new THREE.Scene();

const camera=
new THREE.PerspectiveCamera(

75,

window.innerWidth/
window.innerHeight,

0.1,

1000

);

const renderer=
new THREE.WebGLRenderer({

alpha:true

});

renderer.setSize(

window.innerWidth,

window.innerHeight

);

document
.getElementById("bg")
.appendChild(

renderer.domElement

);

const geometry=
new THREE.TorusKnotGeometry(

10,

3,

100,

16

);

const material=
new THREE.MeshStandardMaterial({

color:0x00e5ff,

wireframe:true

});

const shape=
new THREE.Mesh(

geometry,

material

);

scene.add(shape);

const light=
new THREE.PointLight(

0xffffff,

2

);

light.position.set(

20,
20,
20

);

scene.add(light);

camera.position.z=30;

function animate(){

requestAnimationFrame(
animate
);

shape.rotation.x+=0.003;

shape.rotation.y+=0.005;

renderer.render(
scene,
camera
);

}

animate();

const observer=

new IntersectionObserver(

entries=>{

entries.forEach(

entry=>{

if(

entry.isIntersecting

){

entry.target.classList.add(
"show"
);

}

}

);

}

);

document
.querySelectorAll(".hidden")
.forEach(

el=>observer.observe(el)

);