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
                <el-button type="text" class="btn-text-green" @click="approveApplication()">同意立项</el-button>
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
                <el-button type="text" class="btn-text-green" @click="launchProject()">确认启动项目</el-button>
              </div>
              <el-button slot="reference">启动项目</el-button>
            </el-popover>
            <el-popover width="240" v-model="visible" v-else-if="activeStatus === 3">
              <p>是否确认项目已成功交付，将项目状态设置为“已交付”？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" class="btn-text-green" @click="deliverProject()">确认交付</el-button>
              </div>
              <el-button slot="reference">确认交付</el-button>
            </el-popover>
            <el-popover width="240" v-model="visible" v-else-if="activeStatus === 4">
              <p>是否确认项目已结束，将项目状态设置为“结束”？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" class="btn-text-green" @click="endProject()">确认结束</el-button>
              </div>
              <el-button slot="reference">确认结束</el-button>
            </el-popover>
            <el-popover
              width="240"
              v-model="visible"
              v-else-if="activeStatus === 5 && projectSubStatus.archived"
            >
              <p>
                归档资料链接：
                <a>{{ link }}</a>
              </p>
              <p>请审批是否允许该项目归档？</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  class="btn-text-red"
                  type="text"
                  @click="rejectArchive()"
                >驳回归档</el-button>
                <el-button type="text" class="btn-text-green" @click="approveArchive()">同意归档</el-button>
              </div>
              <el-button slot="reference">审批归档</el-button>
            </el-popover>
            <el-button v-if="activeStatus === 5" @click="setArchivedLink">申请归档</el-button>
          </div>
        </el-row>
        <el-row class="dashboard-row-stateManage">
          <el-steps :active="activeStatus" align-center finish-status="success">
            <el-step title="申请立项" v-if="activeStatus >= 1"></el-step>
            <el-step title="已立项" v-if="activeStatus >= 1 && activeStatus <= 6">
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
            <el-step title="进行中" v-if="activeStatus >= 2 && activeStatus <= 6"></el-step>
            <el-step title="已交付" v-if="activeStatus >= 3 && activeStatus <= 6"></el-step>
            <el-step title="结束" v-if="activeStatus >= 4 && activeStatus <= 6"></el-step>
            <el-step title="已归档" v-if="activeStatus >= 5 && activeStatus <= 6"></el-step>
            <el-step title="立项驳回" v-if="activeStatus == 7" status="error"></el-step>
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

    <el-dialog :title="addFormTitle" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="100px" label-position="center">
        <el-row v-show="addFormTitle !== '申请归档'">
          <el-form-item label="成员账号">
            <el-select
              v-model="addForm.memberIDs"
              filterable
              remote
              reserve-keyword
              multiple
              placeholder="请搜索账号"
              style="width: 100%"
            >
              <el-option
                v-for="item in allUserList"
                :key="item.userId"
                :label="item.userName+'-'+item.userId"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row v-show="addFormTitle === '申请归档'">
          <el-col :span="12">
            <el-form-item label="归档资料链接">
              <el-input v-model="addForm.archiveLink" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddForm">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getProjectStatus,
  approveApplication,
  rejectApplication,
  confirmConfigurationCompleted,
  addQAMembersByID,
  addEPGMembersByID,
  launchProject,
  deliverProject,
  endProject,
  getArchiveLink,
  updateArchive,
  approveArchive,
  rejectArchive
} from "@/api/status";
import { getAllUser } from "@/api/user";
export default {
  data() {
    return {
      activeTabName: "stateManage",
      projectID: "",
      activeStatus: 1,
      visible: false,
      link: "",
      projectSubStatus: {
        configurationCompleted: false,
        allocatedQA: false,
        allocatedEPG: false,
        archived: null
      },
      setBasicStatus: "wait",
      setQAStatus: "wait",
      setEPGStatus: "wait",
      setVisible: false,
      addFormTitle: "",
      addFormVisible: false,
      addForm: {
        memberIDs: [],
        archiveLink: ""
      },
      allUserList: []
    };
  },
  mounted() {
    this.getProjectStatus();
  },
  methods: {
    handleTabRoute(tab, event) {
      this.$router.push(`/projectInfo/${tab.name}`);
    },
    getProjectStatus() {
      this.visible = false;
      this.setVisible = false;
      this.projectID = this.$store.state.project.currentProjectId;
      getProjectStatus(this.projectID).then(res => {
        const { data } = res;
        this.activeStatus = data.projectStatus + 1;
        this.projectSubStatus = { ...data.projectSubStatus };
        if (this.activeStatus > 2 || this.projectSubStatus.configurationCompleted) {
          this.setBasicStatus = "finish";
        }
        if (this.activeStatus > 2 || this.projectSubStatus.allocatedQA) {
          this.setQAStatus = "finish";
        }
        if (this.activeStatus > 2 || this.projectSubStatus.allocatedEPG) {
          this.setEPGStatus = "finish";
        }
      });
    },
    getAllUser() {
      getAllUser(this.projectID).then(res => {
        const { data } = res;
        this.allUserList = data;
      });
    },
    getArchiveLink() {
      getArchiveLink().then(res => {
        const { data } = res;
        this.link = data.archiveLink;
      });
    },
    // next() {
    //   this.visible = false;
    //   this.activeStatus++;
    //   // if (this.activeStatus++ > 4) this.activeStatus = 1;
    // },
    approveApplication() {
      approveApplication(this.projectID).then(res => {
        if (res.errorCode == "200") this.getProjectStatus();
      });
    },
    rejectApplication() {
      this.activeStatus = 6;
      rejectApplication(this.projectID).then(res => {
        if (res.errorCode == "200") this.getProjectStatus();
      });
    },
    setBasic() {
      // this.setVisible = false;
      confirmConfigurationCompleted(this.projectID).then(res => {
        if (res.errorCode == "200") this.getProjectStatus();
      });
    },
    setQA() {
      this.getAllUser();
      this.addFormTitle = "分配QA";
      this.addFormVisible = true;
      this.addForm = {
        memberIDs: []
      };
    },
    setEPG() {
      this.getAllUser();
      this.addFormTitle = "分配EPG";
      this.addFormVisible = true;
      this.addForm = {
        memberIDs: []
      };
    },
    launchProject() {
      launchProject(this.projectID).then(res => {
        if (res.errorCode == "200") this.getProjectStatus();
      });
    },
    deliverProject() {
      deliverProject(this.projectID).then(res => {
        if (res.errorCode == "200") this.getProjectStatus();
      });
    },
    endProject() {
      endProject(this.projectID).then(res => {
        if (res.errorCode == "200") this.getProjectStatus();
      });
    },
    setArchivedLink() {
      this.getArchiveLink();
      this.addFormTitle = "申请归档";
      this.addFormVisible = true;
      this.addForm = {
        archiveLink: ""
      };
    },
    submitAddForm() {
      if (this.addFormTitle == "分配QA") {
        addQAMembersByID(this.projectID, this.addForm.memberIDs).then(res => {
          this.getProjectStatus();
          this.addFormTitle = "";
          this.addFormVisible = false;
        });
      } else if (this.addFormTitle == "分配EPG") {
        addEPGMembersByID(this.projectID, this.addForm.memberIDs).then(res => {
          this.getProjectStatus();
          this.addFormTitle = "";
          this.addFormVisible = false;
        });
      } else {
        updateArchive(this.projectID, this.addForm.archiveLink).then(res => {
          this.getProjectStatus();
          this.addFormTitle = "";
          this.addFormVisible = false;
        });
      }
    },
    approveArchive() {
      approveArchive(this.projectID).then(res => {
        if (res.errorCode == "200") this.getProjectStatus();
      });
    },
    rejectArchive() {
      rejectArchive(this.projectID).then(res => {
        if (res.errorCode == "200") this.getProjectStatus();
      });
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