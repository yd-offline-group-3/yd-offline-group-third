import React, {FC, useRef, useEffect, useState} from 'react';
import 'css-doodle';

interface IProps {
    rule?: string
}

const Doodle:FC<IProps> = ({rule = ''}) => {
    // const ref = useRef()
    // const [count, setCount] = useState(0);

    // let timer = setInterval(() => {
    //     console.log('正在跑');
    //     ref.current.update()
    // }, 3000)


    // useEffect(() => {
    //     console.log(ref.current);
    //     ref.current.update()
    //     return () => {
    //         console.log('不动了');
    //         clearInterval(timer)
    //     }
    //   }, [count]);

    return (
        <css-doodle>{rule}</css-doodle>
    );
}


export default Doodle;