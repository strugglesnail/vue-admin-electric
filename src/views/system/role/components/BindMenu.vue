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
      @check-change="chooseNode"
    />

    <div class="buttons">
      <!--<el-button @click="getCheckedNodes">通过 node 获取</el-button>-->
      <el-button @click="getCheckedKeys">通过 key 获取</el-button>
      <!--<el-button @click="setCheckedNodes">通过 node 设置</el-button>-->
      <!--<el-button @click="setCheckedKeys">通过 key 设置</el-button>-->
      <el-button @click="resetChecked">清空</el-button>
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
      data: [
        {
          id: 1,
          label: '一级 1',
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
    // 获取角色菜单
    getRoleMenu() {
      getMenuByRoleId({ roleId: this.getRoleId }).then(res => {
        if (res.success) {
          const data = res.data
          if (data) {
            this.data = data.allMenu
            this.chooseNodes = data.roleMenu
            setTimeout(() => {
              this.$refs.tree.setCheckedNodes(data.roleMenu)
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
      console.log(this.$refs.tree.getCheckedKeys())
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([3])
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    onSubmit() {
      const newMenuIds = []
      const menuIds = this.$refs.tree.getCheckedKeys()
      // 获取新增的菜单
      if (this.chooseNodes && this.chooseNodes.length) {
        menuIds.forEach(menuId => {
          if (!this.chooseNodes.some(n => menuId === n.id)) {
            newMenuIds.push(menuId)
          }
        })
      }
      // 更新菜单

      console.log('newMenuIds: ', newMenuIds)
      updateRoleMenu({ newMenuIds: newMenuIds, roleId: this.getRoleId }).then(res => {
        if (res.success) {

        }
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
