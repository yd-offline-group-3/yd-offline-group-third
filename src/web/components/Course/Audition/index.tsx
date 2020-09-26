import "./audition.css";
import * as React from "react";
import auditionAnimate from './three-track-css3dRender';
import { useEffect } from "react";


const Audition = () => {
    useEffect(() => {
        auditionAnimate();
    })
    return (
            <div id="container"></div>
    );
};
export default Audition;
