<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-form :inline="true" :model="searchData" class="demo-form-inline">
          <el-form-item label="用户名称">
            <el-input v-model="searchData.username" placeholder="用户名称" />
          </el-form-item>
          <el-form-item label="用户账号">
            <el-input v-model="searchData.account" placeholder="用户名称" />
          </el-form-item>
          <el-form-item label="用户状态">
            <el-select v-model="searchData.status" placeholder="用户状态">
              <el-option label="已删除" value="0" />
              <el-option label="正常" value="1" />
            </el-select>
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
          <el-table-column label="用户名称" align="center" width="110">
            <template slot-scope="scope">
              {{ scope.row.username }}
            </template>
          </el-table-column>
          <el-table-column label="账号" width="110" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.account }}</span>
            </template>
          </el-table-column>
          <el-table-column label="头像" width="80" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.avatar" width="100%" height="100%">
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="状态" width="110" align="center">
            <template slot-scope="scope">
              {{ scope.row.status | statusFilter }}
              <!--<el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" width="200" :formatter="formatter" />
          <el-table-column align="center" prop="lastLoginTime" label="最后一次登录时间" width="200" :formatter="formatter" />
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="update(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="bindRole(scope.row)">绑定角色</el-button>
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
    <add-user :comp-param="compParam" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserPage, deleteUser } from '@/api/user'
import AddUser from './components/AddUser'
export default {
  name: 'User',
  components: { AddUser },
  filters: {
    statusFilter(status) {
      const statusMap = {
        deleted: '已删除',
        published: '正常'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      searchData: {
        username: '',
        account: '',
        status: ''
      },
      list: null,
      listLoading: true,
      page: {
        pageNo: 1,
        pageSize: 10,
        sizes: [10, 20, 50, 100],
        total: 0
      },
      // 组件
      compParam: {
        userId: null,
        visible: false,
        isView: false
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取分页用户
    fetchData() {
      this.listLoading = true
      const param = {
        username: this.searchData.username,
        account: this.searchData.account,
        status: this.searchData.status,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      }
      getUserPage(param).then(res => {
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

    // 搜索用户
    search() {
      this.page.pageNo = 1
      this.fetchData()
    },

    // 新增用户
    add() {
      this.setCompParam(null, true, false)
    },

    // 更新用户
    update(row) {
      this.setCompParam(row.id, true, false)
    },

    // 绑定角色
    bindRole(row) {

    },

    // 查看用户
    lookup(row) {
      this.setCompParam(row.id, true, true)
    },

    setCompParam(userId, visible, isView) {
      this.compParam.userId = userId
      this.compParam.visible = visible
      this.compParam.isView = isView
    },

    // 删除用户
    delete(id) {
      this.$confirm('确定删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({ userId: id }).then(res => {
          if (res.success) {
            this.$message.success(res.msg)
            // 刷新菜单栏
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
      if (['createTime', 'lastLoginTime'].includes(column.property)) {
        return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
      }
      return value
    }
  }
}
</script>

<style scoped>

</style>
