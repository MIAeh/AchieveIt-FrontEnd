<template>
  <div class="dashboard-container">
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabRoute">
      <el-tab-pane label="基本信息" name="basicInfo"></el-tab-pane>
      <el-tab-pane label="状态管理" name="stateManage"></el-tab-pane>
      <el-tab-pane label="功能列表" name="functionList"></el-tab-pane>
      <el-tab-pane label="成员管理" name="memberManage"></el-tab-pane>
      <el-tab-pane label="权限管理" name="authorityManage"></el-tab-pane>
      <el-tab-pane label="工时管理" name="workHour"></el-tab-pane>
      <el-tab-pane label="设备列表" name="deviceList"></el-tab-pane>
      <el-tab-pane label="风险管理" name="riskManagement">
        <el-row class="dashboard-row">
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-plus" @click="handleAddRisk">登记风险</el-button>
          </el-col>
          <el-col :span="4" :offset="16">
            <el-button
              type="primary"
              icon="el-icon-download"
              style="float:right"
              @click="importFormVisible = true"
            >导入风险</el-button>
          </el-col>
        </el-row>
        <el-table :data="riskList" border style="width: 100%" @row-click="handleEdit">
          <el-table-column prop="riskID" label="风险ID" width="140" />
          <el-table-column prop="riskDescription" label="风险描述" />
          <el-table-column prop="riskType" label="类型" width="120">
            <template scope="scope">{{ scope.row.riskType | formatRiskTypeString }}</template>
          </el-table-column>
          <el-table-column prop="riskChargerName" label="责任人" width="140" />
          <el-table-column prop="riskLevel" label="级别" width="120">
            <template scope="scope">{{ scope.row.riskLevel | formatRiskLevelString }}</template>
          </el-table-column>
          <el-table-column prop="riskInfluence" label="影响度" width="120">
            <template scope="scope">{{ scope.row.riskInfluence | formatRiskInfluenceString }}</template>
          </el-table-column>
          <el-table-column prop="riskStatus" label="风险状态" width="140">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.riskStatus === '1'">已解决</el-tag>
              <el-tag type="danger" v-else>处理中</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                @click.stop="handlePass(scope.row)"
                type="text"
                size="small"
                class="btn-text-green"
              >确认解决</el-button>
              <el-button
                @click.stop="handleDelete(scope.row)"
                type="text"
                size="small"
                class="btn-text-red"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="dialogTitle" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="100px" label-position="center">
        <el-row>
          <el-form-item label="风险描述">
            <el-input v-model="addForm.riskDescription"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="风险类型">
              <el-select v-model="addForm.riskType" placeholder="请选择">
                <el-option v-for="(item, index) in riskTypeList" :key="item" :label="item" :value="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险跟踪频度">
              <el-input v-model="addForm.riskFrequency" type="number">
                <template slot="append">天/次</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="风险级别">
              <el-select v-model="addForm.riskLevel" placeholder="请选择">
                <el-option v-for="(item, index) in riskLevelList" :key="item" :label="item" :value="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险影响度">
              <el-select v-model="addForm.riskInfluence" placeholder="请选择">
                <el-option v-for="(item, index) in riskInfluenceList" :key="item" :label="item" :value="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="责任人">
              <el-select v-model="addForm.riskCharger" placeholder="请选择责任人">
                <el-option v-for="item in userList" :key="item.memberID" :label="item.memberName" :value="item.memberID"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险相关者">
              <el-select v-model="addForm.riskHolders" multiple placeholder="请选择风险相关者">
                <el-option v-for="item in userList" :key="item.memberID" :label="item.memberName" :value="item.memberID"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="风险应对策略">
            <el-input v-model="addForm.riskStrategy" type="textarea" rows="4"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="导入风险信息" :visible.sync="importFormVisible">
      <el-form :model="importForm" label-width="100px" label-position="center">
        <el-row>
          <el-col :span="12">
            <el-form-item label="导入类型">
              <el-select
                v-model="importForm.importType"
                placeholder="请选择导入类型"
                @change="handleImportTypeChange"
              >
                <el-option v-for="item in importTypeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="importForm.importType === '其他项目'">
            <el-form-item label="导入项目">
              <el-select
                v-model="importForm.importProject"
                placeholder="请选择导入项目"
                @change="getProjectRiskList"
              >
                <el-option v-for="item in projectList" :key="item.projectID" :label="item.projectName" :value="item.projectID"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-table :data="templateList" border style="width: 100%" @row-click="importProject">
          <el-table-column prop="riskDescription" label="风险描述" />
          <el-table-column prop="riskType" label="类型" width="120">
            <template scope="scope">{{ scope.row.riskType | formatRiskTypeString }}</template>
          </el-table-column>
          <el-table-column prop="riskLevel" label="级别" width="120">
            <template scope="scope">{{ scope.row.riskLevel | formatRiskLevelString }}</template>
          </el-table-column>
          <el-table-column prop="riskInfluence" label="影响度" width="120">
            <template scope="scope">{{ scope.row.riskInfluence | formatRiskInfluenceString }}</template>
          </el-table-column>
          <el-table-column prop="riskStrategy" label="风险应对策略" width="140">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>{{ scope.row.riskStrategy }}</p>
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.riskStrategy | formatStringLong }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="importFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addRisk,
    deleteRisk,
    getRisksByProjectID,
    getRiskTemplates,
    getRiskTemplatesByProjectID,
    solveRisk,
    updateRiskByRiskID
  } from "@/api/risk";
  import {getMembers} from "@/api/Member";
  import {getProjectList} from "@/api/project";

export default {
  data() {
    return {
      activeTabName: "riskManagement",
      riskList: [
        {
          riskID: "00123",
          riskDescription: "风险描述书aaaaaa",
          riskType: "项目风险",
          riskFrequency: 0,
          riskChargerName: "小刘",
          riskHolders: [],
          riskLevel: "中",
          riskInfluence: "高",
          riskStatus: "0",
          riskStrategy: "阿莱克斯的结婚方式绝代风华阿斯顿开发环境阿斯顿开发哈看世界的合法函数圣诞节发货科技的书法考级哈收到尽快发货"
        },
        {
          riskID: "00123",
          riskDescription: "风险描述书bbbbbb",
          riskType: "商业风险",
          riskFrequency: 0,
          riskChargerName: "小刘",
          riskLevel: "中",
          riskInfluence: "低",
          riskStatus: "1"
        },
        {
          riskID: "00123",
          riskDescription: "风险描述书ccccc",
          riskType: "技术风险",
          riskFrequency: 0,
          riskChargerName: "小刘",
          riskLevel: "低",
          riskInfluence: "高",
          riskStatus: "0"
        }
      ],
      templateList: [],
      projectList: [],
      riskTypeList: ["商业风险", "项目风险", "技术风险"],
      riskLevelList: ["高", "中", "低"],
      riskInfluenceList: ["高", "中", "低"],
      userList: [
        {
          memberID: "b6703879-e1e2-499c-8ffe-d8b29f71f156",
          memberName: "tester",
        },
        {
          memberID: "48fb8377-664f-4a9b-b13f-6729b00a9e22",
          memberName: "boss",
        },
        {
          memberID: "0006",
          memberName: "0.8064611509747337",
        }
      ],
      dialogTitle: "登记风险",
      addFormVisible: false,
      addForm: {
        riskDescription: "",
        riskType: "",
        riskFrequency: "",
        riskLevel: "",
        riskInfluence: "",
        riskCharger: "",
        riskHolders: [],
        riskStrategy: ""
      },
      importFormVisible: false,
      importForm: {
        importType: "",
        importProject: ""
      },
      importTypeList: ["标准风险库", "其他项目"]
    };
  },
  filters: {
    formatStringLong(value) {
      return value ? value.slice(0, 15) + '...' : '';
    },
    formatRiskTypeString(typeNumber) {
      const riskTypeList = ["商业风险", "项目风险", "技术风险"];
      if (typeNumber >= 0 && typeNumber < riskTypeList.length) {
        return riskTypeList[typeNumber];
      } else {
        return typeNumber;
      }
    },
    formatRiskLevelString(levelNumber) {
      const riskLevelList = ["高", "中", "低"];
      if (levelNumber >= 0 && levelNumber < riskLevelList.length) {
        return riskLevelList[levelNumber];
      } else {
        return levelNumber;
      }
    },
    formatRiskInfluenceString(levelNumber) {
      const riskInfluenceList = ["高", "中", "低"];
      if (levelNumber >= 0 && levelNumber < riskInfluenceList.length) {
        return riskInfluenceList[levelNumber];
      } else {
        return levelNumber;
      }
    },
  },
  created() {
    this.getRisk();
  },
  methods: {
    getRisk() {
      getRisksByProjectID(this.$store.state.project.currentProjectId).then(res => {
        const { data } = res;
        this.riskList = data;
        console.log(data);
      })
    },
    handleTabRoute(tab, event) {
      this.$router.push(`/projectInfo/${tab.name}`);
    },
    handleDelete(row) {
      this.$confirm("确认删除吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.deleteRisk(row.riskID);
        })
        .catch(() => {});
    },
    handlePass(row) {
      this.$confirm("确认已解决吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.solveRisk(row.riskID);
        })
        .catch(() => {});
    },
    handleAddRisk() {
      this.getMemberList();
      this.addFormVisible = true;
      this.addForm = {};
      this.dialogTitle = "登记风险";
    },
    importProject(row) {
      this.getMemberList();
      this.addFormVisible = true;
      this.addForm = { ...row };
      this.dialogTitle = "登记风险";
    },
    handleSubmit() {
      if (this.dialogTitle === "登记风险") {
        this.addRisk();
      } else if (this.dialogTitle === "编辑风险") {
        this.updateRisk();
      }
    },
    handleEdit(row) {
      this.getMemberList();
      this.addFormVisible = true;
      this.addForm = { ...row };
      this.dialogTitle = "编辑风险";
    },
    handleImportTypeChange() {
      if (this.importForm.importType === "标准风险库") {
        getRiskTemplates().then(res => {
          const { data } = res;
          this.templateList = data;
        })
      } else {
        this.getProjectList();
        this.templateList = [];
      }
    },
    getProjectRiskList() {
      getRiskTemplatesByProjectID(this.importForm.importProject).then(res => {
        const { data } = res;
        this.templateList = data;
      })
    },
    addRisk() {
      this.addForm.projectID = this.$store.state.project.currentProjectId;
      addRisk(this.addForm).then(res => {
        this.addFormVisible = false;
        this.getRisk();
      })
    },
    updateRisk() {
      updateRiskByRiskID(this.addForm).then(res => {
        this.addFormVisible = false;
        this.getRisk();
      })
    },
    getMemberList() {
      getMembers(this.$store.state.project.currentProjectId, -1).then(res => {
        const { data } = res;
        this.userList = data;
      })
    },
    solveRisk(riskID) {
      solveRisk(riskID).then(res => {
        this.getRisk();
      })
    },
    deleteRisk(riskID) {
      deleteRisk(riskID).then(res => {
        this.getRisk();
      })
    },
    getProjectList() {
      getProjectList("", -1).then(res => {
        const { data } = res;
        this.projectList = data;
      })
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
}
</style>
