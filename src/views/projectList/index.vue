<template>
  <div class="dashboard-container">
    <el-tabs v-model="currentTabName" type="border-card" @tab-click="handleTabsClick">
      <el-row class="dashboard-row">
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-plus" @click="handleAddProject"
                     v-if="this.$store.state.user.role === 0">
            新建项目</el-button>
        </el-col>
        <el-col :span="8" :offset="12">
          <el-input
            v-model="listQuery.searchCondition"
            placeholder="搜索项目名称、项目上级、项目经理、客户名称"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchProject" />
          </el-input>
        </el-col>
      </el-row>
      <el-tab-pane label="全部项目" name="全部项目" />
      <el-tab-pane label="申请立项" name="申请立项" />
      <el-tab-pane label="已立项" name="已立项" />
      <el-tab-pane label="进行中" name="进行中" />
      <el-tab-pane label="已交付" name="已交付" />
      <el-tab-pane label="已结束" name="已结束" />
      <el-tab-pane label="已归档" name="已归档" />
      <el-tab-pane label="立项驳回" name="立项驳回" />
    </el-tabs>
    <el-table :data="projectList" border style="width: 100%" @row-click="handleClickProject">
      <el-table-column prop="projectName" label="项目名称" width="180" />
      <el-table-column prop="projectStatus" label="项目状态" width="120">
        <template slot-scope="scope">{{ scope.row.projectStatus | formatProjectStatus }}</template>
      </el-table-column>
      <!--          <el-table-column prop="projectManagerName" label="项目上级" width="120" />-->
      <el-table-column prop="projectManagerName" label="项目经理" width="120" />
      <el-table-column prop="projectStartDate" label="计划开始时间" width="180">
        <template slot-scope="scope">{{ scope.row.projectStartDate | formatDateString }}</template>
      </el-table-column>
      <el-table-column prop="projectEndDate" label="计划结束时间" width="180">
        <template slot-scope="scope">{{ scope.row.projectEndDate | formatDateString }}</template>
      </el-table-column>
      <el-table-column prop="projectClientContactName" label="客户名称" />
    </el-table>
  </div>
</template>

<script>
import { getProjectList } from "@/api/project";

export default {
  name: "ProjectList",
  data() {
    return {
      currentTabName: "全部项目",
      listQuery: {
        page: 1,
        size: 10,
        searchCondition: ""
      },
      projectList: [],
      allProject: [],
      underwayProject: [],
      startProject: [],
      finishedProject: []
    };
  },
  created: function() {
    this.getProjectList(-1);
  },
  filters: {
    formatProjectStatus(val) {
      const projectListStatus = ['申请立项', '已立项', '进行中', '已交付', '已结束', '已归档', '立项驳回'];
      if (val > -1 && val < projectListStatus.length) {
        return projectListStatus[val];
      } else{
        return val;
      }
    },
    formatDateString(timeString) {
      const date = new Date(timeString);
      let year = date.getFullYear();//获取完整的年份(4位,1970-????)
      let month = date.getMonth() + 1;//获取当前月份(0-11,0代表1月)
      let day = date.getDate();//获取当前日(1-31)
      if (month < 10) {
        month ="0" + month;
      }
      if (day < 10) {
        day ="0" + day;
      }
      return  year +"-" + month + "-" + day;
    }
  },
  methods: {
    handleTabsClick(tab) {
      this.listQuery.searchCondition = "";
      this.getProjectList(tab.index - 1);
      // switch (tab.label) {
      //   case "全部项目":
      //     this.getAllProject();
      //     break;
      //   case "未开始":
      //     this.getStartProject();
      //     break;
      //   case "进行中":
      //     this.getUnderwayProject();
      //     break;
      //   case "已完成":
      //     this.getFinishedProject();
      //     break;
      // }
    },
    getProjectList(projectStatus) {
      getProjectList("", projectStatus).then(response => {
        const { data } = response;
        this.projectList = data;
      })
    },
    getAllProject() {
      getProjectList("", -1).then(response => {
        const { data } = response
        this.allProject = data
      })
    },
    getStartProject() {
      getProjectList("", 0).then(response => {
        const { data } = response;
        this.startProject = data;
      });
    },
    getUnderwayProject() {
      getProjectList("", 1).then(response => {
        const { data } = response;
        this.underwayProject = data;
      });
    },
    getFinishedProject() {
      getProjectList("", 2).then(response => {
        const { data } = response;
        this.finishedProject = data;
      });
    },
    handleAddProject() {
      this.$router.push("/project/addProject");
    },
    searchProject() {
      getProjectList(this.listQuery.searchCondition, -1).then(response => {
        const { data } = response;
        this.projectList = data;
        this.currentTabName = "全部项目";
      });
    },
    handleClickProject(row) {
      this.$store.commit("project/setCurrentProjectId", {
        currentProjectId: row.projectID
      });
      this.$router.push({ path: "/projectInfo/basicInfo" });
    }
  }
};
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
