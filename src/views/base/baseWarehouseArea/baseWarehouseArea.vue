<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.areaName"
        placeholder="输入区域名称搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-select v-model="listQuery.areaState" placeholder="状态" clearable class="filter-item" style="width: 130px;margin-left: 15px">
        <el-option v-for="item in calendarStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.warehouseName" placeholder="选择仓库" clearable class="filter-item" style="width: 130px;margin-left: 15px">
        <el-option v-for="item in selectOptions" :key="item.key" :label="item.display_name" :value="item.display_name" />
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
          <span>{{ row.areaId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库名称"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.warehouseName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库编码"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.warehouseCoding}}</span>
        </template>
      </el-table-column>
      <el-table-column label="区域编码"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.areaCoding}}</span>
        </template>
      </el-table-column>
      <el-table-column label="区域名称"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.areaName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.areaElse}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否已使用" align="center">
        <template slot-scope="{row}">
          <span>{{ row.areaUse}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.areaState==0?"禁用":"已激活"}}</span>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" >
      <el-form  ref="dataForm" :rules="rules" :model="temp" :inline="true"  label-position="right" label-width="80px" >
        <el-form-item label="仓库" prop="type" >
          <el-select v-model="temp.warehouseId" class="filter-item" placeholder="选择仓库" style="width:185px">
            <el-option v-for="item in selectOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" >
          <el-radio v-model="temp.areaState" label="1">激活</el-radio>
          <el-radio v-model="temp.areaState" label="0">禁用</el-radio>
        </el-form-item>
        <el-form-item label="名称" prop="timestamp" style="width:100%">
          <el-input v-model="temp.areaName" />
        </el-form-item>
        <el-form-item label="编码" prop="title" style="width:100%">
          <el-input v-model="temp.areaCoding" />
        </el-form-item>
        <el-form-item label="备注" style="width:100%">
          <el-input v-model="temp.areaElse" />
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
const selectOptions = [
  // { key: '0', display_name: '仓库1' },
  // { key: '1', display_name: '仓库2' },
  // { key: '2', display_name: '仓库3' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'baseWarehouseArea',
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
        areaName: '',
        warehouseName: '',
        areaState: ''
      },
      importanceOptions: [1, 2, 3],
      calendarStatusOptions: calendarStatusOptions,
      selectOptions: selectOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        areaCoding: '',
        areaDelete: 0,
        areaElse: '',
        areaId: 0,
        areaName: '',
        areaState: 0,
        areaUse: 0,
        createBy: JSON.parse( localStorage.getItem("user")).userId,
        createTime: '',
        updateBy: JSON.parse( localStorage.getItem("user")).userId,
        updateTime: '',
        warehouseId: '',
        warehouseState: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: '新增-仓库区域信息'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.selectOptions = []
    this.selectWareHouse()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$store.dispatch('baseWarehouseArea/getList', this.listQuery).then((result) => {
        this.list = result.仓库区域.list
        this.total = result.仓库区域.total
        this.listLoading = false
        console.log(result.仓库区域)
      })
    },
    selectWareHouse() {
      this.$store.dispatch('baseWarehouse/getList', this.listQuery).then((result) => {
        // eslint-disable-next-line no-unused-vars
        var warehouse = result.仓库.list
        for (let i = 0; i < warehouse.length; i++) {
          this.selectOptions.push({ key: warehouse[i].warehouseId, display_name: warehouse[i].warehouseName })
        }
        this.listLoading = false
        console.log(result.仓库)
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
        areaCoding: '',
        areaDelete: 0,
        areaElse: '',
        areaId: 0,
        areaName: '',
        areaState: 0,
        areaUse: 0,
        createBy: JSON.parse( localStorage.getItem("user")).userId,
        createTime: '',
        updateBy: JSON.parse( localStorage.getItem("user")).userId,
        updateTime: '',
        warehouseId: '',
        warehouseState: 1
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
          this.$store.dispatch('baseWarehouseArea/add', this.temp).then((result) => {
            this.dialogFormVisible = false
            this.handleFilter()
            this.listLoading = false
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.areaState = this.temp.areaState.toString()
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
          this.$store.dispatch('baseWarehouseArea/update', this.temp).then((result) => {
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
