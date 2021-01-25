<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="输入编号或名称搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-select v-model="listQuery.allocationId" placeholder="选择货架" clearable class="filter-item" style="width: 130px;margin-left: 15px">
        <el-option v-for="item in goodsLocationOptions" :key="item.key" :label="item.display_name" :value="item.key" />
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
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编码"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓管员"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="适用于角色" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人名称"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="仓库" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
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
  { key: '1', display_name: '激活' },
  { key: '0', display_name: '禁用' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'goodsBrowse',
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
        wzName: '',
        typeId: ''
      },
      importanceOptions: [1, 2, 3],
      calendarStatusOptions,
      goodsLocationOptions: [],
      selectTypeOptions: [],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        createBy: JSON.parse( localStorage.getItem("user")).userId,
        createTime: '',
        expirationDate: 0,
        price: '',
        typeId: '',
        updateBy: JSON.parse( localStorage.getItem("user")).userId,
        updateTime: '',
        wzBar: '',
        wzBelow: 0,
        wzCoding: '',
        wzDelete: 0,
        wzElse: '',
        wzId: 0,
        wzName: '',
        wzOn: 0,
        wzState: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: '新增-物资信息'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      treeData: [],
      isClearable: true,
      valueId: null,
      props: {
        value: 'typeId',
        label: 'typeName',
        children: 'wzTypeList'
      },
    }
  },
  created() {
    this.goodsLocationOptions = []
    this.selectGoodsLocation()
    // this.getList()
  },
  methods: {
    getList() {


    },
    selectGoodsLocation() {
      this.listLoading = true
      this.$store.dispatch('shelfManagement/getList', this.listQuery).then((result) => {
        var select = result.仓库货架.list
        this.listQuery.allocationId = select[0].storageId
        this.$store.dispatch('goodsBrowse/selectOne', this.listQuery).then((result) => {
          this.list = result.物资供应商.list
          this.total = result.物资供应商.total
          this.listLoading = false
        })
        for (let i = 0; i < select.length; i++) {
          this.goodsLocationOptions.push({ key: select[i].storageId, display_name: select[i].storageName+"("+select[i].storageCoding+")" })
        }
        this.listLoading = false
      })
    },
    selectType() {
      this.$store.dispatch('typeManagement/getList', this.listQuery).then((result) => {
        // eslint-disable-next-line no-unused-vars
        var warehouse = result.data //wzTypeList
        // for (let i = 0; i < warehouse.length; i++) {
        //   this.selectTypeOptions.push({ key: warehouse[i].typeId, display_name: warehouse[i].typeName })
        // }
        this.treeData = warehouse
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
        createBy: JSON.parse( localStorage.getItem("user")).userId,
        createTime: '',
        expirationDate: 0,
        price: '',
        typeId: '',
        updateBy: JSON.parse( localStorage.getItem("user")).userId,
        updateTime: '',
        wzBar: '',
        wzBelow: 0,
        wzCoding: '',
        wzDelete: 0,
        wzElse: '',
        wzId: 0,
        wzName: '',
        wzOn: 0,
        wzState: 0
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
          this.$store.dispatch('goodsManagement/add', this.temp).then((result) => {
            this.dialogFormVisible = false
            this.handleFilter()
            this.listLoading = false
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.wzState = this.temp.wzState.toString()
      this.temp.updateBy = JSON.parse( localStorage.getItem("user")).userId
      this.valueId = this.temp.typeId
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('goodsManagement/update', this.temp).then((result) => {
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
