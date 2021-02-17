<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import Layout from '@/layout'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      // const menuList = this.getRouters(this.$store.getters.menu)
      // console.log(menuList)
      // this.$router.addRoutes(menuList)
      // this.$router.options.routes = menuList
      // console.log(this.$router.options.routes.concat(this.$store.getters.menu))
      return this.$router.options.routes.concat(this.$store.getters.menu)

      // return menuList
    },

    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    filterAsyncRouter(menuList) {
      const menus = []
      menuList.forEach(menu => {
        const m = {
          path: menu.path,
          component: Layout,
          redirect: menu.redirect,
          name: menu.enname,
          children: [],
          hidden: menu.available === 0
        }
        // 如果存在子标题，则递归子标题，否则构造一个子标题
        if (menu.children && menu.children.length) {
          m.children.push(this.getChildRouters(menu.children))
        } else {
          m.children.push({
            path: menu.url,
            component: () => import('@/views/' + menu.component),
            name: menu.enname,
            meta: { title: menu.label, icon: menu.icon }
          })
        }
        menus.push(m)
      })
      // 加载默认的路由
      menus.push({
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
      })
      menus.push({
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
      })
      return menus
    },
    getChildRouters(menuList) {
      const menus = []
      menuList.forEach(menu => {
        const m = {
          path: menu.path,
          component: () => import('@/views/' + menu.component),
          name: menu.enname,
          meta: { title: menu.label, icon: menu.icon },
          children: [],
          hidden: menu.available === 0
        }
        if (menu.children && menu.children.length) {
          m.children.push(this.getChildRouters(menu.children))
        }
        menus.push(m)
      })
      return menus
    }
  }
}
</script>
