import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js';


function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.shadowMap.enabled = true;

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

    const controls = new OrbitControls(camera, canvas);
    c
  controls.target.set(0, 0, 0);
  controls.update();    


    
    const scene = new THREE.Scene();
  
    
  var texture, material, plane;

  texture = THREE.ImageUtils.loadTexture( "/texture/bricktexture.jpg" );

  // assuming you want the texture to repeat in both directions:
  texture.wrapS = THREE.RepeatWrapping; 
  texture.wrapT = THREE.RepeatWrapping;

  // how many times to repeat in each direction; the default is (1,1),
  //   which is probably why your example wasn't working
  texture.repeat.set( 4, 4 ); 

  material = new THREE.MeshLambertMaterial({ map : texture });
  plane = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), material);
  plane.material.side = THREE.DoubleSide;
  plane.position.y = -3;
  plane.receiveShadow = true
  plane.rotation.x = Math.PI / 2;

  scene.add(plane);

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  // scene.add(new THREE.PointLightHelper(pointlight, 0.1, 0xff0000));
  scene.fog = new THREE.Fog(0xFFC0CB, 3, 20);

  const spotLight = new THREE.SpotLight( 0xffffff, 1.5 );
  spotLight.position.set(10,20,-1.5);;

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;

  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 100;
  spotLight.shadow.camera.fov = 30;

  scene.add( spotLight );
  var cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget(256, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    encoding: THREE.sRGBEncoding,
  });

  var cubeCamera1 = new THREE.CubeCamera(1, 1000, cubeRenderTarget1);

  var cubeRenderTarget2 = new THREE.WebGLCubeRenderTarget(256, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    encoding: THREE.sRGBEncoding,
  });

  var cubeCamera2 = new THREE.CubeCamera(1, 1000, cubeRenderTarget2);

  const refGeometry = new THREE.SphereGeometry(1, 32, 32);
  const refMaterial = new THREE.MeshBasicMaterial({
    envMap: cubeRenderTarget2.texture,
    combine: THREE.MultiplyOperation,
    reflectivity: 1,
  });
  const reflective = new THREE.Mesh(refGeometry, refMaterial);

  reflective.castShadow = true;
  reflective.receiveShadow = true;

  reflective.position.set(-3,0,0);
  scene.add(reflective);
    
  const radius = 1;
  const geometry = new THREE.IcosahedronGeometry(radius);
  
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('gltf/scene.gltf', (gltf) => {
        const root = gltf.scene;
        root.position.set(-2, 0, 2);
        root.traverse((o) => {
            o.castShadow = true
            o.receiveShadow = true
          });
      scene.add(root);
    });
    
  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});

      const cube = new THREE.Mesh(geometry, material);
      cube.castShadow = true;
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88,  0),
  ];

  {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      '/background/venice_sunset.jpg',
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
      });
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  var count = 0;

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    reflective.visible = false
    if (count % 2 === 0) {
      cubeCamera1.update(renderer, scene);
    } else {
      cubeCamera2.update(renderer, scene);
    }

    count++;
    reflective.visible = true
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
