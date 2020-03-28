<template>
  <div class="dashboard-container">
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabRoute">
      <el-tab-pane label="基本信息" name="basicInfo"></el-tab-pane>
      <el-tab-pane label="功能列表" name="functionList">
        <el-row class="dashboard-row">
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-plus" @click="showCreateFunctionDialog">新建功能</el-button>
          </el-col>
          <el-col :span="3" :offset="14">
            <el-button type="primary" icon="el-icon-upload2" style="float:right">导入</el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" icon="el-icon-download" style="float:right">导出</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="functions"
          border
          style="width: 100%"
          @cell-click="handleClickFunction"
          row-key="featureId"
          default-expand-all
          :tree-props="{children: 'allChildren'}"
        >
          <el-table-column prop="featureId" label="ID" :show-overflow-tooltip="true" width="300" />
          <el-table-column prop="featureName" label="标题" :show-overflow-tooltip="true" />
          <!--          <el-table-column prop="project" label="所属项目" :show-overflow-tooltip="true" width="150" />-->
          <el-table-column fixed="right" label="操作" width="80">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteFeature(scope.row)"
                type="text"
                size="small"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="成员管理" name="memberManage"></el-tab-pane>
      <el-tab-pane label="权限管理" name="authorityManage"></el-tab-pane>
      <el-tab-pane label="工时管理" name="workHour"></el-tab-pane>
      <el-tab-pane label="设备列表" name="deviceList"></el-tab-pane>
      <el-tab-pane label="风险管理" name="riskManagement"></el-tab-pane>
    </el-tabs>

    <el-dialog title="新建功能" :visible.sync="createFunctionDialogVisible">
      <el-form :model="newFunction" label-position="top" :rules="newFunctionRules">
        <el-form-item label="标题" prop="featureName">
          <el-input v-model="newFunction.featureName"></el-input>
        </el-form-item>
        <el-form-item label="所属项目">
          <el-input v-model="newFunction.projectId" :disabled="true"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="功能类型">
              <el-select v-model="newFunction.featureLevel" @change="handleFeatureLevelChange">
                <el-option v-for="item in functionTypeList" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="一级父功能">
              <el-select :disabled="firstFatherDisabled" v-model="newFunction.firstFather">
                <el-option v-for="item in firstFatherList" :key="item.featureId" :label="item.featureName" :value="item.featureId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="二级父功能">
              <el-select :disabled="secondFatherDisabled" v-model="newFunction.secondFather">
                <el-option v-for="item in secondFatherList" :key="item.featureId" :label="item.featureName" :value="item.featureId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="newFunction.featureDescription"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="createFunctionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createFeature">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="功能信息" :visible.sync="functionInfoDialogVisible">
      <el-form :model="functionInfo">
        <el-form-item label="ID">
          <el-input v-model="functionInfo.featureId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="functionInfo.featureName"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="functionInfo.createTime" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="functionInfo.featureDescription"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="functionInfoDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createFunctionDialogVisible = false">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {createFeature, deleteFeature, getFeature} from "@/api/feature";

export default {
  name: "AddProject",
  data() {
    return {
      activeTabName: "functionList",
      functions: [
        {
          featureId: "54321-0001",
          featureName: "一级功能1",
          projectId: "54321",
          featureDescription: "",
          allChildren: [
            {
              featureId: "54321-0001-001",
              featureName: "二级功能1-1",
              projectId: "54321",
              featureDescription: ""
            },
            {
              featureId: "54321-0001-002",
              featureName: "二级功能1-2",
              projectId: "54321",
              featureDescription: "",
              allChildren: [
                {
                  featureId: "54321-0001-002-001",
                  featureName: "二级功能1-2-1",
                  projectId: "54321"
                }
              ]
            }
          ]
        },
        {
          featureId: "54321-0002",
          featureName: "一级功能2",
          projectId: "54321",
          featureDescription: ""
        },
        {
          featureId: "54321-0003",
          featureName: "一级功能3",
          projectId: "54321",
          featureDescription: ""
        }
      ],
      newFunction: {
        featureName: "",
        projectId: "",
        featureLevel: 0,
        firstFather: "",
        secondFather: "",
        featureDescription: ""
      },
      newFunctionRules: {
        featureName: [{ required: true, message: "请输入标题" }]
      },
      functionInfo: {
        featureId: "54321-0001",
        featureName: "一级功能1",
        projectId: "54321",
        createTime: "2020-03-14",
        featureDescription: "一级功能1的描述"
      },
      functionTypeList: [
        {
          label: "一级功能",
          value: 0
        },
        {
          label: "二级功能",
          value: 1
        },
        {
          label: "三级功能",
          value: 2
        }
      ],
      createFunctionDialogVisible: false,
      functionInfoDialogVisible: false
    };
  },
  computed: {
    firstFatherDisabled() {
      return this.newFunction.featureLevel === 0;
    },
    secondFatherDisabled() {
      return this.newFunction.featureLevel === 0 || this.newFunction.featureLevel === 1;
    },
    firstFatherList() {
      return this.functions;
    },
    secondFatherList() {
      if (this.functions !== null && this.functions !== undefined) {
        for (let i = 0; i < this.functions.length; i++) {
          if (this.functions[i].featureId === this.newFunction.firstFather) {
            return this.functions[i].allChildren;
          }
        }
      }
    }
  },
  created() {
    this.getFeature();
  },
  methods: {
    getFeature() {
      getFeature(this.$store.state.project.currentProjectId).then(res => {
        const { data } = res;
        this.functions = data;
      });
    },
    handleTabRoute(tab) {
      this.$router.push(`/projectInfo/${tab.name}`);
    },
    handleClickFunction(row, column) {
      this.functionInfo = row;
      if (column.label !== "操作") this.functionInfoDialogVisible = true;
    },
    showCreateFunctionDialog() {
      this.newFunction = {
        featureName: "",
        projectId: this.$store.state.project.currentProjectId,
        featureLevel: 0,
        firstFather: "",
        secondFather: "",
        description: ""
      };
      this.createFunctionDialogVisible = true;
    },
    createFeature() {
      createFeature(this.newFunction).then(res => {
        this.createFunctionDialogVisible = false;
        this.getFeature();
      })
    },
    deleteFeature(row) {
      deleteFeature(row.featureId).then(res => {
        this.getFeature();
      })
    },
    updateFeature() {

    },
    handleFeatureLevelChange(value) {
      if (value === 0) {
        this.newFunction.firstFather = "";
        this.newFunction.secondFather = "";
      } else if (value === 1) {
        this.newFunction.secondFather = "";
      }
    },
  }
};
</script>

<style lang="scss">
.dashboard {
  &-row {
    margin-bottom: 10px;
  }
}
.box-card-left {
  margin: 10px 10px 10px 0;
}
.box-card-right {
  margin: 10px 0 10px 10px;
}
</style>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
}
</style>
