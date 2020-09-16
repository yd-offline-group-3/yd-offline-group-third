import "./audition.css";
import * as React from "react";
// import * as THREE from "three";
// import TWEEN from "@tweenjs/tween.js";
// import auditionAnimate from '../../../assets/audition/js';
import auditionAnimate from './three-track-css3dRender';
import { useEffect } from "react";
import FutureDesc from '../FutureDesc/index';
import CourseList from '../CourseList/index'


const Audition = () => {
    useEffect(() => {
        // console.log(TWEEN);
        // auditionAnimate(THREE, TWEEN);
        auditionAnimate();
    })

    return (
        <div className="components-Audition">
            <div id="container"></div>
            <FutureDesc></FutureDesc>
           <CourseList></CourseList>
        </div>
    );
};
export default Audition;
