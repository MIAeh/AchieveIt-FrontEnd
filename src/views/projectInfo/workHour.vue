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
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-plus" @click="handleWorkHour">申报工时</el-button>
          </el-col>
          <el-col :span="2" :offset="18">
            <el-dropdown class="dropdown-status">
              <span class="el-dropdown-link">
                申报状态
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>全部</el-dropdown-item>
                <el-dropdown-item>待批准</el-dropdown-item>
                <el-dropdown-item>已批准</el-dropdown-item>
                <el-dropdown-item>待修改</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
        <el-tabs v-model="applyStatus">
          <el-tab-pane label="全部申报" name="all"></el-tab-pane>
          <el-tab-pane label="我的申报" name="my"></el-tab-pane>
          <el-tab-pane name="apply">
            <span slot="label">
              <i class="el-icon-magic-stick"></i> 申报审批
            </span>
          </el-tab-pane>
        </el-tabs>
        <el-table :data="workHourList" @row-click="handleClickFunction" border style="width: 100%">
          <el-table-column prop="id" label="工时记录ID" width="180" />
          <el-table-column prop="date" label="申报日期" width="180" />
          <el-table-column prop="person" label="申报人" width="180" />
          <el-table-column prop="anotherPerson" label="审批人" width="180" />
          <el-table-column prop="function" label="相关功能" />
          <el-table-column prop="status" label="状态" width="120" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="设备列表" name="deviceList"></el-tab-pane>
      <el-tab-pane label="风险管理" name="riskManagement"></el-tab-pane>
    </el-tabs>

    <el-dialog title="登记工时记录" :visible.sync="workHourFormVisible">
      <el-form
        ref="workHourForm"
        :model="workHourForm"
        :rules="workHourFormRules"
        label-width="100px"
        label-position="center"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="申报日期">
              <el-input v-model="workHourForm.date" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="申报人">
              <el-input v-model="workHourForm.person" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批人">
              <el-input v-model="workHourForm.anotherPerson" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="功能名称" prop="function">
              <el-cascader
                v-model="workHourForm.function"
                :options="functionList"
                :show-all-levels="false"
                :props="{ expandTrigger: 'hover', checkStrictly: true, value: 'featureId', label: 'featureName', children: 'allChildren' }"
                placeholder="请选择"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动名称" prop="activity">
              <el-cascader
                v-model="workHourForm.activity"
                :options="activityList"
                :show-all-levels="false"
                :props="{ expandTrigger: 'hover', value: 'label'}"
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
          ></el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit" v-show="newApply || applyStatus === 'my'">保存</el-button>
        <el-button type="danger" @click="handleSubmit" v-show="!newApply && applyStatus === 'apply'">驳回</el-button>
        <el-button type="success" @click="handleSubmit" v-show="!newApply && applyStatus === 'apply'">批准</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFeature } from "@/api/feature";

export default {
  data() {
    return {
      activeTabName: "workHour",
      applyStatus: "all",
      workHourList: [
        {
          id: "00003",
          date: "2020-03-20",
          person: "张三",
          anotherPerson: "李四",
          function: "添加成员",
          status: "待批准"
        },
        {
          id: "00003",
          date: "2020-03-20",
          person: "张三",
          anotherPerson: "李四",
          function: "添加成员",
          status: "待批准"
        }
      ],
      newApply: false,
      workHourFormVisible: false,
      workHourForm: {
        date: "2020-03-20",
        person: "张三",
        anotherPerson: "李四",
        function: "",
        dateTime: "",
        activity: ""
      },
      workHourFormRules: {
        function: [{ required: true, message: "请选择功能名称" }],
        activity: [{ required: true, message: "请选择活动名称" }],
        dateTime: [{ required: true, message: "请选择起止时间" }]
      },
      functionList: null,
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
  created() {
    this.getFeature();
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
    handleTabRoute(tab, event) {
      this.$router.push(`/projectInfo/${tab.name}`);
    },
    handleWorkHour() {
      this.newApply = true;
      this.workHourFormVisible = true;
      //   this.workHourForm = {};
    },
    handleSubmit() {
      this.$refs.workHourForm.validate(valid => {
        if (valid) {
          this.workHourFormVisible = false;
        }
      });
    },
    handleClickFunction() {
      this.newApply = false;
      this.workHourFormVisible = true;
    }
  }
};
</script>

<style lang="scss">
.dropdown-status {
  margin: 12px 0;
}
</style>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
}
</style>