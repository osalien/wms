/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemRouter = {
  path: '/components',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  meta: {
    title: '系統管理',
    icon: 'component'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/system/user/user'),
      name: 'user',
      meta: { title: '用戶管理' }
    },
    {
      path: 'role',
      component: () => import('@/views/system/role/role'),
      name: 'role',
      meta: { title: '角色与权限管理' }
    },
    {
      path: 'dept',
      component: () => import('@/views/system/dept/dept'),
      name: 'dept',
      meta: { title: '部门管理' }
    },
    {
      path: 'job',
      component: () => import('@/views/system/job/job'),
      name: 'job',
      meta: { title: '岗位与权限管理' }
    }
    // {
    //   path: 'drag-kanban',
    //   component: () => import('@/views/components-demo/drag-kanban'),
    //   name: 'DragKanbanDemo',
    //   meta: { title: 'Drag Kanban' }
    // }
  ]
}

export default systemRouter
