import "./index.css";
import * as React from "react";
import FutureDesc from './FutureDesc/index';
import CourseList from './CourseList/index'
import EarthThree from './Audition/index'

const CourtDesc:React.FC = () => {
    return (
        <div className="components-Audition">
            <EarthThree></EarthThree> 
            <FutureDesc></FutureDesc>
           <CourseList></CourseList>
        </div>
    );
};
export default CourtDesc;
