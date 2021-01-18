<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.ownerName"
        placeholder="输入名称搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-select v-model="listQuery.ownerState" placeholder="状态" clearable class="filter-item" style="width: 130px;margin-left: 15px">
        <el-option v-for="item in calendarStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="success" icon="el-icon-search" @click="handleFilter" style="margin-left: 15px">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="warning" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.ownerId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编码"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.ownerCoding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.ownerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.userPhone }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="备注"  align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.author }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="状态"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.ownerState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人名称"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.createBy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(row)"></el-button>
<!--          <el-button v-if="row.status!='deleted'" size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row,$index)"></el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination layout="total,prev, pager, next,sizes" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form  ref="dataForm" :rules="rules" :model="ckOwner" :inline="true"  label-position="right" label-width="80px" >
        <el-form-item label="名称" prop="ownerName">
          <el-input v-model="ckOwner.ownerName" />
        </el-form-item>
        <el-form-item label="编码" prop="ownerCoding">
          <el-input v-model="ckOwner.ownerCoding" />
        </el-form-item>
        <el-form-item label="状态" style="width: 100%" >
          <el-radio v-model="ckOwner.ownerState" label="1">已激活</el-radio>
          <el-radio v-model="ckOwner.ownerState" label="0">未激活</el-radio>
        </el-form-item>
        <el-form-item label="联系人">
          <el-select  v-model="ckOwner.userName" class="filter-item" placeholder="联系人搜索" style="width:185px"  prop="userName"   @change="handleChangePhone">
            <el-option v-for="item in selectOptions" :key="item.key" :label="item.display_name" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item  label="联系电话" >
          <el-input   v-model="ckOwner.userPhone"  :value="item"></el-input>
        </el-form-item>
<!--        <el-form-item label="备注">-->
<!--          <el-input/>-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible = false" >
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarStatusOptions = [
  { key: '0', display_name: '未激活' },
  { key: '1', display_name: '激活' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'baseShipper',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        ownerName: '',
        ownerState: '',
        // 后端没接收这个字段
        ownerCoding: ''
        // 后端没接收这个字段
      },
      importanceOptions: [1, 2, 3],
      calendarStatusOptions,
      selectOptions: [],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      ckOwner: {
        createBy: JSON.parse( localStorage.getItem("user")).userId,
        createTime: '',
        ownerCoding: '',
        ownerId: '',
        ownerName: '',
        ownerState: '',
        updateBy: JSON.parse( localStorage.getItem("user")).userId,
        updateTime: '',
        userId: '',
        ownerDelete: 0,
        userPhone: '',
        userName: ''
      },
      SysUser: {
        username: '',
        phone: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: '新增-货主信息'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        ownerName: [{ required: true, message: '请输入姓名', trigger: 'blur ' }],
        ownerCoding: [{ required: true, message: '请输入编码', trigger: 'blur ' }],
        userName: [{ required: true, message: '请选择联系人姓名', trigger: 'change ' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.selectUserName()
    this.selectUserPhone()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$store.dispatch('baseShipper/getList', this.listQuery).then((result) => {
        this.list = result.货主.list
        this.listLoading = false
        console.log(result.货主)
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.$store.dispatch('baseShipper/addckowners', this.ckOwner).then((result) => {
            this.dialogFormVisible = false
            this.handleFilter()
            this.listLoading = false
          })
        }
      })
    },
    selectUserName() {
      this.$store.dispatch('baseShipper/addUserName', this.listQuery).then((result) => {
        // eslint-disable-next-line no-unused-vars
        var userName = result.data
        for (let i = 0; i < userName.length; i++) {
          this.selectOptions.push({ key: userName[i].userId, display_name: userName[i].username, phone: userName[i].phone })
        }
      })
    },
    handleChangePhone(event, item) {
      this.ckOwner.userName = event.display_name
      this.ckOwner.userPhone = event.phone
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.ckOwner = {
        createBy: JSON.parse( localStorage.getItem("user")).userId,
        createTime: '',
        ownerCoding: '',
        ownerId: '',
        ownerName: '',
        ownerState: '',
        updateBy: JSON.parse( localStorage.getItem("user")).userId,
        updateTime: '',
        userId: '',
        ownerDelete: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.ckOwner = Object.assign({}, row) // copy obj
      this.ckOwner.ownerState = this.ckOwner.ownerState.toString()
      this.ckOwner.updateBy = JSON.parse( localStorage.getItem("user")).userId
      // this.ckOwner.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.ckOwner)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          this.listLoading = true
          this.$store.dispatch('baseShipper/update', this.ckOwner).then((result) => {
            this.dialogFormVisible = false
            this.handleFilter()
            this.listLoading = false
          })
        }
      })
    },
    // handleDelete(row, index) {
    //   this.$notify({
    //     title: 'Success',
    //     message: 'Delete Successfully',
    //     type: 'success',
    //     duration: 2000
    //   })
    //   this.list.splice(index, 1)
    // },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
