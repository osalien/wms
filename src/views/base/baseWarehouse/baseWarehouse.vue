<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.warehouseName"
        placeholder="输入名称搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-select v-model="listQuery.warehouseState" placeholder="状态" clearable class="filter-item" style="width: 130px;margin-left: 15px">
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
          <span>{{ row.warehouseId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编码"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.warehouseCoding}}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.warehouseName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.warehousePlace }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓管员"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.usePhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="适用于角色" align="center">
        <template slot-scope="{row}">
          <span>{{ row.applyRoles }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.warehouseElse}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.warehouseState==0?"禁用":"已激活" }}</span>
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

    <pagination layout="total,prev, pager, next,sizes" v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="650px">
      <el-form  ref="dataForm" :rules="rules" :model="temp" :inline="true"  label-position="right" label-width="100px" >
        <el-form-item label="名称" prop="warehouseName">
          <el-input v-model="temp.warehouseName" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="temp.warehouseState" label="1">激活</el-radio>
          <el-radio v-model="temp.warehouseState"  label="0">禁用</el-radio>
        </el-form-item>
        <el-form-item label="编码" prop="warehouseCoding">
          <el-input v-model="temp.warehouseCoding" />
        </el-form-item>
        <el-form-item label="地址" prop="warehousePlace">
          <el-input v-model="temp.warehousePlace" style="width:440px"/>
        </el-form-item>
        <el-form-item label="仓管员" prop="userName" >
          <el-input v-model="temp.userName" style="width:440px"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="usePhone">
          <el-input v-model="temp.usePhone" />
        </el-form-item>
        <el-form-item label="适用于角色" prop="applyRoles" >
          <el-select v-model="temp.applyRoles" class="filter-item" placeholder="请选择角色权限范围" style="width:185px">
            <el-option v-for="item in rolesSelectOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.warehouseElse" />
        </el-form-item>
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
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
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
  { key: '0', display_name: '禁用' },
  { key: '1', display_name: '激活' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'goodsManagement',
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
        pageSize: 10,
        warehouseName: '',
        warehouseState: ''
      },
      importanceOptions: [1, 2, 3],
      calendarStatusOptions,
      rolesSelectOptions: [],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        createBy: JSON.parse( localStorage.getItem("user")).userId,
        createTime: '',
        customRoles: '',
        updateBy: JSON.parse( localStorage.getItem("user")).userId,
        updateTime: '',
        usePhone: '',
        userName: '',
        warehouseCoding: '',
        warehouseDelete: 0,
        warehouseElse: '',
        warehouseId: 0,
        warehouseName: '',
        warehousePlace: '',
        warehouseState: '',
        warehouseUse: 0,
        applyRoles: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: '新增-仓库信息'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        warehouseName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        warehouseCoding: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        warehousePlace: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入仓管员', trigger: 'blur' }],
        usePhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        applyRoles: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.rolesSelectOption()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$store.dispatch('baseWarehouse/getList', this.listQuery).then((result) => {
        this.list = result.仓库.list
        this.total = result.仓库.total
        this.listLoading = false
        console.log(result.仓库)
      })
    },
    rolesSelectOption() {
      this.$store.dispatch('baseWarehouse/rolesSelect', this.listQuery).then((result) => {
        // eslint-disable-next-line no-unused-vars
        var applyRoles = result.data
        for (let i = 0; i < applyRoles.length; i++) {
          this.rolesSelectOptions.push({ key: applyRoles[i].roleId, display_name: applyRoles[i].name })
        }
      })
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
      this.temp = {
        createBy: JSON.parse( localStorage.getItem("user")).userId,
        createTime: '',
        customRoles: '',
        updateBy: JSON.parse( localStorage.getItem("user")).userId,
        updateTime: '',
        usePhone: '',
        userName: '',
        warehouseCoding: '',
        warehouseDelete: 0,
        warehouseElse: '',
        warehouseId: 0,
        warehouseName: '',
        warehousePlace: '',
        warehouseState: 0,
        warehouseUse: 0
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.$store.dispatch('baseWarehouse/add', this.temp).then((result) => {
            this.dialogFormVisible = false
            this.handleFilter()
            this.listLoading = false
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.warehouseState = this.temp.warehouseState.toString()
      this.temp.updateBy = JSON.parse( localStorage.getItem("user")).userId
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('baseWarehouse/update', this.temp).then((result) => {
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
