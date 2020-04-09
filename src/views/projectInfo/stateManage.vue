<template>
  <div class="dashboard-container">
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabRoute">
      <el-tab-pane label="基本信息" name="basicInfo"></el-tab-pane>
      <el-tab-pane label="状态管理" name="stateManage">
        <el-row class="dashboard-row-stateManage">
          <div style="float:right">
            <el-popover width="240" v-model="visible" v-if="activeStatus === 1">
              <p>请仔细确认申请立项的项目信息，如同意立项，请选择“同意立项”；如需修改，请选择“驳回立项”。</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  class="btn-text-red"
                  type="text"
                  @click="rejectApplication()"
                >驳回立项</el-button>
                <el-button type="text" class="btn-text-green" @click="next()">同意立项</el-button>
              </div>
              <el-button slot="reference">审批立项</el-button>
            </el-popover>
            <el-popover
              width="240"
              v-model="visible"
              v-else-if="activeStatus === 2 && setBasicStatus === 'finish' && setQAStatus === 'finish' && setEPGStatus === 'finish'"
            >
              <p>是否确认项目基本配置已完成，正式启动项目？</p>
              <p>-人员信息设定完成</p>
              <p>-权限列表设定完成</p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" class="btn-text-green" @click="next()">确认启动项目</el-button>
              </div>
              <el-button slot="reference">启动项目</el-button>
            </el-popover>
            <el-popover width="240" v-model="visible" v-else-if="activeStatus === 3">
              <p>是否确认项目已成功交付，将项目状态设置为“已交付”？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" class="btn-text-green" @click="next()">确认交付</el-button>
              </div>
              <el-button slot="reference">确认交付</el-button>
            </el-popover>
            <el-popover width="240" v-model="visible" v-else-if="activeStatus === 4">
              <p>是否确认项目已结束，将项目状态设置为“结束”？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" class="btn-text-green" @click="next()">确认结束</el-button>
              </div>
              <el-button slot="reference">确认结束</el-button>
            </el-popover>
            <el-popover width="240" v-model="visible" v-else-if="activeStatus === 5">
              <p>
                归档资料链接：
                <a>{{ link }}</a>
              </p>
              <p>请审批是否允许该项目归档？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" class="btn-text-green" @click="next()">同意归档</el-button>
              </div>
              <el-button slot="reference">审批归档</el-button>
            </el-popover>
            <el-button v-if="activeStatus === 5" @click="next">申请归档</el-button>
          </div>
        </el-row>
        <el-row class="dashboard-row-stateManage">
          <el-steps :active="activeStatus" align-center finish-status="success">
            <el-step title="申请立项" v-if="activeStatus >= 1"></el-step>
            <el-step title="已立项" v-if="activeStatus >= 1 && activeStatus <= 5">
              <template slot="description">
                <el-row
                  class="dashboard-row-stateManage"
                  v-if="activeStatus >= 2 && activeStatus <= 5"
                >
                  <el-steps
                    :active="0"
                    :space="100"
                    direction="vertical"
                    finish-status="wait"
                    class="dashboard-steps"
                  >
                    <el-step title="配置完成" :status="setBasicStatus" icon="el-icon-setting">
                      <template slot="description">
                        <el-popover
                          width="240"
                          placement="right"
                          v-model="setVisible"
                          v-if="setBasicStatus != 'finish'"
                        >
                          <p>是否确认项目配置已完成？</p>
                          <p>-Github仓库配置</p>
                          <p>-文件服务器配置</p>
                          <div style="text-align: right; margin: 0">
                            <el-button type="text" @click="setBasic">确认完成</el-button>
                          </div>
                          <el-button slot="reference" size="mini" type="text">确认配置</el-button>
                        </el-popover>
                      </template>
                    </el-step>
                    <el-step title="QA分配完成" :status="setQAStatus" icon="el-icon-user">
                      <template slot="description">
                        <el-button
                          size="mini"
                          type="text"
                          v-if="setQAStatus != 'finish'"
                          @click="setQA()"
                        >分配QA</el-button>
                      </template>
                    </el-step>
                    <el-step title="EPG分配完成" :status="setEPGStatus" icon="el-icon-user">
                      <template slot="description">
                        <el-button
                          size="mini"
                          type="text"
                          v-if="setEPGStatus != 'finish'"
                          @click="setEPG()"
                        >分配EPG</el-button>
                      </template>
                    </el-step>
                  </el-steps>
                </el-row>
              </template>
            </el-step>
            <el-step title="进行中" v-if="activeStatus >= 2 && activeStatus <= 5"></el-step>
            <el-step title="已交付" v-if="activeStatus >= 3 && activeStatus <= 5"></el-step>
            <el-step title="结束" v-if="activeStatus >= 4 && activeStatus <= 5"></el-step>
            <el-step title="已归档" v-if="activeStatus == 5"></el-step>
            <el-step title="立项驳回" v-if="activeStatus == 6" status="error"></el-step>
          </el-steps>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="功能列表" name="functionList"></el-tab-pane>
      <el-tab-pane label="成员管理" name="memberManage"></el-tab-pane>
      <el-tab-pane label="权限管理" name="authorityManage"></el-tab-pane>
      <el-tab-pane label="工时管理" name="workHour"></el-tab-pane>
      <el-tab-pane label="设备列表" name="deviceList"></el-tab-pane>
      <el-tab-pane label="风险管理" name="riskManagement"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTabName: "stateManage",
      activeStatus: 1,
      visible: false,
      link: "https://www.baidu.com/",
      setBasicStatus: 'wait',
      setQAStatus: 'wait',
      setEPGStatus: 'wait',
      setVisible: false
    };
  },
  methods: {
    handleTabRoute(tab, event) {
      this.$router.push(`/projectInfo/${tab.name}`);
    },
    next() {
      this.visible = false;
      if (this.activeStatus++ > 4) this.activeStatus = 1;
    },
    rejectApplication() {
      this.activeStatus = 6;
    },
    setBasic() {
      this.setVisible = false;
      this.setBasicStatus = "finish";
    },
    setQA() {
      this.setQAStatus = "finish";
    },
    setEPG() {
      this.setEPGStatus = "finish";
    }
  }
};
</script>

<style lang="scss">
.dashboard {
  &-row-stateManage {
    margin-bottom: 50px;
  }
  &-steps {
    .el-step.is-vertical .el-step__line {
      height: auto !important;
    }
  }
}
.btn-text-red {
  color: #f56c6c;
  float: none;
}
.btn-text-red:focus,
.btn-text-red:hover {
  color: #f78989;
}
.btn-text-green {
  color: #67c23a;
}
.btn-text-green:focus,
.btn-text-green:hover {
  color: #85ce61;
}
</style>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
  .step-row {
    min-height: 500px;
  }
}
</style>