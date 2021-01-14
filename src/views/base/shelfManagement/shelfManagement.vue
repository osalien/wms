<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.storageName"
        placeholder="输入名称搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-select v-model="listQuery.storageState" placeholder="状态" clearable class="filter-item" style="width: 130px;margin-left: 15px">
        <el-option v-for="item in calendarStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.areaName" placeholder="选择仓库区域" clearable class="filter-item" style="width: 130px;margin-left: 15px">
        <el-option v-for="item in warehouseOptions" :key="item.key" :label="item.display_name" :value="item.display_name" />
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
      <el-table-column label="货架ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.storageId}}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库名称"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.warehouseName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库编号"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.warehouseId}}</span>
        </template>
      </el-table-column>
      <el-table-column label="区域名称"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.areaName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="区域编号"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.areaCoding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货架编号"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.storageCoding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货架名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.storageName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="型号"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.storageType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="尺寸"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.storageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大承载重量"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.storageWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="层数"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.storagePlies | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货位数/层"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.storageTrays | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否已使用"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.storageState}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后更新人"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateBy}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后更新日期"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="650px">
      <el-form  ref="dataForm" :rules="rules" :model="temp" :inline="true"  label-position="right" label-width="100px" >
        <el-form-item label="仓库" prop="type" style="width: 100%">
          <el-select v-model="temp.warehouseId" class="filter-item" placeholder="选择仓库" style="width:185px">
            <el-option v-for="item in selectOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库区域" prop="type" >
          <el-select v-model="temp.areaId" class="filter-item" placeholder="选择仓库区域" style="width:185px">
            <el-option v-for="item in warehouseOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" >
          <el-radio v-model="temp.storageState" label="1">激活</el-radio>
          <el-radio v-model="temp.storageState" label="2">禁用</el-radio>
        </el-form-item>
        <el-form-item label="名称" prop="timestamp">
          <el-input v-model="temp.storageName" />
        </el-form-item>
        <el-form-item label="编码" prop="title">
          <el-input v-model="temp.storageCoding" />
        </el-form-item>
        <el-form-item label="层数" prop="timestamp">
          <el-input v-model="temp.storagePlies" />
        </el-form-item>
        <el-form-item label="货位数/层" prop="title">
          <el-input v-model="temp.storageTrays" />
        </el-form-item>
        <el-form-item label="型号" prop="timestamp">
          <el-input v-model="temp.storageType" />
        </el-form-item>
        <el-form-item label="尺寸" prop="title">
          <el-input v-model="temp.storageSize" />
        </el-form-item>
        <el-form-item label="最大承载重量">
          <el-input v-model="temp.storageWeight" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.storageElse" />
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
  { key: '0', display_name: '未激活' },
  { key: '1', display_name: '已激活' }
]

const warehouseOptions = [

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
  name: 'shelfManagement',
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
        storageName: '',
        areaName: '',
        storageState: ''
      },
      importanceOptions: [1, 2, 3],
      calendarStatusOptions,
      selectOptions: selectOptions,
      warehouseOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        areaId: 0,
        createBy: '',
        createTime: '',
        storageCoding: '',
        storageDelete: 0,
        storageElse: '',
        storageId: 0,
        storageName: '',
        storagePlies: 0,
        storageSize: '',
        storageState: 0,
        storageTrays: 0,
        storageType: '',
        storageWeight: 0,
        updateBy: '',
        updateTime: '',
        warehouseId: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: '新增-货架信息'
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
    this.selectOptions = []
    this.warehouseOptions = []
    this.selectWareHouse()
    this.selectWareHouseArea()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$store.dispatch('shelfManagement/getList', this.listQuery).then((result) => {
        this.list = result.仓库货架.list
        this.listLoading = false
        console.log(result.仓库货架)
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
    selectWareHouseArea() {
      this.$store.dispatch('baseWarehouseArea/getList', this.listQuery).then((result) => {
        var select = result.仓库区域.list
        for (let i = 0; i < select.length; i++) {
          this.warehouseOptions.push({ key: select[i].areaId, display_name: select[i].areaName })
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
        areaId: 0,
        createBy: '',
        createTime: '',
        storageCoding: '',
        storageDelete: 0,
        storageElse: '',
        storageId: 0,
        storageName: '',
        storagePlies: 0,
        storageSize: '',
        storageState: 0,
        storageTrays: 0,
        storageType: '',
        storageWeight: 0,
        updateBy: '',
        updateTime: '',
        warehouseId: ''
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
          this.$store.dispatch('shelfManagement/add', this.temp).then((result) => {
            this.dialogFormVisible = false
            this.handleFilter()
            this.listLoading = false
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
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
