<template>
  <div class="dashboard-container">
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabRoute">
      <el-tab-pane label="基本信息" name="basicInfo"></el-tab-pane>
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
            <el-button type="primary" icon="el-icon-download" style="float:right">导入风险</el-button>
          </el-col>
        </el-row>
        <el-table :data="riskList" border style="width: 100%" @row-click="handleEdit">
          <el-table-column prop="riskID" label="风险ID" width="140" />
          <el-table-column prop="riskContent" label="风险描述" />
          <el-table-column prop="riskType" label="类型" width="120" />
          <el-table-column prop="riskManager" label="责任人" width="140" />
          <el-table-column prop="riskLevel" label="级别" width="120" />
          <el-table-column prop="riskImpact" label="影响度" width="140">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.riskStatus === '已解决'">已解决</el-tag>
              <el-tag type="danger" v-else>处理中</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="handleDelete(scope.$index)"
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
            <el-input v-model="addForm.riskContent"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="风险类型">
              <el-select v-model="addForm.riskType" placeholder="请选择">
                <el-option v-for="item in riskTypeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险跟踪频度">
              <el-input v-model="addForm.riskRate" type="number">
                <template slot="append">天/次</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="风险级别">
              <el-select v-model="addForm.riskLevel" placeholder="请选择">
                <el-option v-for="item in riskLevelList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险影响度">
              <el-select v-model="addForm.riskImpact" placeholder="请选择">
                <el-option v-for="item in riskLevelList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="责任人">
              <el-select v-model="addForm.riskManager" placeholder="请选择责任人">
                <el-option v-for="item in userList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险相关者">
              <el-select v-model="addForm.riskUser" placeholder="请选择风险相关者">
                <el-option v-for="item in userList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="风险应对策略">
            <el-input v-model="addForm.rickSolution" type="textarea" rows="4"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTabName: "riskManagement",
      riskList: [
        {
          riskID: "00123",
          riskContent: "风险描述书aaaaaa",
          riskType: "项目风险",
          riskManager: "小刘",
          riskLevel: "中",
          riskImpact: "高",
          riskStatus: "处理中"
        },
        {
          riskID: "00123",
          riskContent: "风险描述书bbbbbb",
          riskType: "商业风险",
          riskManager: "小刘",
          riskLevel: "中",
          riskImpact: "低",
          riskStatus: "已解决"
        },
        {
          riskID: "00123",
          riskContent: "风险描述书ccccc",
          riskType: "技术风险",
          riskManager: "小刘",
          riskLevel: "低",
          riskImpact: "高",
          riskStatus: "处理中"
        }
      ],
      riskTypeList: ["商业风险", "项目风险", "技术风险"],
      userList: ["小明", "小刘", "小五"],
      riskLevelList: ["高", "中", "低"],
      dialogTitle: "登记风险",
      addFormVisible: false,
      addForm: {
        riskContent: "",
        riskType: "",
        riskRate: "",
        riskLevel: "",
        riskImpact: "",
        riskManager: "",
        riskUser: "",
        rickSolution: ""
      }
    };
  },
  methods: {
    handleTabRoute(tab, event) {
      this.$router.push(`/projectInfo/${tab.name}`);
    },
    handleDelete(index) {
      this.$confirm("确认删除吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.riskList.splice(index, 1);
        })
        .catch(() => {});
    },
    handleAddRisk() {
      this.addFormVisible = true;
      this.addForm = {};
      this.dialogTitle = "登记风险";
    },
    addSubmit() {
      this.addFormVisible = false;
    },
    handleEdit(row) {
      this.addFormVisible = true;
      this.addForm = { ...row };
      this.dialogTitle = "编辑风险";
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
}
.btn-text-red:focus,
.btn-text-red:hover {
  color: #f78989;
}
</style>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
}
</style>