import * as React from 'react';
import {
  Route, Switch, RouteProps, Redirect,
} from 'react-router-dom';
import Loading from '@components/Loading';
import Home from '@components/Home';
import NotFound from '@components/NotFound';
// import { string } from "prop-types";
const { lazy, Suspense } = React;

const AboutUs = lazy(() => import(/* webpackChunkName:"AboutUs" */ '@pages/AboutUs'));
const Audition = lazy(() => import(/* webpackChunkName:"Audition" */ '@components/Course/Audition'));
const Cooperation = lazy(() => import(/* webpackChunkName:"Cooperation" */ '@components/Cooperation'));
const MyDoole = lazy(() => import(/* webpackChunkName:"MyDoole" */ '@components/Cooperation/cssdoodle'));
interface YDProps extends RouteProps {
  auth?: boolean;
}
export const routes: YDProps[] = [
  {
    path: '/',
    exact: true,
    component: Home,
    auth: true,
  },
  {
    path: '/AboutUs',
    exact: true,
    component: AboutUs,
  },
  {
    path: '/course/audition',
    exact: true,
    component: Audition,
  },
  {
    path: '/Cooperation',
    exact: true,
    component: AboutUs,
    
  },
  {
    path: '/course/audition',
    exact: true,
    component: Audition,
  }
];

// 对状态属性进行监听
const Routes = (token: string) => (
  <Suspense fallback={<Loading />}>
    <Switch>
      {routes.map((r, index) => {
        console.log('🍊', index);
        const { path, exact, component } = r;
        const LazyCom = component;
        return (
          <Route
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            path={path}
            exact={exact}
            // eslint-disable-next-line no-nested-ternary
            render={(props) => (!r.auth ? (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <LazyCom {...props} />
            ) : token ? (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <LazyCom {...props} />
            ) : (
                  <Redirect
                    to={{
                      pathname: '/course/audition',
                      state: { from: props.location },
                    }}
                  />
                ))}
          />
        );
      })}
      <Route component={NotFound} />
    </Switch>
  </Suspense>
);

export default Routes;
