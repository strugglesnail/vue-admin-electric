<template>
  <el-dialog
    title="角色授权"
    :visible.sync="bindParam.visible"
    width="30%"
    @open="beforeOpen"
    :before-close="close">
    <el-tree
      :data="data"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      highlight-current
      @check-change="chooseNode"
      :props="defaultProps">
    </el-tree>

    <!--<div class="buttons">-->
      <!--<el-button @click="getCheckedNodes">通过 node 获取</el-button>-->
      <!--<el-button @click="getCheckedKeys">通过 key 获取</el-button>-->
      <!--<el-button @click="setCheckedNodes">通过 node 设置</el-button>-->
      <!--<el-button @click="setCheckedKeys">通过 key 设置</el-button>-->
      <!--<el-button @click="resetChecked">清空</el-button>-->
    <!--</div>-->
  <span slot="footer" class="dialog-footer" v-if="!bindParam.isView">
    <el-button @click="close">取 消</el-button>
    <el-button type="primary" @click="onSubmit">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import { getMenuByRoleId } from '@/api/role'
export default {
  name: 'BindMenu',
  props: {
    bindParam: {
      type: Object
    }
  },
  computed: {
    getRoleId() {
      return this.bindParam.roleId
    }
  },
  data() {
    return {
      data: [{
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
      defaultProps: {
        children: 'children',
        label: 'label'
      }
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
            setTimeout(() => {
              this.$refs.tree.setCheckedNodes(data.roleMenu)
            }, 10)
          }
        }
      })
    },
    // 选中节点
    chooseNode(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
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
    onSubmit() {},
    close() {
      this.bindParam.visible = false
    }
  }
}
</script>

<style scoped>

</style>
