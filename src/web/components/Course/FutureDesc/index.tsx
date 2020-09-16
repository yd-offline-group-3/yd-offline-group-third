import React, { useState}  from 'react';
import '../FutureDesc/futerDesc.css'

const FutureDesc:React.FunctionComponent=()=>{
    const [descArr]=useState([
        '未来以来',
        '前端工程师再不是页面仔',
        '一切看得见的东西都是前端',
        '你准备好了吗'
    ]);
    return <section className='desc-container'>
        {
        React.Children.map([descArr],(item)=>{
            return <p className='desc'>{item}</p>
        })
    }
    </section>
}
export default FutureDesc