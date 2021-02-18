<template>
  <div class="app-container">
    <el-container style="height: 600px; border: 1px solid #eee">
      <el-aside width="300px" style="background-color: rgb(238, 241, 246);border: 10px solid #eee;">
        <el-tree
          :data="data"
          node-key="id"
          :default-expanded-keys="[2, 3]"
          :props="defaultProps"
          @node-click="nodeClick"
          @node-contextmenu="rightClick"
        />
        <div id="menu" @mouseleave="menuVisible = !menuVisible">
          <el-card v-if="menuVisible" class="box-card">
            <div class="text item">
              <el-link icon="el-icon-circle-plus-outline" :underline="false" @click="addNode(operateNode)">添加</el-link>
            </div>
            <div class="text item">
              <el-link icon="el-icon-remove-outline" :underline="false" @click="removeNode(operateNode)">删除</el-link>
            </div>
          </el-card>
        </div>
      </el-aside>
      <el-main style="border: 10px solid #eee;">
        <menu-form ref="menuForm" :node="nodeData" :has-clear="hasClear" @reset="reset" @refreshMenu="refreshMenu"/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import MenuForm from './components/MenuForm'
import { getMenuList } from '@/api/menu'
export default {
  name: 'Menu',
  components: { MenuForm },
  data() {
    return {
      data: [
        {
          id: 1,
          label: '一级 1',
          path: '/',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
      defaultProps: {
        id: 'id',
        children: 'children',
        label: 'label'
      },
      nodeData: {},
      operateNode: {},
      menuVisible: false,
      hasClear: true // 是否清除表单：true=添加操作  false=更新操作
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    nodeClick(node, even) {
      this.setNode(node.id, even.parent.label)

      this.hasClear = false
      this.$refs.menuForm.getMenu(node.id)
    },
    rightClick(MouseEvent, object, node, element) {
      this.operateNode = object
      this.menuVisible = true
      const menu = document.querySelector('#menu')
      if (menu) {
        menu.style.cssText = 'position: fixed; left: ' + (MouseEvent.clientX - 10) + 'px' + '; top: ' + (MouseEvent.clientY - 25) + 'px; z-index: 999; cursor:pointer;'
      }
    },

    // 添加操作
    addNode(node) {
      node = node.rootNode
      // 清空表单
      this.hasClear = true
      this.$refs.menuForm.resetForm()
      this.setNode(node.id, node.label)
      this.menuVisible = false
    },
    // 删除操作
    removeNode(node) {
      // 获取该节点下的子节点id
      const ids = this.getNodeIds(node.id, node.children)
      ids.push(node.id)
      console.log(ids)
      this.$refs.menuForm.delete(ids)
      this.refreshMenu()
      this.menuVisible = false
    },
    setNode(id, label) {
      this.$set(this.nodeData, 'id', id)
      this.$set(this.nodeData, 'label', label)
    },
    getMenuList() {
      getMenuList().then(res => {
        if (res.success) {
          this.data = res.data
        }
      })
    },
    // 刷新菜单栏
    refreshMenu() {
      this.getMenuList()
    },
    // 重置
    reset() {
      this.$set(this.nodeData, 'label', '')
      this.hasClear = true
    },
    // 获取节点id
    getNodeIds(pid, nodes) {
      const menus = []
      nodes.forEach(node => {
          menus.push(node.id)
          if (node.children && node.children.length) {
            const ids = this.getNodeIds(node.id, node.children)
            ids.forEach(id => {
              menus.push(id)
            })
          }
      })
      return menus
    }
  }
}
</script>

<style>
  .el-aside {
    color: #333;
  }
</style>
