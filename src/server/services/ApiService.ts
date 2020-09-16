import { IApi } from '@interfaces/IApi';
import { IData } from '@interfaces/IData';
import * as cheerio from 'cheerio';
import agent from 'superagent';
import charset from 'superagent-charset';
const superagent = charset(agent);
let arr:any = [] ;

class ApiService implements IApi {
  getInfo() {
    return new Promise<IData>((resolve) => {
      resolve({
        item: '我是后台数据🌺',
        result: [1, 'next'],
      });
    });
  }

  async getBlogList() {
    let url = 'http://blog.yidengxuetang.com/'; //target地址
    let data = await  superagent.get(url).charset('utf-8').buffer(true);
    let html = data.text,
          $ = cheerio.load(html, {
            decodeEntities: false,
            ignoreWhitespace: false,
            xmlMode: false,
            lowerCaseTags: false
          });
          arr = [];
        // cheerio的使用类似jquery的操作
        $("#body .container .col-group #main .res-cons article").each((index, element) => {
          const title = $('article header h1 a' ,element).text().trim();
          const date = $('date', element).text().split('\n')[1].trim();
          const type = $('.post-meta .meta-category a', element).text().trim();
          const content = $('.post-content', element).text().trim();
          arr.push({title, date, type, content});
      })
      return new Promise<IData>((resolve) => {
        resolve({
          code: 200,
          message: 'successful',
          result: arr,
        });
      });
  }

  async getBlogCategories() {
    let arrType:any = [];
    let arrContent:any = [];
    let url = 'http://blog.yidengxuetang.com/categories/'; //target地址
    let data = await  superagent.get(url).charset('utf-8').buffer(true);
    let html = data.text,
          $ = cheerio.load(html, {
            decodeEntities: false,
            ignoreWhitespace: false,
            xmlMode: false,
            lowerCaseTags: false
          });
          arr = [];
        $("#body .container .col-group #main .post-archive h2").each((index, element) => {
          const type = $('h2 a' ,element).text().trim();
          arrType.push({type});
        })
        $("#body .container .col-group #main .post-archive ul").each((index, element) => {
            let ContentList:any = [];
            $('li' ,element).each((index,miniElement) => {
                const date = $('.date', miniElement).text().trim();
                const content = $('a', miniElement).text().trim();
                ContentList.push({
                    date,
                    content
                });
            })
            arrContent.push({
                ContentList
            });
        })
        arrType.forEach((i:any, index:number) => {
            arrContent[index].type = i.type;
        })
        return new Promise<IData>((resolve) => {
          resolve({
            code: 200,
            message: 'successful',
            result: arrContent,
          });
        });
  }

  async getBlogArchives() {
    let arrTime:Array<any> = [];
    let arrContent:Array<any> = [];
    let url = 'http://blog.yidengxuetang.com/archives/'; //target地址
    let data = await  superagent.get(url).charset('utf-8').buffer(true);
    let html = data.text,
          $ = cheerio.load(html, {
            decodeEntities: false,
            ignoreWhitespace: false,
            xmlMode: false,
            lowerCaseTags: false
          });
          arr = [];
        $("#body .container .col-group #main .post-archive h2").each((index, element) => {
          const time = $(element).text().trim();
          arrTime.push({time});
        })
        $("#body .container .col-group #main .post-archive ul").each((index, element) => {
            let ContentList:any = [];
            $('li' ,element).each((index,miniElement) => {
                const date = $('.date', miniElement).text().trim();
                const content = $('a', miniElement).text().trim();
                ContentList.push({
                    date,
                    content
                });
            })
            arrContent.push({
                ContentList
            });
        })
        arrTime.forEach((i:any,index:number) => {
            arrContent[index].time = i.time;
        })
        return new Promise<IData>((resolve) => {
          resolve({
            code: 200,
            message: 'successful',
            result: arrContent,
          });
        });
  }

  async getBlogCurrentInfoAndTypeAndTag() {
    interface mapTitleType {
      [propName: string]: any
    }
    let CurrentArticle:Array<string> = [];
    let Type:Array<string> = [];
    let Tag:Array<string> = [];
    let url = 'http://blog.yidengxuetang.com'; //target地址
    let data = await  superagent.get(url).charset('utf-8').buffer(true);
    let html = data.text,
          $ = cheerio.load(html, {
            decodeEntities: false,
            ignoreWhitespace: false,
            xmlMode: false,
            lowerCaseTags: false
          });
          arr = [];
        const mapTitle:mapTitleType = {
            '最近文章': $('.widget-list li').each((ind, miniElement) => {
                CurrentArticle.push($('a', miniElement).text().trim())
            }),
            '分类': $('.widget-list li').each((ind, miniElement) => {
                Type.push($('a', miniElement).text().trim())
            }),
            '标签': $('.tagcloud a').each((ind, miniElement) => {
                $(miniElement).text().trim() && Tag.push($(miniElement).text().trim())
            })
        };
        $("#secondary .widget").each((index, element) => {
          const title =  $('.widget-title', element).text();
          mapTitle[title]
        })

        return new Promise<IData>((resolve) => {
          resolve({
            code: 200,
            message: 'successful',
            result: {
              CurrentArticle,
              Type,
              Tag
            }
          });
        });
  }
}

export default ApiService;