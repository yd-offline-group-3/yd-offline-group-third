import  React from 'react';

type TList={
  title:String,
  desc:String,
}
interface IProps {
    list: TList
  }
const ListView:React.FC<IProps>=(props):JSX.Element=>{
    const {list}=props;
    return (
        <div className='Courst-List'>
          <h1 className='courst-title'>{list.title}</h1>
          <p className='courst-desc'>{list.desc}</p>
          <a href=''>课程大纲链接</a>
        </div>
    )
}
export default ListView