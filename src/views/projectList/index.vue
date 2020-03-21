<template>
  <div class="dashboard-container">
    <el-tabs v-model="currentTabName" type="border-card" @tab-click="handleTabsClick">
      <el-row class="dashboard-row">
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-plus" @click="handleAddProject">新建项目</el-button>
        </el-col>
        <el-col :span="8" :offset="12">
          <el-input v-model="listQuery.searchCondition" placeholder="搜索项目名称、项目上级、项目经理、客户名称" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchProject"/>
          </el-input>
        </el-col>
      </el-row>
      <el-tab-pane label="全部项目" name="全部项目">
        <el-table :data="allProject" border style="width: 100%" @row-click="handleClickProject">
          <el-table-column prop="projectName" label="项目名称" width="180" />
          <el-table-column prop="projectStatus" label="项目状态" width="120" />
<!--          <el-table-column prop="projectManagerName" label="项目上级" width="120" />-->
          <el-table-column prop="projectManagerName" label="项目经理" width="120" />
          <el-table-column prop="projectStartDate" label="计划开始时间" width="180" />
          <el-table-column prop="projectEndDate" label="计划结束时间" width="180" />
          <el-table-column prop="projectClientContactName" label="客户名称" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="未开始" name="未开始">
        <el-table :data="startProject" border style="width: 100%" @row-click="handleClickProject">
          <el-table-column prop="projectName" label="项目名称" width="180" />
          <el-table-column prop="projectStatus" label="项目状态" width="120" />
<!--          <el-table-column prop="projectManagerName" label="项目上级" width="120" />-->
          <el-table-column prop="projectManagerName" label="项目经理" width="120" />
          <el-table-column prop="projectStartDate" label="计划开始时间" width="180" />
          <el-table-column prop="projectEndDate" label="计划结束时间" width="180" />
          <el-table-column prop="projectClientContactName" label="客户名称" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="进行中" name="进行中" @row-click="handleClickProject">
        <el-table :data="underwayProject" border style="width: 100%">
          <el-table-column prop="projectName" label="项目名称" width="180" />
          <el-table-column prop="projectStatus" label="项目状态" width="120" />
<!--          <el-table-column prop="projectManagerName" label="项目上级" width="120" />-->
          <el-table-column prop="projectManagerName" label="项目经理" width="120" />
          <el-table-column prop="projectStartDate" label="计划开始时间" width="180" />
          <el-table-column prop="projectEndDate" label="计划结束时间" width="180" />
          <el-table-column prop="projectClientContactName" label="客户名称" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已完成" name="已完成" @row-click="handleClickProject">
        <el-table :data="finishedProject" border style="width: 100%">
          <el-table-column prop="projectName" label="项目名称" width="180" />
          <el-table-column prop="projectStatus" label="项目状态" width="120" />
<!--          <el-table-column prop="projectManagerName" label="项目上级" width="120" />-->
          <el-table-column prop="projectManagerName" label="项目经理" width="120" />
          <el-table-column prop="projectStartDate" label="计划开始时间" width="180" />
          <el-table-column prop="projectEndDate" label="计划结束时间" width="180" />
          <el-table-column prop="projectClientContactName" label="客户名称" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {getProjectList} from "@/api/project";

export default {
  name: 'ProjectList',
  data() {
    return {
      currentTabName: "全部项目",
      listQuery: {
        page: 1,
        size: 10,
        searchCondition: ""
      },
      allProject: [
        {
          projectID: "2019-0000-D-01",
          projectName: "test project updated 1",
          projectStatus: 0,
          projectManagerName: "boss",
          projectMonitorName: "tester",
          projectClientContactName: "billy",
          projectStartDate: "2019-11-11 00:00:00",
          projectEndDate: "2021-11-11 00:00:00"
        }
      ],
      underwayProject: [
        // {
        //   projectName: 'AchieveIt',
        //   projectStatus: '进行中',
        //   projectManagerName: '小六',
        //   projectStartDate: '2020-10-10',
        //   projectEndDate: '2020-10-10',
        //   projectClientContactName: '5%'
        // }
      ],
      startProject: [
        // {
        //   projectName: 'Myproject',
        //   projectStatus: '未开始',
        //   projectManagerName: '小六',
        //   projectStartDate: '2020-10-10',
        //   projectEndDate: '2020-10-10',
        //   projectClientContactName: '0%'
        // }
      ],
      finishedProject: [
        // {
        //   projectName: 'test',
        //   projectStatus: '已完成',
        //   projectManagerName: '小六',
        //   projectStartDate: '2020-10-10',
        //   projectEndDate: '2020-10-10',
        //   projectClientContactName: '100%'
        // }
      ]
    }
  },
  created: function() {
    this.getAllProject();
  },
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    handleTabsClick(tab) {
      this.listQuery.searchCondition = "";
      switch (tab.label) {
        case "全部项目":
          this.getAllProject();
          break;
        case "未开始":
          this.getStartProject();
          break;
        case "进行中":
          this.getUnderwayProject();
          break;
        case "已完成":
          this.getFinishedProject();
          break;
      }
    },
    getAllProject() {
      // getProjectList("", -1).then(response => {
      //   const { data } = response
      //   this.allProject = data
      // })
    },
    getStartProject() {
      getProjectList("", 0).then(response => {
        const { data } = response;
        this.startProject = data;
      })
    },
    getUnderwayProject() {
      getProjectList("", 1).then(response => {
        const { data } = response;
        this.underwayProject = data;
      })
    },
    getFinishedProject() {
      getProjectList("", 2).then(response => {
        const { data } = response;
        this.finishedProject = data;
      })
    },
    handleAddProject() {
      this.$router.push('/project/addProject')
    },
    searchProject() {
      getProjectList(this.listQuery.searchCondition, -1).then(response => {
        const { data } = response;
        this.allProject = data;
        this.currentTabName = "全部项目";
      })
    },
    handleClickProject(row) {
      this.$store.commit("project/setCurrentProjectId", { currentProjectId: row.projectID });
      this.$router.push({path: "/projectInfo/basicInfo"});
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
