<template>
  <div class="dashboard-container">
    <el-tabs type="border-card">
      <el-row class="dashboard-row">
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-plus" @click="handleAddProject">新建项目</el-button>
        </el-col>
        <el-col :span="8" :offset="12">
          <el-input v-model="listQuery.searchCondition" placeholder="搜索项目名称、项目上级、项目经理、客户名称" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" />
          </el-input>
        </el-col>
      </el-row>
      <el-tab-pane label="全部项目" @click="getList('all')">
        <el-table :data="allProject" border style="width: 100%" @row-click="handleClickProject">
          <el-table-column prop="name" label="项目名称" width="180" />
          <el-table-column prop="status" label="项目状态" width="120" />
          <el-table-column prop="manager" label="项目上级" width="120" />
          <el-table-column prop="manager" label="项目经理" width="120" />
          <el-table-column prop="startTime" label="计划开始时间" width="180" />
          <el-table-column prop="endTime" label="计划结束时间" width="180" />
          <el-table-column prop="completeness" label="客户名称" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="未开始" @click="getList('unStart')">
        <el-table :data="startProject" border style="width: 100%">
          <el-table-column prop="name" label="项目名称" width="180" />
          <el-table-column prop="status" label="项目状态" width="120" />
          <el-table-column prop="manager" label="项目上级" width="120" />
          <el-table-column prop="manager" label="项目经理" width="120" />
          <el-table-column prop="startTime" label="计划开始时间" width="180" />
          <el-table-column prop="endTime" label="计划结束时间" width="180" />
          <el-table-column prop="completeness" label="客户名称" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="进行中" @click="getList('underway')">
        <el-table :data="underwayProject" border style="width: 100%">
          <el-table-column prop="name" label="项目名称" width="180" />
          <el-table-column prop="status" label="项目状态" width="120" />
          <el-table-column prop="manager" label="项目上级" width="120" />
          <el-table-column prop="manager" label="项目经理" width="120" />
          <el-table-column prop="startTime" label="计划开始时间" width="180" />
          <el-table-column prop="endTime" label="计划结束时间" width="180" />
          <el-table-column prop="completeness" label="客户名称" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已完成" @click="getList('finished')">
        <el-table :data="finishedProject" border style="width: 100%">
          <el-table-column prop="name" label="项目名称" width="180" />
          <el-table-column prop="status" label="项目状态" width="120" />
          <el-table-column prop="manager" label="项目上级" width="120" />
          <el-table-column prop="manager" label="项目经理" width="120" />
          <el-table-column prop="startTime" label="计划开始时间" width="180" />
          <el-table-column prop="endTime" label="计划结束时间" width="180" />
          <el-table-column prop="completeness" label="客户名称" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Project',
  data() {
    return {
      listQuery: {
        page: 1,
        size: 10,
        searchCondition: ""
      },
      allProject: [
        {
          name: 'AchieveIt',
          status: '进行中',
          manager: '小六',
          startTime: '2020-10-10',
          endTime: '2020-10-10',
          completeness: '5%'
        },
        {
          name: 'Myproject',
          status: '未开始',
          manager: '小六',
          startTime: '2020-10-10',
          endTime: '2020-10-10',
          completeness: '0%'
        },
        {
          name: 'test',
          status: '已完成',
          manager: '小六',
          startTime: '2020-10-10',
          endTime: '2020-10-10',
          completeness: '100%'
        }
      ],
      underwayProject: [
        {
          name: 'AchieveIt',
          status: '进行中',
          manager: '小六',
          startTime: '2020-10-10',
          endTime: '2020-10-10',
          completeness: '5%'
        }
      ],
      startProject: [
        {
          name: 'Myproject',
          status: '未开始',
          manager: '小六',
          startTime: '2020-10-10',
          endTime: '2020-10-10',
          completeness: '0%'
        }
      ],
      finishedProject: [
        {
          name: 'test',
          status: '已完成',
          manager: '小六',
          startTime: '2020-10-10',
          endTime: '2020-10-10',
          completeness: '100%'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    handleAddProject() {
      this.$router.push('/project/addProject')
    }
  }
}
</script>

<style lang="scss">
.dashboard {
  &-row {
    margin-bottom: 10px;
  }
}
</style>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
}
</style>
