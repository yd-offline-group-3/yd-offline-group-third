import  React,{useState,useEffect} from 'react';
import ListView from './ListView'

import './course.css'
import '@assets/audition/css/animate.min.css'
interface ICourse{
    title:String,
    desc:String
}

const CourseList:React.FunctionComponent=()=>{
    const _in:Array<string> = ['bounceIn','bounceInDown','bounceInLeft','bounceInRight','bounceInUp','fadeIn','fadeInDown','fadeInDownBig','fadeInLeft','fadeInLeftBig','fadeInRight','fadeInRightBig','fadeInUp','fadeInUpBig','rotateIn','rotateInDownLeft','rotateInDownRight','rotateInUpLeft','rotateInUpRight','slideInDown','slideInLeft','slideInRight'];
    const _out:Array<string> = ['bounceOut','bounceOutDown','bounceOutLeft','bounceOutRight','bounceOutUp','fadeOut','fadeOutDown','fadeOutDownBig','fadeOutLeft','fadeOutLeftBig','fadeOutRight','fadeOutRightBig','fadeOutUp','fadeOutUpBig','rotateOut','rotateOutDownLeft','rotateOutDownRight','rotateOutUpLeft','rotateOutUpRight','slideOutDown','slideOutLeft','slideOutRight'];
    const [courseDesc,setCourse]=useState<ICourse>({title:'React',desc:'Facebook的开源框架React.js，基于Virtual DOM重新定义了用户界面的开发方式，彻底革新了大家对前端框架的认识，将PHP风格的开发方式迁移到客户端应用开发。其优势在于可以与各种类库、框架搭配使用'});    
    const [animateClass,setAnimateClass]=useState<string>('');
    useEffect(()=>{
        listenerClickHandle()
    },[])
    const listenerClickHandle=()=>{
        window.addEventListener("getCourseDesc", function (e) {
            var rand_in:number = Math.round(Math.random() * _in.length);
            var rand_out:number = Math.round(Math.random() * _out.length);
            setAnimateClass(_out[rand_out])
            setAnimateClass(_in[rand_in])
            let item=JSON.parse(localStorage.getItem("courseItem"))
            console.log(item)
            setCourse(item);
        })
    }
    return  ( <div className={`course-list_container animated ${animateClass}`}>
                    <ListView   list={courseDesc}></ListView>
                </div>
            )
}
export default CourseList
