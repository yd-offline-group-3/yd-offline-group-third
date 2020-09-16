import  React from 'react';

type TList={
  title:String,
  desc1:String,
  desc2:String,
  desc3:string,
  courseUrl:string
}
interface IProps {
    list: TList
  }
const ListView:React.FC<IProps>=(props):JSX.Element=>{
    const {list}=props;
    return (
        <div className='Courst-List'>
          <h1 className='courst-title'>{list.title}</h1>
          <p className='courst-desc'>{list.desc1}</p>
          <p className='courst-desc'>{list.desc2}</p>
          <p className='courst-desc'>{list.desc3}</p>
          <a href={list.courseUrl}>课程大纲链接</a>
        </div>
    )
}
export default ListView