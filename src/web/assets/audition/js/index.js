import TrackballControls from './TrackballControls';
import CSS3DRenderer from './CSS3DRenderer';

export default function(THREE, TWEEN) {
  TrackballControls(THREE);
  CSS3DRenderer(THREE);

  const personArray = [
    '0_ebefec4.png',
    '12_464555f.png',
    '13_f4dafcd.png',
    '15_47c47e3.png',
    '16_5149105.png',
    '17_6dac3bd.png',
    '18_061ddaf.png',
    '19_641febd.png',
    '1_2058a2b.png',
    '20_4f81b9b.png',
    '22_da029aa.png',
    '23_034e7e8.png',
    '24_60b405b.png',
    '25_c0f0200.png',
    '26_335bb13.png',
    '27_b478ad5.png',
    '28_03e8c6f.png',
    '29_fef0d05.png',
    '2_1ee2e6c.png',
    '30_af2896e.png',
    '31_3f91ebd.png',
    '32_88c4f11.png',
    '33_edd4f7d.png',
    '34_38d61ac.png',
    '36_f619572.png',
    '37_a025f92.png',
    '38_377dd47.png',
    '39_31f5eb1.png',
    '3_8dde7c4.png',
    '40_538e40e.png',
    '41_d07ef7b.png',
    '42_d3d3f41.png',
    '43_ec8008a.png',
    '44_7d907d8.png',
    '45_a38abb2.png',
    '46_95eaf9d.png',
    '47_1e7f43d.png',
    '48_cabf201.png',
    '49_31b4514.png',
    '0_ebefec4.png',
    '12_464555f.png',
    '13_f4dafcd.png',
    '15_47c47e3.png',
    '16_5149105.png',
    '17_6dac3bd.png',
    '18_061ddaf.png',
    '19_641febd.png',
    '1_2058a2b.png',
    '20_4f81b9b.png',
    '22_da029aa.png',
    '23_034e7e8.png',
    '24_60b405b.png',
    '25_c0f0200.png',
    '26_335bb13.png',
    '27_b478ad5.png',
    '28_03e8c6f.png',
    '29_fef0d05.png',
    '2_1ee2e6c.png',
    '30_af2896e.png',
    '31_3f91ebd.png',
    '32_88c4f11.png',
    '33_edd4f7d.png',
    '34_38d61ac.png',
    '36_f619572.png',
    '37_a025f92.png',
    '38_377dd47.png',
    '39_31f5eb1.png',
    '3_8dde7c4.png',
    '40_538e40e.png',
    '41_d07ef7b.png',
    '42_d3d3f41.png',
    '43_ec8008a.png',
    '44_7d907d8.png',
    '45_a38abb2.png',
    '46_95eaf9d.png',
    '47_1e7f43d.png',
    '48_cabf201.png',
    '49_31b4514.png',
    '0_ebefec4.png',
    '12_464555f.png',
    '13_f4dafcd.png',
    '15_47c47e3.png',
    '16_5149105.png',
    '17_6dac3bd.png',
    '18_061ddaf.png',
    '19_641febd.png',
    '1_2058a2b.png',
    '20_4f81b9b.png',
    '22_da029aa.png',
    '23_034e7e8.png',
    '24_60b405b.png',
    '25_c0f0200.png',
    '26_335bb13.png',
    '27_b478ad5.png',
    '28_03e8c6f.png',
    '29_fef0d05.png',
    '2_1ee2e6c.png',
    '30_af2896e.png',
    '31_3f91ebd.png',
    '32_88c4f11.png',
    '33_edd4f7d.png',
    '34_38d61ac.png',
    '36_f619572.png',
    '37_a025f92.png',
    '38_377dd47.png',
    '39_31f5eb1.png',
    '3_8dde7c4.png',
    '40_538e40e.png',
    '41_d07ef7b.png',
    '42_d3d3f41.png',
    '43_ec8008a.png',
    '44_7d907d8.png',
    '45_a38abb2.png',
    '46_95eaf9d.png',
    '47_1e7f43d.png',
    '48_cabf201.png',
    '49_31b4514.png',
    '8_3a9dd21.png',
    '8_3a9dd21.png',
    '8_3a9dd21.png',
  ];

  var table = new Array();
  for (var i = 0; i < personArray.length; i++) {
    table[i] = new Object();
    table[i].image = `/images/${personArray[i]}`;
    table[i].p_x = (i % 20) + 1;
    table[i].p_y = Math.floor(i / 20) + 1;
  }

  var camera, scene, renderer;
  var controls;

  var speed = 0.0011;

  var objects = [];
  var targets = { table: [], sphere: [], helix: [], grid: [] };

  init();
  animate();

  function init() {
    camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = 3000;

    scene = new THREE.Scene();

    for (let i = 0; i < table.length; i++) {
      var element = document.createElement('div');
      element.className = 'element';
      var img = document.createElement('img');
      img.src = table[i].image;
      element.appendChild(img);

      element.addEventListener(
        'click',
        () => {
          console.log(table[i].image);
        },
        false
      );

      var object = new THREE.CSS3DObject(element);
      object.position.x = Math.random() * 4000 - 2000;
      object.position.y = Math.random() * 4000 - 2000;
      object.position.z = Math.random() * 4000 - 2000;
      scene.add(object);

      objects.push(object);
    }

    // sphere

    var vector = new THREE.Vector3();
    var spherical = new THREE.Spherical();

    for (var i = 0, l = objects.length; i < l; i++) {
      var phi = Math.acos(-1 + (2 * i) / l);
      var theta = Math.sqrt(l * Math.PI) * phi;

      var object = new THREE.Object3D();

      spherical.set(800, phi, theta);

      object.position.setFromSpherical(spherical);

      vector.copy(object.position).multiplyScalar(2);

      object.lookAt(vector);

      targets.sphere.push(object);
    }

    //渲染
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight - 100);
    renderer.domElement.style.position = 'absolute';
    var container = document.getElementById('container');
    // container.addEventListener('mouseenter', ()=>speed=0.011,false);
    // container.addEventListener('mouseleave', ()=>speed=0.008,false);
    container.appendChild(renderer.domElement);

    // 鼠标控制
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 5;
    controls.minDistance = 500;
    controls.maxDistance = 9000;
    controls.addEventListener('change', render);

    transform(targets.sphere, 2000);

    window.addEventListener('resize', onWindowResize, false);
  }

  function transform(targets, duration) {
    TWEEN.removeAll();

    for (var i = 0; i < objects.length; i++) {
      var object = objects[i];
      var target = targets[i];

      new TWEEN.Tween(object.position)
        .to(
          { x: target.position.x, y: target.position.y, z: target.position.z },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

      new TWEEN.Tween(object.rotation)
        .to(
          { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    }

    new TWEEN.Tween(this)
      .to({}, duration * 2)
      .onUpdate(render)
      .start();
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
  }

  function animate() {
    // 让场景通过x轴或者y轴旋转  & z
    // scene.rotation.x += 0.011;
    scene.rotation.y += speed;

    requestAnimationFrame(animate);

    TWEEN.update();

    controls.update();

    // 渲染循环
    render();
  }

  function render() {
    renderer.render(scene, camera);
  }
}
