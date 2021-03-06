<template>
  <div class="dashboard-container">
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabRoute">
      <el-tab-pane label="基本信息" name="basicInfo"></el-tab-pane>
      <el-tab-pane label="状态管理" name="stateManage"></el-tab-pane>
      <el-tab-pane label="功能列表" name="functionList"></el-tab-pane>
      <el-tab-pane label="成员管理" name="memberManage"></el-tab-pane>
      <el-tab-pane label="权限管理" name="authorityManage"></el-tab-pane>
      <el-tab-pane label="工时管理" name="workHour">
        <el-row class="dashboard-row">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="handleCreateWorkHour"
            v-if="this.$store.state.user.isMember === true && this.$store.state.project.status != 5 && this.$store.state.project.status > 1"
          >申报工时</el-button>
          <el-dropdown class="dropdown-status" @command="handleStatusChange">
            <span class="el-dropdown-link">
              申报状态
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="-1">全部</el-dropdown-item>
              <el-dropdown-item command="0">待批准</el-dropdown-item>
              <el-dropdown-item command="1">已批准</el-dropdown-item>
              <el-dropdown-item command="2">待修改</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-row>
        <el-tabs v-model="applyStatus" @tab-click="handleWorkHourTabRoute">
          <el-tab-pane label="全部申报" name="all"></el-tab-pane>
          <el-tab-pane label="我的申报" name="my"></el-tab-pane>
          <el-tab-pane name="apply">
            <span slot="label">
              <i class="el-icon-magic-stick"></i> 申报审批
            </span>
          </el-tab-pane>
        </el-tabs>
        <el-table
          :data="showWorkHourList"
          @row-click="handleClickWorkHour"
          border
          style="width: 100%"
        >
          <el-table-column prop="workHourId" label="工时记录ID" width="180" />
          <el-table-column prop="applyTime" label="申报日期" width="180">
            <template slot-scope="scope">{{ scope.row.applyTime | formatDateString }}</template>
          </el-table-column>
          <el-table-column prop="applyerName" label="申报人" width="180" />
          <el-table-column prop="approverName" label="审批人" width="180" />
          <el-table-column prop="featureName" label="相关功能" />
          <el-table-column prop="status" label="状态" width="120">
            <template slot-scope="scope">{{ scope.row.status | ConvertStatus }}</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="设备列表" name="deviceList"></el-tab-pane>
      <el-tab-pane label="风险管理" name="riskManagement"></el-tab-pane>
    </el-tabs>

    <el-dialog :title="formTitle" :visible.sync="workHourFormVisible">
      <el-form
        ref="workHourForm"
        :model="workHourForm"
        :rules="workHourFormRules"
        label-width="100px"
        label-position="center"
        :disabled="formDisabled"
      >
        <el-row v-if="formTitle !== '登记工时记录'">
          <el-col :span="12">
            <el-form-item label="申报日期">
              <el-input v-model="workHourForm.applyTime" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formTitle !== '登记工时记录'">
          <el-col :span="12">
            <el-form-item label="申报人">
              <el-input v-model="workHourForm.applyerName" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批人">
              <el-input v-model="workHourForm.approverName" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="功能名称" prop="featureName">
              <el-cascader
                v-model="workHourForm.featureName"
                :options="functionList"
                :show-all-levels="false"
                :props="{
                  expandTrigger: 'hover',
                checkStrictly: true,
                value: 'featureName',
                label: 'featureName',
                children: 'allChildren',
                emitPath: false
                }"
                placeholder="请选择"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动名称" prop="activityName">
              <el-cascader
                v-model="workHourForm.activityName"
                :options="activityList"
                :show-all-levels="false"
                :props="{ expandTrigger: 'hover', value: 'label', emitPath: false}"
                placeholder="请选择"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="起止时间" prop="dateTime">
          <el-time-picker
            is-range
            v-model="workHourForm.dateTime"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="timestamp"
          ></el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="handleSubmit"
          v-show="newApply || applyStatus === 'my'"
          v-if="this.$store.state.project.status != 5"
        >保存</el-button>
        <el-button
          type="danger"
          @click="handleReject"
          v-show="!newApply && applyStatus === 'apply'"
          v-if="this.$store.state.project.status != 5"
        >驳回</el-button>
        <el-button
          type="success"
          @click="handleApprove"
          v-show="!newApply && applyStatus === 'apply'"
          v-if="this.$store.state.project.status != 5"
        >批准</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFeature } from "@/api/feature";
import {
  applyWorkHour,
  approveWorkHour,
  getMyWorkHoursByProjectID,
  getMyWorkHoursToApproveByProjectID,
  getWorkHoursByProjectID,
  rejectWorkHour,
  updateWorkHour
} from "@/api/workHour";

export default {
  data() {
    return {
      activeTabName: "workHour",
      applyStatus: "all",
      showWorkHourList: [],
      workHourList: [],
      newApply: false,
      workHourFormVisible: false,
      workHourForm: {
        workHourId: "",
        applyTime: "",
        applyerName: "",
        approverName: "",
        featureName: "",
        dateTime: "",
        activityName: ""
      },
      workHourFormRules: {
        featureName: [
          { required: true, message: "请选择功能名称", trigger: " blur" }
        ],
        activityName: [
          { required: true, message: "请选择活动名称", trigger: " blur" }
        ],
        dateTime: [
          { required: true, message: "请选择起止时间", trigger: " blur" }
        ]
      },
      functionList: null,
      statusList: ["待批准", "已批准", "待修改"],
      activityList: [
        {
          label: "工程活动",
          children: [
            {
              label: "需求开发"
            },
            {
              label: "设计"
            },
            {
              label: "编码"
            },
            {
              label: "单体测试"
            },
            {
              label: "集成测试"
            },
            {
              label: "系统测试"
            },
            {
              label: "交付"
            }
          ]
        },
        {
          label: "管理活动",
          children: [
            {
              label: "范围管理"
            },
            {
              label: "计划与调整"
            },
            {
              label: "监控与分析"
            },
            {
              label: "联络与沟通"
            }
          ]
        },
        {
          label: "外包活动",
          children: [
            {
              label: "外包管理"
            },
            {
              label: "外包验收"
            },
            {
              label: "外包支持"
            }
          ]
        },
        {
          label: "支持活动",
          children: [
            {
              label: "配置管理"
            },
            {
              label: "QA 审计"
            },
            {
              label: "会议报告总结"
            },
            {
              label: "培训"
            },
            {
              label: "其他"
            }
          ]
        }
      ]
    };
  },
  filters: {
    ConvertStatus: function(statusNumber) {
      const statusList = ["待批准", "已批准", "待修改"];
      if (statusNumber > -1 && statusNumber < statusList.length) {
        return statusList[statusNumber];
      }
      return statusNumber;
    },
    formatDateString(timeString) {
      const date = new Date(timeString);
      let year = date.getFullYear(); //获取完整的年份(4位,1970-????)
      let month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
      let day = date.getDate(); //获取当前日(1-31)
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return year + "-" + month + "-" + day;
    }
  },
  computed: {
    workHourByStatus() {
      let workHourArray = [];
      for (let status = 0; status < 3; status++) {
        workHourArray.push(
          this.workHourList.filter(item => item.status === status)
        );
      }
      return workHourArray;
    },
    formTitle() {
      if (this.newApply) return "登记工时记录";
      if (this.applyStatus === "apply") {
        return "审批申报";
      } else {
        return "申报详情";
      }
    },
    formDisabled() {
      if (this.newApply === true) return false;
      if (this.applyStatus === "all" || this.applyStatus === "apply") {
        return true;
      }
      if (
        this.applyStatus === "my" &&
        this.statusList[this.workHourForm.status] === "已批准"
      ) {
        return true;
      }
      return false;
    }
  },
  created() {
    this.getFeature();
    this.getWorkHour();
    // const today = new Date();
    // this.workHourForm.date
  },
  methods: {
    getFeature() {
      getFeature(this.$store.state.project.currentProjectId).then(res => {
        const { data } = res;
        this.functionList = data;
      });
    },
    getCurrentWorkHour() {
      switch (this.applyStatus) {
        case "all":
          this.getWorkHour();
          break;
        case "my":
          this.getMyWorkHour();
          break;
        case "apply":
          this.getMyWorkHoursToApprove();
      }
    },
    getWorkHour() {
      getWorkHoursByProjectID(this.$store.state.project.currentProjectId).then(
        res => {
          const { data } = res;
          console.log(data);
          this.workHourList = data;
          this.showWorkHourList = this.workHourList;
        }
      );
    },
    getMyWorkHour() {
      getMyWorkHoursByProjectID(
        this.$store.state.project.currentProjectId
      ).then(res => {
        const { data } = res;
        console.log(data);
        this.workHourList = data;
        this.showWorkHourList = this.workHourList;
      });
    },
    getMyWorkHoursToApprove() {
      getMyWorkHoursToApproveByProjectID(
        this.$store.state.project.currentProjectId
      ).then(res => {
        const { data } = res;
        console.log(data);
        this.workHourList = data;
        this.showWorkHourList = this.workHourList;
      });
    },
    handleTabRoute(tab) {
      this.$router.push(`/projectInfo/${tab.name}`);
    },
    handleWorkHourTabRoute(tab) {
      switch (tab.name) {
        case "all":
          this.getWorkHour();
          break;
        case "my":
          this.getMyWorkHour();
          break;
        case "apply":
          this.getMyWorkHoursToApprove();
          break;
      }
    },
    handleCreateWorkHour() {
      this.newApply = true;
      this.workHourFormVisible = true;
      this.clearWorkHourForm();
    },
    handleSubmit() {
      this.$refs.workHourForm.validate(valid => {
        if (valid) {
          this.workHourForm.startTime = this.workHourForm.dateTime[0];
          this.workHourForm.endTime = this.workHourForm.dateTime[1];
          this.workHourForm.projectID = this.$store.state.project.currentProjectId;
          if (this.newApply === true) {
            applyWorkHour(
              this.workHourForm.featureName,
              this.workHourForm.activityName,
              this.workHourForm.startTime,
              this.workHourForm.endTime,
              this.workHourForm.projectID
            ).then(res => {
              this.workHourFormVisible = false;
              this.getCurrentWorkHour();
            });
          } else {
            updateWorkHour(
              this.workHourForm.workHourId,
              this.workHourForm.featureName,
              this.workHourForm.activityName,
              this.workHourForm.startTime,
              this.workHourForm.endTime
            ).then(res => {
              this.workHourFormVisible = false;
              this.getCurrentWorkHour();
            });
          }
          console.log(this.workHourForm);
        }
      });
    },
    handleReject() {
      rejectWorkHour(this.workHourForm.workHourId).then(res => {
        this.workHourFormVisible = false;
        this.getCurrentWorkHour();
      });
    },
    handleApprove() {
      approveWorkHour(this.workHourForm.workHourId).then(res => {
        this.workHourFormVisible = false;
        this.getCurrentWorkHour();
      });
    },
    handleClickWorkHour(row) {
      this.newApply = false;
      this.workHourFormVisible = true;
      row.dateTime = [row.startTime, row.endTime];
      console.log(row);
      this.workHourForm = { ...row };
    },
    handleStatusChange(command) {
      if (command >= 0) {
        this.showWorkHourList = this.workHourByStatus[command];
      } else {
        this.showWorkHourList = this.workHourList;
      }
    },
    clearWorkHourForm() {
      this.workHourForm = {
        applyTime: "",
        applyerName: "",
        approverName: "",
        featureName: "",
        dateTime: "",
        activityName: ""
      };
    }
  }
};
</script>

<style lang="scss">
.dropdown-status {
  margin: 12px 0;
  float: right;
}
</style>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
}
</style>
