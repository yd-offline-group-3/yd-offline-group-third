import * as React from "react";
import './index.css'
import BJmap from './components/bmap'
// 定义interface
interface MainTitle {
  value: string
}

// 头部 标题
const Header: React.FC<MainTitle> = (props) => {
  const { value } = props
  return (
    <h3 className='about-title'>
      <span className='decor'></span>
      <span className='typing'>{value}</span>
    </h3>
  )
}


// 联系我们的内容
const ContactUs: React.FC = () => {
  let list: string[] = ['📱 电话：18510143909', '🎭 微信：yidengxuetang', '🐧QQ群：566025158', '📬 地址：北京市昌平区金域国际中心B座602']
  const imgAddress = require('../../assets/images/aboutus/address.png')
  const imgEmail = require('../../assets/images/aboutus/email.png')
  const imgCooperation = require('../../assets/images/aboutus/cooperation.png')
  const imgPhone = require('../../assets/images/aboutus/phone.png')
  return (
      <div className="contactUs">
        <div className="contactUs-content">
          <img src={imgAddress} alt="" />
          <p className="content-title">京城一灯总部地址</p>
          <p className="content-desc">北京市昌平区金域国际中心B座602</p>
        </div>
        <div className="contactUs-content">
          <img src={imgEmail} alt="" />
          <p className="content-title">课程咨询和服务</p>
          <p className="content-desc">🎭 微信：yidengxuetang<br/>🐧 QQ群：566025158</p>
        </div>
        <div className="contactUs-content">
          <img src={imgCooperation} alt="" />
          <p className="content-title">商务合作</p>
          <p className="content-desc">🎭 微信：yidengxuetang<br/>🐧 QQ群：566025158</p>
        </div>
        <div className="contactUs-content">
          <img src={imgPhone} alt="" />
          <p className="content-title">热线电话</p>
          <p className="content-desc">📱 电话：18510143909</p>
        </div>
      </div>
  )
}

// 关于我们
const AboutUs: React.FC = () => {
  return (
    <div>
      <p className='p-Wrap'>  2016年春天志佳老师创办京程一灯(北京一灯教育科技有限公司)，志佳老师曾任职百度LBS搜索研发部，负责百度地图H5性能方向，后进入腾讯MIG负责腾讯地图H5版本架构搭建。京程一灯由志佳、王宁老师为主讲老师，以及滴滴资深前端工程师、Icharts框架作者、阿里巴巴前端开发专家、蘑菇街资深前端工程师等等作为我们的特邀讲师团。成立以来我们输送了大量的同学进入YY、阿里、今日头条、美团等等一线企业。</p>
      <p className='p-Wrap'>  京程一灯给大家提供一个高端进阶和触碰名企的圈子，我们维持这样的团队只有一个目的：让同学们快速掌握最前沿的高端技术！编程路漫漫，我们抛弃了高薪稳定的工作，只想让有梦的你们走进名企，真正体会到大公司编程的乐趣。也希望和你一起走进山区尽我们微薄之力去看望哪里的孩子们~</p>
    </div>
  )
}

//公司发展
const CompanyDevelopment: React.FC = () => {
  const img2 = require('../../assets/images/aboutus/2017.png')
  const img1 = require('../../assets/images/aboutus/2016.png')
  const img3 = require('../../assets/images/aboutus/sanjiao.png')
  return (
    <div className="history">
      <div className="history-left">
        <div className="history-auto-list">
          <div>
            <img src={img1} alt="" />
            <h3>2016年3月</h3>
            <p>北京一灯教育科技有限公司"成立</p>
            <h3>2016年6月</h3>
            <p>获清华大学经管学院天使轮投资</p>
            <h3>2016年9月</h3>
            <p>针对精英班闯关式学习系统上线</p>
            <h3>2016年12月</h3>
            <p>腾讯精品课"2016优质教育机构"奖</p>
          </div>

        </div>
      </div>
      <div className="history-center">
        <div className="icon-2017">
          <img src={img3} alt="" />
          <div className="line"></div>
        </div>
        <div className="icon-2016">
          <img src={img3} alt="" />
        </div>
      </div>
      <div className="history-right">
        <div className="history-auto-list right-1">
          <div>
            <img src={img2} alt="" />
            <h3>2017年7月</h3>
            <p>京程一灯与腾讯课堂联合运营</p>
          </div>

        </div>
      </div>
    </div>
  )
}

const main: React.FC = () => {
  let list: Array<string> = ['联系我们 Contactus', '关于我们 About us', '公司发展 Company development', '公司地址 Company address']
  return (
    <div className='aboutUs-layout'>

      <Header value={list[1]}></Header>
      <AboutUs></AboutUs>
      <Header value={list[2]}></Header>
      <CompanyDevelopment></CompanyDevelopment>
      <Header value={list[3]}></Header>
      <BJmap></BJmap>
      <Header value={list[0]}></Header>
      <ContactUs></ContactUs>
    </div>
  );
};
export default main;
