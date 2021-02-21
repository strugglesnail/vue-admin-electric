<template>
  <el-dialog
    :title="getTitle"
    :visible.sync="roleParam.visible"
    width="30%"
    @open="beforeOpen"
    :before-close="close">
  <el-form ref="form" :rules="rules" :model="form" label-width="110px">
    <el-form-item label="角色名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入角色名称" />
    </el-form-item>
    <el-form-item label="角色英文名称" prop="enname">
      <el-input v-model="form.enname" placeholder="请输入角色英文名称" />
    </el-form-item>
    <el-form-item label="角色描述">
      <el-input v-model="form.description" placeholder="请输入角色描述" />
    </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer" v-if="!roleParam.isView">
    <el-button @click="close">取 消</el-button>
    <el-button type="primary" @click="onSubmit">确 定</el-button>
  </span>
  </el-dialog>
</template>
<script>
import { getRoleById, saveRole, updateRole, deleteRole } from '@/api/role'
export default {
  name: 'AddRole',
  props: {
    roleParam: {
      type: Object
    }
  },
  computed: {
    getRoleId() {
      return this.roleParam.roleId
    },
    getTitle() {
      const p = this.roleParam
      if (!p.roleId && !p.isView) {
        return '新增'
      } else if (p.roleId && !p.isView) {
        return '更新'
      } else {
        return '查看'
      }
    }
  },
  data() {
    return {
      form: {
        name: '',
        enname: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { max: 50, message: '长度最大 50 个字符', trigger: 'blur' }
        ],
        enname: [
          { required: true, message: '请输入角色英文名称', trigger: 'blur' },
          { max: 100, message: '长度最大 100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    beforeOpen() {
      // 更新或查看
      if (this.getRoleId) {
        this.getRole(this.getRoleId)
      } else {
        this.resetForm()
      }
    },

    getRole(id) {
      getRoleById({ roleId: id }).then(res => {
        if (res.success) {
          const data = res.data
          this.form.name = data.name
          this.form.enname = data.enname
          this.form.description = data.description
        }
      })
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const form = this.form
          const param = {
            id: this.getRoleId,
            name: form.name,
            enname: form.enname,
            description: form.description
          }
          if (!this.getRoleId) {
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
      saveRole(param).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          // 清空表单
          this.resetForm()
          // 关闭弹窗
          this.close()
          // 刷新角色栏
          this.refreshTable()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {})
    },
    update(param) {
      updateRole(param).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          // 关闭弹窗
          this.close()
          // 刷新角色栏
          this.refreshTable()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {})
    },
    delete(id) {
      this.$confirm('确定删除角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole({ roleId: id }).then(res => {
          if (res.success) {
            this.$message.success(res.msg)
            // 刷新角色栏
            this.refreshTable()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {})
    },
    // 清空表单
    resetForm() {
      Object.keys(this.form).forEach(key => {
        this.form[key] = ''
      })
    },
    refreshTable() {
      this.$emit('refreshTable')
    },
    close() {
      this.roleParam.visible = false
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
