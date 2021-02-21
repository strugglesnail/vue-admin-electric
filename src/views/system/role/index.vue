<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-form :inline="true" :model="searchData" class="demo-form-inline">
          <el-form-item label="角色名称">
            <el-input v-model="searchData.name" placeholder="角色名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="add">新增</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="ID" width="95">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="角色名称" align="center" width="110">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="角色英文名称" width="110" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.enname }}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色描述" width="150" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" width="200" :formatter="formatter" />
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="update(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="bindMenu(scope.row)">授权</el-button>
              <el-button type="text" size="small" @click="lookup(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination
          background
          :current-page="page.pageNo"
          :page-size="page.pageSize"
          :page-sizes="page.sizes"
          prev-text="上一页"
          next-text="下一页"
          style="text-align: right;"
          layout="total, prev, pager, next, jumper"
          :total="page.total"
        />
      </el-footer>
    </el-container>
    <add-role :role-param="roleParam" @refreshTable="refreshTable"/>
    <bind-menu :bind-param="bindParam" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getRolePage, deleteRole } from '@/api/role'
import AddRole from './components/AddRole'
import BindMenu from './components/BindMenu'
export default {
  name: 'Role',
  components: { AddRole, BindMenu },
  data() {
    return {
      searchData: {
        name: ''
      },
      list: null,
      listLoading: true,
      page: {
        pageNo: 1,
        pageSize: 10,
        sizes: [10, 20, 50, 100],
        total: 0
      },
      // 新增角色组件
      roleParam: {
        roleId: null,
        visible: false,
        isView: false
      },
      // 绑定菜单组件
      bindParam: {
        roleId: null,
        visible: false
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取分页角色
    fetchData() {
      this.listLoading = true
      const param = {
        name: this.searchData.name,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      }
      getRolePage(param).then(res => {
        if (res.success) {
          const data = res.data
          if (data) {
            this.list = data
            this.page.total = res.count
          }
        }
        this.listLoading = false
      })
    },

    // 搜索角色
    search() {
      this.page.pageNo = 1
      this.fetchData()
    },

    // 新增角色
    add() {
      this.setRoleParam(null, true, false)
    },

    // 更新角色
    update(row) {
      this.setRoleParam(row.id, true, false)
    },

    // 查看角色
    lookup(row) {
      this.setRoleParam(row.id, true, true)
    },

    // 绑定菜单
    bindMenu(row) {
      this.bindParam.roleId = row.id
      this.bindParam.visible = true
    },

    setRoleParam(roleId, visible, isView) {
      this.roleParam.roleId = roleId
      this.roleParam.visible = visible
      this.roleParam.isView = isView
    },

    // 删除角色
    delete(id) {
      this.$confirm('确定删除角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole({ roleId: id }).then(res => {
          if (res.success) {
            this.$message.success(res.msg)
            // 刷新表格
            this.search()
          } else {
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {})
    },

    // 时间格式转换
    formatter(row, column, value) {
      if (!value || value.length === 0) {
        return ''
      }
      if (['createTime'].includes(column.property)) {
        return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
      }
      return value
    },
    // 刷新表格
    refreshTable() {
      this.search()
    }
  }
}
</script>

<style scoped>

</style>
