import { GET, route } from 'awilix-koa';
import Router from 'koa-router';
import { IApi } from '@interfaces/IApi';

@route('/api')
class ApiController {
  private apiService: IApi;

  constructor({ apiService }: { apiService: IApi }) {
    this.apiService = apiService;
  }

  @route('/list')
  @GET()
  async actionList(
    ctx: Router.IRouterContext,
  ): Promise<void> {
    const data = await this.apiService.getInfo();
    ctx.body = {
      ...data,
    };
  }

  @route('/blog-list')
  @GET()
  async actionBlogList(
    ctx: Router.IRouterContext,
  ): Promise<void> {
    const data = await this.apiService.getBlogList();
    ctx.body = {
      ...data,
    };
  }

  @route('/blog-categories')
  @GET()
  async actionBlogCategories(
    ctx: Router.IRouterContext,
  ): Promise<void> {
    const data = await this.apiService.getBlogCategories();
    ctx.body = {
      ...data,
    };
  }

  @route('/blog-archives')
  @GET()
  async actionBlogArchives(
    ctx: Router.IRouterContext,
  ): Promise<void> {
    const data = await this.apiService.getBlogArchives();
    ctx.body = {
      ...data,
    };
  }

  @route('/blog-infotypetag')
  @GET()
  async actionBlogCurrentInfoAndTypeAndTag(
    ctx: Router.IRouterContext,
  ): Promise<void> {
    const data = await this.apiService.getBlogCurrentInfoAndTypeAndTag();
    ctx.body = {
      ...data,
    };
  }
}
export default ApiController;