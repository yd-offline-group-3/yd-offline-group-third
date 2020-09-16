import  React,{useState,useEffect} from 'react';
import ListView from './ListView'

import './course.css'
import '../../../assets/audition/css/animate.min.css'
interface ICourse{
    title:String,
    desc1:String,
    desc2:String,
    desc3:string,
    courseUrl:string
}

const CourseList:React.FunctionComponent=()=>{
    const initState:Array<ICourse>= [{
        title:'React',
        desc1:'React是Facebook开发的一款JS库,当下必须学到的技术',
        desc2:'课程中的部分由入门到应用，再到原理，源码由浅入深，快速对一门技术掌握',
        desc3:'公司招聘不可缺少的技能',
        courseUrl:'href'
    },{
        title:'vue',
        desc1:'React是Facebook开发的一款JS库,当下必须学到的技术',
        desc2:'课程中的部分由入门到应用，再到原理，源码由浅入深，快速对一门技术掌握',
        desc3:'公司招聘不可缺少的技能',
        courseUrl:'href'
    }]
    var _in:Array<string> = ['bounceIn','bounceInDown','bounceInLeft','bounceInRight','bounceInUp','fadeIn','fadeInDown','fadeInDownBig','fadeInLeft','fadeInLeftBig','fadeInRight','fadeInRightBig','fadeInUp','fadeInUpBig','rotateIn','rotateInDownLeft','rotateInDownRight','rotateInUpLeft','rotateInUpRight','slideInDown','slideInLeft','slideInRight'];
    var _out:Array<string> = ['bounceOut','bounceOutDown','bounceOutLeft','bounceOutRight','bounceOutUp','fadeOut','fadeOutDown','fadeOutDownBig','fadeOutLeft','fadeOutLeftBig','fadeOutRight','fadeOutRightBig','fadeOutUp','fadeOutUpBig','rotateOut','rotateOutDownLeft','rotateOutDownRight','rotateOutUpLeft','rotateOutUpRight','slideOutDown','slideOutLeft','slideOutRight'];
     
    const [animateClass,setAnimateClass]=useState<string>('');
    const [displayIndex,setIndex]=useState<number>(0)
    useEffect(()=>{
        setInterval(()=>{
            var rand_in:number = Math.round(Math.random() * _in.length);
            var rand_out:number = Math.round(Math.random() * _out.length);
            setAnimateClass(_in[rand_in])
            setIndex(parseInt(Math.random() * initState.length+''))
            setTimeout(()=>{
                setAnimateClass(_out[rand_out])
            },3000)
        },3000)
    },[])
    const [courseArray]=useState<Array<ICourse>>(initState);
    return  ( <div className={`course-list_container animated ${animateClass}`}>
                    <ListView   list={courseArray[displayIndex]}></ListView>
                </div>
            )
}
export default CourseList
