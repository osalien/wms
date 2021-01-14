/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/charts',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Charts',
  meta: {
    title: '业务模块',
    icon: 'chart'
  },
  children: [
    {
      path: 'inboundOutboundManagement',
      component: () => import('@/views/businessModule/inboundOutboundManagement/inboundOutboundManagement'),
      name: 'inboundOutboundManagement',
      meta: { title: '出/入库单管理', icon: 'cross', noCache: true }
    },
    {
      path: 'goodsBrowse',
      component: () => import('@/views/businessModule/goodsBrowse/goodsBrowse'),
      name: 'goodsBrowse',
      meta: { title: '货位一览', icon: 'cross', noCache: true }
    },
    {
      path: 'inventoryManagement',
      component: () => import('@/views/businessModule/inventoryManagement/inventoryManagement'),
      name: 'inventoryManagement',
      meta: { title: '盘点管理', icon: 'cross', noCache: true }
    },
    {
      path: 'outWarehouseManagement',
      component: () => import('@/views/businessModule/outWarehouseManagement/outWarehouseManagement'),
      name: 'outWarehouseManagement',
      meta: { title: '出库管理', icon: 'cross', noCache: true }
    },
    {
      path: 'inWarehouseManagement',
      component: () => import('@/views/businessModule/inWarehouseManagement/inWarehouseManagement'),
      name: 'inWarehouseManagement',
      meta: { title: '入库管理', icon: 'cross', noCache: true }
    },
    {
      path: 'dispatchingManagement',
      component: () => import('@/views/businessModule/dispatchingManagement/dispatchingManagement'),
      name: 'dispatchingManagement',
      meta: { title: '调派管理', icon: 'cross', noCache: true }
    },
    {
      path: 'inventoryReport',
      component: () => import('@/views/businessModule/inventoryReport/inventoryReport'),
      name: 'inventoryReport',
      meta: { title: '库存报表', icon: 'cross', noCache: true }
    },
    {
      path: 'inventoryHistory',
      component: () => import('@/views/businessModule/inventoryHistory/inventoryHistory'),
      name: 'inventoryHistory',
      meta: { title: '库存历史记录', icon: 'cross', noCache: true }
    },
    {
      path: 'discardQuery',
      component: () => import('@/views/businessModule/discardQuery/discardQuery'),
      name: 'discardQuery',
      meta: { title: '报废查询', icon: 'cross', noCache: true }
    }
  ]
}

export default chartsRouter
