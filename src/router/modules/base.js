/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import '@/assets/icon/iconfont.css'
const baseRouter = {
  path: '/base',
  component: Layout,
  // redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: '基础数据',
    icon: 'table'
  },
  children: [
    {
      path: '/baseShipper',
      component: () => import('@/views/base/baseShipper/baseShipper'),
      name: 'baseShipper',
      meta: { title: '仓库货主管理', icon: 'cross' }
    },
    {
      path: '/baseWarehouse',
      component: () => import('@/views/base/baseWarehouse/baseWarehouse'),
      name: 'baseWarehouse',
      meta: { title: '仓库管理', icon: 'cross' }
    },
    {
      path: '/baseWarehouseArea',
      component: () => import('@/views/base/baseWarehouseArea/baseWarehouseArea'),
      name: 'baseWarehouseArea',
      meta: { title: '仓库区域管理', icon: 'cross' }
    },
    {
      path: '/shelfManagement',
      component: () => import('@/views/base/shelfManagement/shelfManagement'),
      name: 'shelfManagement',
      meta: { title: '货架管理', icon: 'cross' }
    },
    {
      path: '/goodsLocation',
      component: () => import('@/views/base/goodsLocation/goodsLocation'),
      name: 'goodsLocation',
      meta: { title: '货位管理', icon: 'cross' }
    },
    {
      path: '/typeManagement',
      component: () => import('@/views/base/typeManagement/typeManagement'),
      name: 'typeManagement',
      meta: { title: '物资类型管理', icon: 'cross' }
    },
    {
      path: '/supplierManagement',
      component: () => import('@/views/base/supplierManagement/supplierManagement'),
      name: 'supplierManagement',
      meta: { title: '供应商管理', icon: 'cross' }
    },
    {
      path: '/goodsManagement',
      component: () => import('@/views/base/goodsManagement/goodsManagement'),
      name: 'goodsManagement',
      meta: { title: '物资管理', icon: 'cross' }
    }
    // {
    //   path: 'dynamic-table',
    //   component: () => import('@/views/table/dynamic-table/index'),
    //   name: 'DynamicTable',
    //   meta: { title: 'Dynamic Table' }
    // },
    // {
    //   path: 'drag-table',
    //   component: () => import('@/views/table/drag-table'),
    //   name: 'DragTable',
    //   meta: { title: 'Drag Table' }
    // },
    // {
    //   path: 'inline-edit-table',
    //   component: () => import('@/views/table/inline-edit-table'),
    //   name: 'InlineEditTable',
    //   meta: { title: 'Inline Edit' }
    // }
  ]
}
export default baseRouter
