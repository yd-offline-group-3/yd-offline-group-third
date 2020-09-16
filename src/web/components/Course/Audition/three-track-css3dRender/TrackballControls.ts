import { ITHREE } from "web/types/TTHREE";
import Vector2 from 'three/src/math/Vector2';
import * as THREE from "three";

export default class TrackballControls {
  public object: THREE.PerspectiveCamera;
  public domElement: HTMLElement | Document;

  public STATE = {
    NONE: -1,
    ROTATE: 0,
    ZOOM: 1,
    PAN: 2,
    TOUCH_ROTATE: 3,
    TOUCH_ZOOM_PAN: 4,
  };

  // API

  enabled = true;

  screen = { left: 0, top: 0, width: 0, height: 0 };
  rotateSpeed = 1.0;
  zoomSpeed = 1.2;
  panSpeed = 0.3;
  noRotate = false;
  noZoom = false;
  noPan = false;
  staticMoving = false;
  dynamicDampingFactor = 0.2;
  minDistance = 0;
  maxDistance = Infinity;
  keys = [65 /*A*/, 83 /*S*/, 68 /*D*/];
  target = new THREE.Vector3();
  EPS = 0.000001;
  lastPosition = new THREE.Vector3();
  _state = this.STATE.NONE;
  _prevState = this.STATE.NONE;
  _eye = new THREE.Vector3();
  _movePrev = new THREE.Vector2();
  _moveCurr = new THREE.Vector2();
  _lastAxis = new THREE.Vector3();
  _lastAngle = 0;
  _zoomStart = new THREE.Vector2();
  _zoomEnd = new THREE.Vector2();
  _touchZoomDistanceStart = 0;
  _touchZoomDistanceEnd = 0;
  _panStart = new THREE.Vector2();
  _panEnd = new THREE.Vector2();



  target0: THREE.Vector3;
  position0: THREE.Vector3;
  up0: THREE.Vector3;

  changeEvent = { type: 'change' };
  startEvent = { type: 'start' };
  endEvent = { type: 'end' };

  constructor(object: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.object = object;
    this.domElement = domElement ? domElement : document;
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.up0 = this.object.up.clone();
  }


  handleResize() {
    if (this.domElement === document) {
      this.screen.left = 0;
      this.screen.top = 0;
      this.screen.width = window.innerWidth;
      this.screen.height = window.innerHeight;
    } else {
      let dom = this.domElement as HTMLElement;
      let box = dom.getBoundingClientRect();
      let d = this.domElement.ownerDocument.documentElement;
      this.screen.left = box.left + window.pageXOffset - d.clientLeft;
      this.screen.top = box.top + window.pageYOffset - d.clientTop;
      this.screen.width = box.width;
      this.screen.height = box.height;
    }
  };

  handleEvent(event: { type: string }) {
    if (typeof (this as any)[event.type] == 'function') {
      (this as any)[event.type](event);
    }
  };

  getMouseOnScreenVector = new THREE.Vector2();

  getMouseOnScreen(pageX: number, pageY: number) {
    this.getMouseOnScreenVector.set(
      (pageX - this.screen.left) / screen.width,
      (pageY - this.screen.top) / screen.height
    );
    return this.getMouseOnScreenVector;
  }

  getMouseOnCircleVector = new THREE.Vector2();

  getMouseOnCircle(pageX: number, pageY: number) {
    this.getMouseOnCircleVector.set(
      (pageX - this.screen.width * 0.5 - this.screen.left) /
      (this.screen.width * 0.5),
      (this.screen.height + 2 * (this.screen.top - pageY)) /
      this.screen.width // screen.width intentional
    );

    return this.getMouseOnCircleVector;
  }

  rotateCameraParam = {
    axis: new THREE.Vector3(),
    quaternion: new THREE.Quaternion(),
    eyeDirection: new THREE.Vector3(),
    objectUpDirection: new THREE.Vector3(),
    objectSidewaysDirection: new THREE.Vector3(),
    moveDirection: new THREE.Vector3(),
  }

  rotateCamera() {
    let { axis, quaternion, eyeDirection, objectUpDirection, objectSidewaysDirection, moveDirection } = this.rotateCameraParam;
    moveDirection.set(
      this._moveCurr.x - this._movePrev.x,
      this._moveCurr.y - this._movePrev.y,
      0
    );

    let angle = moveDirection.length();

    if (angle) {
      this._eye.copy(this.object.position).sub(this.target);

      eyeDirection.copy(this._eye).normalize();
      objectUpDirection.copy(this.object.up).normalize();
      objectSidewaysDirection
        .crossVectors(objectUpDirection, eyeDirection)
        .normalize();

      objectUpDirection.setLength(this._moveCurr.y - this._movePrev.y);
      objectSidewaysDirection.setLength(this._moveCurr.x - this._movePrev.x);

      moveDirection.copy(objectUpDirection.add(objectSidewaysDirection));

      axis.crossVectors(moveDirection, this._eye).normalize();

      angle *= this.rotateSpeed;
      quaternion.setFromAxisAngle(axis, angle);

      this._eye.applyQuaternion(quaternion);
      this.object.up.applyQuaternion(quaternion);

      this._lastAxis.copy(axis);
      this._lastAngle = angle;
    } else if (!this.staticMoving && this._lastAngle) {
      this._lastAngle *= Math.sqrt(1.0 - this.dynamicDampingFactor);
      this._eye.copy(this.object.position).sub(this.target);
      quaternion.setFromAxisAngle(this._lastAxis, this._lastAngle);
      this._eye.applyQuaternion(quaternion);
      this.object.up.applyQuaternion(quaternion);
    }

    this._movePrev.copy(this._moveCurr);
  };

  zoomCamera() {
    var factor;

    if (this._state === this.STATE.TOUCH_ZOOM_PAN) {
      factor = this._touchZoomDistanceStart / this._touchZoomDistanceEnd;
      this._touchZoomDistanceStart = this._touchZoomDistanceEnd;
      this._eye.multiplyScalar(factor);
    } else {
      factor = 1.0 + (this._zoomEnd.y - this._zoomStart.y) * this.zoomSpeed;

      if (factor !== 1.0 && factor > 0.0) {
        this._eye.multiplyScalar(factor);
      }

      if (this.staticMoving) {
        _zoomStart.copy(_zoomEnd);
      } else {
        _zoomStart.y +=
          (_zoomEnd.y - _zoomStart.y) * this.dynamicDampingFactor;
      }
    }
  };

this.panCamera = (function () {
  var mouseChange = new THREE.Vector2(),
    objectUp = new THREE.Vector3(),
    pan = new THREE.Vector3();

  return function panCamera() {
    mouseChange.copy(_panEnd).sub(_panStart);

    if (mouseChange.lengthSq()) {
      mouseChange.multiplyScalar(_eye.length() * _this.panSpeed);

      pan
        .copy(_eye)
        .cross(_this.object.up)
        .setLength(mouseChange.x);
      pan.add(objectUp.copy(_this.object.up).setLength(mouseChange.y));

      _this.object.position.add(pan);
      _this.target.add(pan);

      if (_this.staticMoving) {
        _panStart.copy(_panEnd);
      } else {
        _panStart.add(
          mouseChange
            .subVectors(_panEnd, _panStart)
            .multiplyScalar(_this.dynamicDampingFactor)
        );
      }
    }
  };
})();

this.checkDistances = function () {
  if (!_this.noZoom || !_this.noPan) {
    if (_eye.lengthSq() > _this.maxDistance * _this.maxDistance) {
      _this.object.position.addVectors(
        _this.target,
        _eye.setLength(_this.maxDistance)
      );
      _zoomStart.copy(_zoomEnd);
    }

    if (_eye.lengthSq() < _this.minDistance * _this.minDistance) {
      _this.object.position.addVectors(
        _this.target,
        _eye.setLength(_this.minDistance)
      );
      _zoomStart.copy(_zoomEnd);
    }
  }
};

this.update = function () {
  _eye.subVectors(_this.object.position, _this.target);

  if (!_this.noRotate) {
    _this.rotateCamera();
  }

  if (!_this.noZoom) {
    _this.zoomCamera();
  }

  if (!_this.noPan) {
    _this.panCamera();
  }

  _this.object.position.addVectors(_this.target, _eye);

  _this.checkDistances();

  _this.object.lookAt(_this.target);

  if (lastPosition.distanceToSquared(_this.object.position) > EPS) {
    _this.dispatchEvent(changeEvent);

    lastPosition.copy(_this.object.position);
  }
};

this.reset = function () {
  _state = STATE.NONE;
  _prevState = STATE.NONE;

  _this.target.copy(_this.target0);
  _this.object.position.copy(_this.position0);
  _this.object.up.copy(_this.up0);

  _eye.subVectors(_this.object.position, _this.target);

  _this.object.lookAt(_this.target);

  _this.dispatchEvent(changeEvent);

  lastPosition.copy(_this.object.position);
};

// listeners

function keydown(event) {
  if (_this.enabled === false) return;

  window.removeEventListener('keydown', keydown);

  _prevState = _state;

  if (_state !== STATE.NONE) {
    return;
  } else if (
    event.keyCode === _this.keys[STATE.ROTATE] &&
    !_this.noRotate
  ) {
    _state = STATE.ROTATE;
  } else if (event.keyCode === _this.keys[STATE.ZOOM] && !_this.noZoom) {
    _state = STATE.ZOOM;
  } else if (event.keyCode === _this.keys[STATE.PAN] && !_this.noPan) {
    _state = STATE.PAN;
  }
}

function keyup(event) {
  if (_this.enabled === false) return;

  _state = _prevState;

  window.addEventListener('keydown', keydown, false);
}

function mousedown(event) {
  if (_this.enabled === false) return;

  event.preventDefault();
  event.stopPropagation();

  if (_state === STATE.NONE) {
    _state = event.button;
  }

  if (_state === STATE.ROTATE && !_this.noRotate) {
    _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
    _movePrev.copy(_moveCurr);
  } else if (_state === STATE.ZOOM && !_this.noZoom) {
    _zoomStart.copy(getMouseOnScreen(event.pageX, event.pageY));
    _zoomEnd.copy(_zoomStart);
  } else if (_state === STATE.PAN && !_this.noPan) {
    _panStart.copy(getMouseOnScreen(event.pageX, event.pageY));
    _panEnd.copy(_panStart);
  }

  document.addEventListener('mousemove', mousemove, false);
  document.addEventListener('mouseup', mouseup, false);

  _this.dispatchEvent(startEvent);
}

function mousemove(event) {
  if (_this.enabled === false) return;

  event.preventDefault();
  event.stopPropagation();

  if (_state === STATE.ROTATE && !_this.noRotate) {
    _movePrev.copy(_moveCurr);
    _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
  } else if (_state === STATE.ZOOM && !_this.noZoom) {
    _zoomEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
  } else if (_state === STATE.PAN && !_this.noPan) {
    _panEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
  }
}

function mouseup(event) {
  if (_this.enabled === false) return;

  event.preventDefault();
  event.stopPropagation();

  _state = STATE.NONE;

  document.removeEventListener('mousemove', mousemove);
  document.removeEventListener('mouseup', mouseup);
  _this.dispatchEvent(endEvent);
}

function mousewheel(event) {
  if (_this.enabled === false) return;

  event.preventDefault();
  event.stopPropagation();

  switch (event.deltaMode) {
    case 2:
      // Zoom in pages
      _zoomStart.y -= event.deltaY * 0.025;
      break;

    case 1:
      // Zoom in lines
      _zoomStart.y -= event.deltaY * 0.01;
      break;

    default:
      // undefined, 0, assume pixels
      _zoomStart.y -= event.deltaY * 0.00025;
      break;
  }

  _this.dispatchEvent(startEvent);
  _this.dispatchEvent(endEvent);
}

function touchstart(event) {
  if (_this.enabled === false) return;

  switch (event.touches.length) {
    case 1:
      _state = STATE.TOUCH_ROTATE;
      _moveCurr.copy(
        getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY)
      );
      _movePrev.copy(_moveCurr);
      break;

    default:
      // 2 or more
      _state = STATE.TOUCH_ZOOM_PAN;
      var dx = event.touches[0].pageX - event.touches[1].pageX;
      var dy = event.touches[0].pageY - event.touches[1].pageY;
      _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(
        dx * dx + dy * dy
      );

      var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
      var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
      _panStart.copy(getMouseOnScreen(x, y));
      _panEnd.copy(_panStart);
      break;
  }

  _this.dispatchEvent(startEvent);
}

function touchmove(event) {
  if (_this.enabled === false) return;

  event.preventDefault();
  event.stopPropagation();

  switch (event.touches.length) {
    case 1:
      _movePrev.copy(_moveCurr);
      _moveCurr.copy(
        getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY)
      );
      break;

    default:
      // 2 or more
      var dx = event.touches[0].pageX - event.touches[1].pageX;
      var dy = event.touches[0].pageY - event.touches[1].pageY;
      _touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);

      var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
      var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
      _panEnd.copy(getMouseOnScreen(x, y));
      break;
  }
}

function touchend(event) {
  if (_this.enabled === false) return;

  switch (event.touches.length) {
    case 0:
      _state = STATE.NONE;
      break;

    case 1:
      _state = STATE.TOUCH_ROTATE;
      _moveCurr.copy(
        getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY)
      );
      _movePrev.copy(_moveCurr);
      break;
  }

  _this.dispatchEvent(endEvent);
}

function contextmenu(event) {
  if (_this.enabled === false) return;

  event.preventDefault();
}

this.dispose = function () {
  this.domElement.removeEventListener('contextmenu', contextmenu, false);
  this.domElement.removeEventListener('mousedown', mousedown, false);
  this.domElement.removeEventListener('wheel', mousewheel, false);

  this.domElement.removeEventListener('touchstart', touchstart, false);
  this.domElement.removeEventListener('touchend', touchend, false);
  this.domElement.removeEventListener('touchmove', touchmove, false);

  document.removeEventListener('mousemove', mousemove, false);
  document.removeEventListener('mouseup', mouseup, false);

  window.removeEventListener('keydown', keydown, false);
  window.removeEventListener('keyup', keyup, false);
};

this.domElement.addEventListener('contextmenu', contextmenu, false);
this.domElement.addEventListener('mousedown', mousedown, false);
this.domElement.addEventListener('wheel', mousewheel, false);

this.domElement.addEventListener('touchstart', touchstart, false);
this.domElement.addEventListener('touchend', touchend, false);
this.domElement.addEventListener('touchmove', touchmove, false);

window.addEventListener('keydown', keydown, false);
window.addEventListener('keyup', keyup, false);

this.handleResize();

// force an update at start
this.update();

THREE.TrackballControls.prototype = Object.create(
  THREE.EventDispatcher.prototype
);
THREE.TrackballControls.prototype.constructor = THREE.TrackballControls;
}
