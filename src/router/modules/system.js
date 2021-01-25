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
      path: 'tinymce',
      // component: () => import('@/views/components-demo/tinymce'),
      name: 'TinymceDemo',
      meta: { title: '用戶管理' }
    },
    {
      path: 'markdown',
      // component: () => import('@/views/components-demo/markdown'),
      name: 'MarkdownDemo',
      meta: { title: '角色与权限管理' }
    },
    {
      path: 'json-editor',
      // component: () => import('@/views/components-demo/json-editor'),
      name: 'JsonEditorDemo',
      meta: { title: '部门管理' }
    },
    {
      path: 'split-pane',
      // component: () => import('@/views/components-demo/split-pane'),
      name: 'SplitpaneDemo',
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
