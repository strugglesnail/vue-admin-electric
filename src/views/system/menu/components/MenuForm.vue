<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="80px">
    <el-form-item label="父目录">
      <el-input v-model="node.label" disabled/>
    </el-form-item>
    <el-form-item label="菜单名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入菜单名称" />
    </el-form-item>
    <el-form-item label="菜单组件"  prop="component">
      <el-input v-model="form.component" placeholder="请输入菜单组件" />
    </el-form-item>
    <el-form-item label="菜单路径"  prop="path">
      <el-input v-model="form.path" placeholder="请输入菜单路径" />
    </el-form-item>
    <el-form-item label="访问权限"  prop="url">
      <el-input v-model="form.url" placeholder="请输入访问权限" />
    </el-form-item>
    <el-form-item label="是否隐藏">
      <el-switch v-model="form.hidden" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">{{hasClear ? '保存' : '更新'}}</el-button>
      <el-button>重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getMenuById } from '@/api/menu'
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
  watch: {
    'node.id'(id) {
      console.log(id)
      if (id) {
        if (this.hasClear) {
          // 清空表单（添加操作）
          this.resetForm()
        } else {
          // 更新操作
          this.getMenu(id)
        }
      }
    }

  },
  // mounted() {
  //   if (this.hasClear) {
  //     // 清空表单
  //     this.resetForm()
  //   }
  // },
  data() {
    return {
      form: {
        name: '',
        path: '',
        url: '',
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
        component: [
          { required: true, message: '请输入组件名称', trigger: 'blur' },
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
          this.form.component = data.component
          this.form.url = data.url
          this.form.hidden = data.available === 1
        }
      })
    },
    onSubmit() {
      console.log('submit!')
    },
    // 清空表单
    resetForm() {
      this.form.name = ''
      this.form.path = ''
      this.form.url = ''
      this.form.component = ''
      this.form.hidden = false
    }
  }
}
</script>

<style scoped>

</style>
