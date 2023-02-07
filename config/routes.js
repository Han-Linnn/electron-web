export default [
  {
    path: '/user',
    // component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        // authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/channel',
          },
          // {
          //   path: '/chart',
          //   name: 'workbench',
          //   icon: 'bar-chart',
          //   component: './workbench',
          // },
          {
            path: '/channel',
            name: 'channel',
            icon: 'cloud-sync',
            component: './channel',
          },
          {
            path: '/resume',
            name: 'resume',
            icon: 'user',
            component: './resume',
          },
          {
            path: '/position',
            name: 'position',
            icon: 'solution',
            component: './position',
          },
          {
            path: '/recycle',
            name: 'recycle',
            icon: 'rest',
            component: './recycle',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
