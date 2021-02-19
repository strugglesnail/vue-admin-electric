<template>
  <el-dialog
    title="提示"
    :visible.sync="compParam.visible"
    width="30%"
    center>
    <el-form ref="form" :rules="rules" :model="form" label-width="110px">
    <el-form-item label="用户名称" prop="username">
      <el-input v-model="form.username" placeholder="请输入用户名称" />
    </el-form-item>
    <el-form-item label="用户账号" prop="account">
      <el-input v-model="form.account" placeholder="请输入用户账号" />
    </el-form-item>
    <el-form-item label="用户密码" prop="password">
      <el-input v-model="form.password" placeholder="请输入用户密码" />
    </el-form-item>
    <el-form-item label="上传头像">
      <el-input v-model="form.avatar" placeholder="请上传头像" />
    </el-form-item>
  </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="compParam.visible = false">取 消</el-button>
    <el-button type="primary" @click="compParam.visible = false">确 定</el-button>
  </span>
  </el-dialog>
</template>
<script>
import { getUserById, saveUser, updateUser, deleteUser } from '@/api/user'
export default {
  name: 'AddUser',
  props: {
    compParam: {
      type: Object
    }
  },
  data() {
    return {
      form: {
        username: '',
        account: '',
        password: '',
        avatar: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { max: 50, message: '长度最大 50 个字符', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { max: 100, message: '长度最大 100 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 8, message: '长度最小 6 最大 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getUser(id) {
      getUserById({ userId: id }).then(res => {
        if (res.success) {
          const data = res.data
          this.form.username = data.username
          this.form.account = data.account
          this.form.password = data.password
          this.form.avatar = data.avatar
        }
      })
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const form = this.form
          const param = {
            id: this.node.id,
            username: form.username,
            account: form.account,
            password: form.password,
            avatar: form.avatar
          }
          if (this.compParam.userId) {
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
      saveUser(param).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          // 清空表单
          this.resetForm()
          // 刷新表格
          this.refreshTable()
        } else {
          this.$message.success(res.msg)
        }
      })
    },
    update(param) {
      updateUser(param).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          // 刷新表格
          this.refreshTable()
        } else {
          this.$message.success(res.msg)
        }
      })
    },

    // 清空表单
    resetForm() {
      Object.keys(this.form).forEach(key => {
        this.form[key] = ''
      })
    },
    refreshTable() {
      this.$emit('refreshTable')
    }
  }
}
</script>

<style scoped>

</style>
