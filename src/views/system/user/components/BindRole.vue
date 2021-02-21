<template>
  <el-dialog
    title="绑定角色"
    :visible.sync="bindParam.visible"
    width="30%"
    :before-close="close"
    @open="beforeOpen"
  >

    <el-checkbox-group v-model="checkedCities">
      <el-checkbox v-for="city in cities" :key="city" :label="city">{{ city }}</el-checkbox>
    </el-checkbox-group>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUserRoleById } from '@/api/user'
export default {
  name: 'BindRole',
  props: {
    bindParam: {
      type: Object
    }
  },
  data() {
    return {
      checkedCities: [],
      cities: []
    }
  },
  methods: {
    beforeOpen() {
      this.getRoles()
    },
    getRoles() {
      getUserRoleById({ userId: this.bindParam.userId }).then(res => {
        if (res.success) {
          const data = res.data
          if (data) {
            const cities = data.allRoles.map(r => r.name)
            this.cities = cities && cities.length ? cities : []
            const checkedCities = data.userRoles.map(r => r.name)
            this.checkedCities = checkedCities && checkedCities.length ? checkedCities : []
          }
        }
      })
    },
    close() {
      this.bindParam.visible = false
    },
    save() {}
  }
}
</script>

<style scoped>
  /*.dialog-footer {*/
    /*text-align: center;*/
    /*display: block;*/
  /*}*/
</style>
