<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="110px">
    <el-form-item label="父目录">
      <el-input v-model="node.label" disabled/>
    </el-form-item>
    <el-form-item label="菜单名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入菜单名称" />
    </el-form-item>
    <el-form-item label="菜单组件名称" prop="componentName">
      <el-input v-model="form.componentName" placeholder="请输入菜单组件" />
    </el-form-item>
    <el-form-item label="菜单组件路径">
      <el-input v-model="form.component" placeholder="请输入菜单组件" />
    </el-form-item>
    <el-form-item label="菜单路径" prop="path">
      <el-input v-model="form.path" placeholder="请输入菜单路径" />
    </el-form-item>
    <el-form-item label="访问权限"  prop="url">
      <el-input v-model="form.url" placeholder="请输入访问权限" />
    </el-form-item>
    <el-form-item label="菜单图标">
      <el-input v-model="form.icon" placeholder="请输入菜单图标" />
    </el-form-item>
    <el-form-item label="是否隐藏">
      <el-switch v-model="form.hidden" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">{{hasClear ? '保存' : '更新'}}</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getMenuById, saveMenu, updateMenu, deleteMenu } from '@/api/menu'
export default {
  name: 'MenuForm',
  props: {
    node: {
      type: Object
    },
    // 是否清空表单
    hasClear: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',
        path: '',
        url: '',
        icon: '',
        componentName: '',
        component: '',
        hidden: false
      },
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { max: 50, message: '长度最大 50 个字符', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' },
          { max: 100, message: '长度最大 100 个字符', trigger: 'blur' }
        ],
        componentName: [
          { required: true, message: '请输入组件名称', trigger: 'blur' },
          { max: 50, message: '长度最大 50 个字符', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请输入组件路径', trigger: 'blur' },
          { max: 50, message: '长度最大 50 个字符', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入访问权限', trigger: 'blur' },
          { max: 100, message: '长度最大 100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getMenu(id) {
      getMenuById({ menuId: id }).then(res => {
        if (res.success) {
          const data = res.data
          this.form.name = data.name
          this.form.path = data.path
          this.form.componentName = data.enname
          this.form.component = data.component
          this.form.url = data.url
          this.form.icon = data.icon
          this.form.hidden = data.available === 0
        }
      })
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const form = this.form
          const param = {
            id: this.node.id,
            parentId: null,
            name: form.name,
            enname: form.componentName,
            path: form.path,
            url: form.url,
            icon: form.icon,
            component: form.component,
            available: form.hidden ? 0 : 1
          }
          console.log('param: ', param)
          if (this.hasClear) {
            param.parentId = this.node.id ? this.node.id : 0
            this.save(param)
          } else {
            this.update(param)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    reset() {
      this.$emit('reset')
      this.resetForm()
    },
    save(param) {
      saveMenu(param).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          // 清空表单
          this.resetForm()
          // 刷新菜单栏
          this.refreshMenu()
        } else {
          this.$message.success(res.msg)
        }
      })
    },
    update(param) {
      updateMenu(param).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          // 刷新菜单栏
          this.refreshMenu()
        } else {
          this.$message.success(res.msg)
        }
      })
    },
    delete(ids) {
      this.$confirm('确定删除菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu({ menuIds: ids }).then(res => {
          if (res.success) {
            this.$message.success(res.msg)
            // 刷新菜单栏
            this.refreshMenu()
          } else {
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {
      })

    },
    // 清空表单
    resetForm() {
      this.form.name = ''
      this.form.path = ''
      this.form.url = ''
      this.form.icon = ''
      this.form.componentName = ''
      this.form.component = ''
      this.form.hidden = false
    },
    refreshMenu() {
      this.$emit('refreshMenu')
    }
  }
}
</script>

<style scoped>

</style>
