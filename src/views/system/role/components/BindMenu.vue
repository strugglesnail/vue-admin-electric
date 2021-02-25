<template>
  <el-dialog
    title="角色授权"
    :visible.sync="bindParam.visible"
    width="30%"
    :before-close="close"
    @open="beforeOpen"
  >
    <el-tree
      ref="tree"
      :data="data"
      show-checkbox
      default-expand-all
      node-key="id"
      highlight-current
      :props="defaultProps"
      @node-click="nodeClick"
      @check-change="chooseNode"
    />

    <div class="buttons">
      <!--<el-button @click="getCheckedNodes">通过 node 获取</el-button>-->
      <el-button @click="getCheckedKeys">通过 key 获取</el-button>
      <!--<el-button @click="setCheckedNodes">通过 node 设置</el-button>-->
      <!--<el-button @click="setCheckedKeys">通过 key 设置</el-button>-->
      <!--<el-button @click="resetChecked">清空</el-button>-->
    </div>
    <span v-if="!bindParam.isView" slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getMenuByRoleId, updateRoleMenu } from '@/api/role'
export default {
  name: 'BindMenu',
  props: {
    bindParam: {
      type: Object
    }
  },
  data() {
    return {
      data: [{
        label: '全部',
        children: []
      }],
      chooseNodes: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    getRoleId() {
      return this.bindParam.roleId
    }
  },
  methods: {
    beforeOpen() {
      this.getRoleMenu()
    },
    nodeClick(node, even) {
      // console.log(even.parent.label)
    },
    // 获取角色菜单
    getRoleMenu() {
      getMenuByRoleId({ roleId: this.getRoleId }).then(res => {
        if (res.success) {
          const data = res.data
          if (data) {
            this.data[0].children = data.allMenu
            this.chooseNodes = data.roleMenu
            setTimeout(() => {
              const roleMenus = data.roleMenu
              if (roleMenus && roleMenus.length) {
                // 过滤掉带有子节点的父节点：原因是tree带有父节点默认全选
                const matchMenus = roleMenus.filter(a => !roleMenus.some(b => b.parentId === a.id))
                console.log('matchMenus: ', matchMenus.map(m => m.label))
                this.$refs.tree.setCheckedNodes(matchMenus)
              }
            }, 10)
          }
        }
      })
    },
    // 选中节点
    chooseNode(data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
    },
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes())
    },
    getCheckedKeys() {
      console.log('sonNode: ', this.$refs.tree.getCheckedKeys())
      const parentIdMenuIds = this.$refs.tree.getHalfCheckedKeys().filter(m => m)
      console.log('parentNode: ', parentIdMenuIds)
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([3])
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    onSubmit() {
      const newMenuIds = []
      const oldMenuIds = []
      const parentIdMenuIds = this.$refs.tree.getHalfCheckedKeys().filter(m => m)
      const menuIds = parentIdMenuIds.concat(this.$refs.tree.getCheckedKeys())
      // 获取新增的菜单
      if (this.chooseNodes && this.chooseNodes.length) {
        menuIds.forEach(menuId => {
          if (!this.chooseNodes.some(n => menuId === n.id)) {
            newMenuIds.push(menuId)
          }
          if (this.chooseNodes.some(n => menuId === n.id)) {
            oldMenuIds.push(menuId)
          }
        })
      }
      // 更新菜单
      // console.log('parentIdMenuIds: ', parentIdMenuIds)
      // console.log('newMenuIds: ', newMenuIds)
      // console.log('oldMenuIds: ', oldMenuIds)
      updateRoleMenu({ oldMenuIds: oldMenuIds, newMenuIds: newMenuIds, roleId: this.getRoleId }).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          this.close()
        } else {
          this.$message.success(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    close() {
      this.bindParam.visible = false
    }
  }
}
</script>

<style scoped>

</style>
