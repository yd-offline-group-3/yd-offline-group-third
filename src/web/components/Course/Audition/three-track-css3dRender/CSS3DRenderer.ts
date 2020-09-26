import * as THREE from 'three';

class CSS3DObject extends THREE.Object3D {
  public element: HTMLElement;
  constructor(element: HTMLElement) {
    super();
    this.element = element;
    element.style.position = 'absolute';
    this.addEventListener('removed', () => {
      if (this.element.parentNode !== null) {
        this.element.parentNode.removeChild(this.element);
      }
    });
  }
}

class CSS3DSprite extends CSS3DObject {
  constructor(element: HTMLElement) { super(element); }
}

class CSS3DRenderer {
  width: number;
  height: number;
  widthHalf: number;
  heightHalf: number;
  matrix: THREE.Matrix4;
  cache: {
    camera: { fov: number, style: string },
    objects: { [propName: string]: any },
  };
  domElement: HTMLDivElement;
  cameraElement: HTMLDivElement;
  isIE: boolean;
  getDistanceToSquareda: THREE.Vector3;
  getDistanceToSquaredb: THREE.Vector3;
  constructor() {
    this.domElement = document.createElement('div');
    this.cameraElement = document.createElement('div');
    this.domElement.style.overflow = 'hidden';
    this.cameraElement.style.transformStyle = 'preserve-3d';
    this.domElement.appendChild(this.cameraElement);
    this.matrix = new THREE.Matrix4()
    this.cache = {
      camera: { fov: 0, style: '' },
      objects: {},
    };
    this.isIE = /Trident/i.test(navigator.userAgent);
    this.getDistanceToSquareda = new THREE.Vector3();
    this.getDistanceToSquaredb = new THREE.Vector3();
  }
  setClearColor() { }
  getSize() {
    return {
      width: this.width,
      height: this.height,
    };
  };

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.widthHalf = this.width / 2;
    this.heightHalf = this.height / 2;

    this.domElement.style.width = width + 'px';
    this.domElement.style.height = height + 'px';

    this.cameraElement.style.width = width + 'px';
    this.cameraElement.style.height = height + 'px';
  }

  epsilon(value: number) {
    return Math.abs(value) < 1e-10 ? 0 : value;
  }

  getCameraCSSMatrix(matrix: { elements: number[] }) {
    let elements = matrix.elements;

    return (
      'matrix3d(' +
      this.epsilon(elements[0]) +
      ',' +
      this.epsilon(-elements[1]) +
      ',' +
      this.epsilon(elements[2]) +
      ',' +
      this.epsilon(elements[3]) +
      ',' +
      this.epsilon(elements[4]) +
      ',' +
      this.epsilon(-elements[5]) +
      ',' +
      this.epsilon(elements[6]) +
      ',' +
      this.epsilon(elements[7]) +
      ',' +
      this.epsilon(elements[8]) +
      ',' +
      this.epsilon(-elements[9]) +
      ',' +
      this.epsilon(elements[10]) +
      ',' +
      this.epsilon(elements[11]) +
      ',' +
      this.epsilon(elements[12]) +
      ',' +
      this.epsilon(-elements[13]) +
      ',' +
      this.epsilon(elements[14]) +
      ',' +
      this.epsilon(elements[15]) +
      ')'
    );
  }

  getObjectCSSMatrix(matrix: { elements: number[] }, cameraCSSMatrix: string) {
    var elements = matrix.elements;
    var matrix3d =
      'matrix3d(' +
      this.epsilon(elements[0]) +
      ',' +
      this.epsilon(elements[1]) +
      ',' +
      this.epsilon(elements[2]) +
      ',' +
      this.epsilon(elements[3]) +
      ',' +
      this.epsilon(-elements[4]) +
      ',' +
      this.epsilon(-elements[5]) +
      ',' +
      this.epsilon(-elements[6]) +
      ',' +
      this.epsilon(-elements[7]) +
      ',' +
      this.epsilon(elements[8]) +
      ',' +
      this.epsilon(elements[9]) +
      ',' +
      this.epsilon(elements[10]) +
      ',' +
      this.epsilon(elements[11]) +
      ',' +
      this.epsilon(elements[12]) +
      ',' +
      this.epsilon(elements[13]) +
      ',' +
      this.epsilon(elements[14]) +
      ',' +
      this.epsilon(elements[15]) +
      ')';

    if (this.isIE) {
      return (
        'translate(-50%,-50%)' +
        'translate(' +
        this.widthHalf +
        'px,' +
        this.heightHalf +
        'px)' +
        cameraCSSMatrix +
        matrix3d
      );
    }

    return 'translate(-50%,-50%)' + matrix3d;
  }

  renderObject(
    object: CSS3DObject | CSS3DSprite,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    cameraCSSMatrix: string
  ) {
    if (object instanceof CSS3DObject) {
      var style;

      if (object instanceof CSS3DSprite) {

        this.matrix.copy(camera.matrixWorldInverse);
        this.matrix.transpose();
        this.matrix.copyPosition(object.matrixWorld);
        this.matrix.scale(object.scale);

        this.matrix.elements[3] = 0;
        this.matrix.elements[7] = 0;
        this.matrix.elements[11] = 0;
        this.matrix.elements[15] = 1;

        style = this.getObjectCSSMatrix(this.matrix, cameraCSSMatrix);
      } else {
        style = this.getObjectCSSMatrix(object.matrixWorld, cameraCSSMatrix);
      }

      var element = object.element;
      var cachedStyle =
        this.cache.objects[object.id] && this.cache.objects[object.id].style;

      if (cachedStyle === undefined || cachedStyle !== style) {
        element.style.transform = style;

        this.cache.objects[object.id] = { style: style };

        if (this.isIE) {
          this.cache.objects[
            object.id
          ].distanceToCameraSquared = this.getDistanceToSquared(camera, object);
        }
      }

      if (element.parentNode !== this.cameraElement) {
        this.cameraElement.appendChild(element);
      }
    }

    for (var i = 0, l = object.children.length; i < l; i++) {
      this.renderObject(object.children[i] as (CSS3DObject | CSS3DSprite), camera, cameraCSSMatrix);
    }
  }
  getDistanceToSquared(object1: THREE.PerspectiveCamera | THREE.OrthographicCamera, object2: CSS3DObject | CSS3DSprite) {
    this.getDistanceToSquareda.setFromMatrixPosition(object1.matrixWorld);
    this.getDistanceToSquaredb.setFromMatrixPosition(object2.matrixWorld);
    return this.getDistanceToSquareda.distanceToSquared(this.getDistanceToSquaredb);
  }

  zOrder(scene: THREE.Object3D) {
    var order = Object.keys(this.cache.objects).sort((a, b) => {
      return (
        this.cache.objects[a].distanceToCameraSquared -
        this.cache.objects[b].distanceToCameraSquared
      );
    });
    var zMax = order.length;

    scene.traverse(function (object: THREE.Object3D & { element: { style: { zIndex: number } } }) {
      var index = order.indexOf(object.id + '');
      if (index !== -1) {
        object.element.style.zIndex = zMax - index;
      }
    });
  }

  render(
    scene: THREE.Object3D,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  ) {
    var fov = camera.projectionMatrix.elements[5] * this.heightHalf;

    if (this.cache.camera.fov !== fov) {
      this.domElement.style.perspective = fov + 'px';

      this.cache.camera.fov = fov;
    }

    scene.updateMatrixWorld();

    if (camera.parent === null) camera.updateMatrixWorld();

    var cameraCSSMatrix =
      'translateZ(' +
      fov +
      'px)' +
      this.getCameraCSSMatrix(camera.matrixWorldInverse);

    var style =
      cameraCSSMatrix + 'translate(' + this.widthHalf + 'px,' + this.heightHalf + 'px)';

    if (this.cache.camera.style !== style && !this.isIE) {
      this.cameraElement.style.transform = style;

      this.cache.camera.style = style;
    }

    this.renderObject(scene as CSS3DObject | CSS3DSprite, camera, cameraCSSMatrix);

    if (this.isIE) {
      this.zOrder(scene);
    }
  }
}


export { CSS3DObject, CSS3DSprite, CSS3DRenderer };