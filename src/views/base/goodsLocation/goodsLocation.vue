<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.allocationName"
        placeholder="输入名称搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-select v-model="listQuery.storageId" placeholder="选择货架" clearable class="filter-item" style="width: 130px;margin-left: 15px">
        <el-option v-for="item in materialOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.allocationUse" placeholder="是否有库存" clearable class="filter-item" style="width: 130px;margin-left: 15px">
        <el-option key="0" label="是" value="0" />
        <el-option key="1" label="否" value="1" />
      </el-select>
      <el-select v-model="listQuery.allocationState" placeholder="状态" clearable class="filter-item" style="width: 130px;margin-left: 15px">
        <el-option v-for="item in calendarStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>

      <el-button v-waves class="filter-item" type="success" icon="el-icon-search" @click="handleFilter" style="margin-left: 15px">
        搜索
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
          <span>{{ row.allocationId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编码"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.allocationNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.allocationName }}</span>
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
          <span>{{ row.warehouseElse }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.allocationState==0?"禁用":"已激活" }}</span>
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
        <el-form-item label="仓库" prop="warehouseName">
          <el-input v-model="temp.storageId" disabled/>
        </el-form-item>
        <el-form-item label="仓库区域" prop="warehouseName">
          <el-input v-model="temp.areaId" disabled/>
        </el-form-item>
        <el-form-item label="货架" prop="warehouseName">
          <el-input v-model="temp.allocationName" disabled/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="temp.allocationState" label="1">激活</el-radio>
          <el-radio v-model="temp.allocationState"  label="0">禁用</el-radio>
        </el-form-item>
        <el-form-item label="货位号" prop="warehouseName">
          <el-input v-model="temp.allocationNum" disabled/>
        </el-form-item>
        <el-form-item label="排序号" prop="warehouseCoding">
          <el-input v-model="temp.warehouseCoding" />
        </el-form-item>
        <el-form-item label="备注" prop="warehousePlace">
          <el-input v-model="temp.warehousePlace" style="width:440px"/>
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
import Pagination from '@/components/Pagination/index' // secondary package based on el-pagination

const calendarStatusOptions = [
  { key: '1', display_name: '激活' },
  { key: '0', display_name: '禁用' }
]

const materialOptions = [
  // { key: '0', display_name: '物资类型1' },
  // { key: '1', display_name: '物资类型2' },
  // { key: '2', display_name: '物资类型3' }
]


// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'materialManagement',
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
        allocationName: '',
        storageId: '',
        allocationUse: '',
        allocationState: ''
      },
      importanceOptions: [1, 2, 3],
      calendarStatusOptions,
      materialOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published',
        allocationState:''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
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
    this.materialOptions = []
    this.selectType()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$store.dispatch('goodsLocation/getList', this.listQuery).then((result) => {
        this.list = result.货位.list
        this.total = result.货位.total
        this.listLoading = false
        console.log(result.货位)
      })
    },
    selectType() {
      this.listLoading = true
      this.$store.dispatch('shelfManagement/getList', this.listQuery).then((result) => {
        var type = result.仓库货架.list
        for (let i = 0; i < type.length; i++) {
          this.materialOptions.push({ key: type[i].storageId, display_name: type[i].storageName })
        }
        this.listLoading = false
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
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: '',
        allocationState:''
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
          this.$store.dispatch('goodsLocation/add', this.temp).then((result) => {
            this.dialogFormVisible = false
            this.handleFilter()
            this.listLoading = false
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.$store.dispatch('goodsLocation/queryById', {"id":this.temp.allocationId}).then((result) => {
        this.temp = result.data
        this.temp.allocationState = this.temp.allocationState.toString()
        this.temp.updateBy = JSON.parse( localStorage.getItem("user")).userId
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('goodsLocation/update', this.temp).then((result) => {
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
