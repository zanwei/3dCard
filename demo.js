//场景设置
const scene = new THREE.Scene();

//渲染器设置
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0xC2C6CA);
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = false;

document.body.appendChild( renderer.domElement );

//相机设置
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1500 );
camera.position.set( 0, 0, 100 );
camera.lookAt(scene.position);

//加载纹理
const textureLoader = new THREE.TextureLoader();
const mapFront = textureLoader.load('card-front.jpg', function(texture) {
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
}); 
const mapBack = textureLoader.load('card-back.jpg', function(texture) {
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
}); 

//材质设置
const materialFront = new THREE.MeshBasicMaterial({
  map: mapFront,
  color: 0xffffff,
});

const materialBack = new THREE.MeshBasicMaterial({
  map: mapBack,
  color: 0xffffff,
});

//卡片网格模型
const geometry = new THREE.BoxGeometry(40, 26, 0.1);

const meshFront = new THREE.Mesh(geometry, materialFront);
meshFront.position.z = 0.06; 

const meshBack = new THREE.Mesh(geometry, materialBack);
meshBack.position.z = -0.06; 

//使用 THREE.Group 来包含正反面
const card = new THREE.Group();
card.add(meshFront);
card.add(meshBack);
scene.add(card);

//添加旋转控制
let rotate = false;
let startMouseX = 0;
let startMouseY = 0;
let startCardRotation = 0;
let startCardRotationX = 0;

document.addEventListener('mousedown', e => {
  rotate = true;
  startMouseX = e.pageX;
  startMouseY = e.pageY;
  startCardRotation = card.rotation.y;
  startCardRotationX = card.rotation.x; 
});

document.addEventListener('mouseup', e => {
  rotate = false;
});

document.addEventListener('mousemove', e => {
  if(rotate){
    const deltaX = (e.pageX - startMouseX) / window.innerWidth;
    const deltaY = (e.pageY - startMouseY) / window.innerHeight;
    card.rotation.y = startCardRotation + deltaX * 2 * Math.PI; 
    card.rotation.x = startCardRotationX + deltaY * 2 * Math.PI;
  }
});

//添加物理引擎
let velocity = 0;  // 速度
let acceleration = 0.05;  // 加速度

function animate() {
  requestAnimationFrame( animate );
  
  // 在拖拽开始和结束时，使用物理引擎实现缓入缓出效果
  if (rotate) {
    velocity += acceleration;
  } else {
    velocity -= acceleration;
  }
  velocity = Math.max(0, Math.min(1, velocity));  // 限制速度在 0 和 1 之间
  
  card.rotation.y += 0.01 * velocity;

  // 添加缓慢的自动旋转
  card.rotation.y += 0.001;  

  renderer.render( scene, camera );
}
animate();