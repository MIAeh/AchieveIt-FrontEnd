<template>
  <div class="dashboard-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>项目信息</span>
              <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="项目ID" prop="projectID">
                  <el-select
                    v-model="form.projectID"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请搜索项目ID"
                    :loading="loading"
                    @change="handleProjectIdChange"
                    style="width: 100%"
                  >
                    <el-option v-for="item in allProjectID" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目名称" prop="projectName">
                  <el-input v-model="form.projectName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="客户ID">
                  <el-input v-model="form.projectClientID" :readonly="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="接口人">
                  <el-input v-model="form.client_contact_name" :readonly="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="公司名称">
                  <el-input v-model="form.client_company" :readonly="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目上级" prop="projectMonitorID">
                  <el-select
                    v-model="form.projectMonitorID"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请搜索项目上级"
                    :loading="loading"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in allUsers"
                      :key="item.userId"
                      :label="item.userName+'-'+item.userId"
                      :value="item.userId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="起止时间" prop="projectStartDate">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="form.projectStartDate"
                  style="width: 100%"
                ></el-date-picker>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11" prop="projectEndDate">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="form.projectEndDate"
                  style="width: 100%"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开发语言" prop="projectLanguages">
                  <el-select
                    v-model="form.projectLanguages"
                    multiple
                    style="width: 100%"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in languagesList"
                      :key="item"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开发框架" prop="projectFrameworks">
                  <el-input type="textarea" v-model="form.projectFrameworks"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="primary" @click="createProject">立即创建</el-button>
              <el-button @click="cancel">取消</el-button>
            </el-form-item>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>里程碑</span>
              <el-button
                @click.prevent="addDomain"
                style="float: right; padding: 3px 0"
                type="text"
              >新增里程碑</el-button>
            </div>
            <el-row v-for="(milestone, index) in form.projectMilestones" :key="index">
              <el-col :span="14">
                <el-form-item
                  :label="'里程碑' + index"
                  :prop="'projectMilestones.' + index + '.milestoneContent'"
                  :rules="{
              required: true, message: '内容不能为空', trigger: 'blur'
            }"
                >
                  <el-input type="textarea" v-model="milestone.milestoneContent"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label-width="0"
                  :prop="'projectMilestones.' + index + '.milestoneDate'"
                  :rules="{
              required: true, message: '时间不能为空', trigger: 'blur'
            }"
                >
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="milestone.milestoneDate"
                    style="width: 100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button type="text" v-show="index" @click.prevent="removeDomain(milestone)">删除</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>功能列表</span>
          <el-button
            @click="showCreateFunctionDialog"
            style="float: right; padding: 3px 0"
            type="text"
          >新增功能</el-button>
        </div>
        <el-table
          :data="form.projectFunctions"
          border
          style="width: 100%"
          row-key="featureId"
          default-expand-all
          :tree-props="{children: 'allChildren'}"
        >
          <el-table-column prop="featureName" label="标题" width="140" />
          <el-table-column prop="featureLevel" label="功能类别" width="140">
            <template slot-scope="scope">{{ scope.row.featureLevel | formatFeatureLevel }}</template>
          </el-table-column>
          <el-table-column prop="featureDescription" label="功能描述" />
          <el-table-column prop="firstFather" label="一级父功能" width="140" />
          <el-table-column prop="secondFather" label="二级父功能" width="140" />
          <el-table-column fixed="right" label="操作" width="80">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteFeature(scope.$index)"
                type="text"
                size="small"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-form>

    <el-dialog title="新建功能" :visible.sync="createFunctionDialogVisible">
      <el-form
        ref="newFunction"
        :model="newFunction"
        label-position="top"
        :rules="newFunctionRules"
      >
        <el-form-item label="标题" prop="featureName">
          <el-input v-model="newFunction.featureName"></el-input>
        </el-form-item>
        <el-form-item label="所属项目" v-if="false">
          <el-input v-model="newFunction.projectId" :disabled="true"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="功能类型">
              <el-select v-model="newFunction.featureLevel" @change="handleFeatureLevelChange">
                <el-option
                  v-for="item in functionTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="一级父功能" prop="firstFather">
              <el-select :disabled="firstFatherDisabled" v-model="newFunction.firstFather">
                <el-option
                  v-for="item in firstFatherList"
                  :key="item.featureName"
                  :label="item.featureName"
                  :value="item.featureName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="二级父功能" prop="secondFather">
              <el-select :disabled="secondFatherDisabled" v-model="newFunction.secondFather">
                <el-option
                  v-for="item in secondFatherList"
                  :key="item.featureName"
                  :label="item.featureName"
                  :value="item.featureName"
                ></el-option>
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
  </div>
</template>

<script>
import { createProject, getProjectIDList } from "@/api/project";
import { getClientInfo } from "@/api/client";
import { getAllUser } from "@/api/user";

export default {
  name: "AddProject",
  data() {
    const validateFirstFather = (rule, value, callback) => {
      if (this.newFunction.featureLevel !== 0) {
        if (value === "") callback(new Error("请选择一级父功能"));
      }
      callback();
    };
    const validateSecondFather = (rule, value, callback) => {
      if (this.newFunction.featureLevel === 2) {
        if (value === "") callback(new Error("请选择二级父功能"));
      }
      callback();
    };
    return {
      form: {
        projectID: "",
        projectName: "",
        projectClientID: "",
        client_contact_name: "",
        client_company: "",
        projectStartDate: "",
        projectEndDate: "",
        projectMonitorID: "",
        projectManagerID: "",
        projectMilestones: [
          {
            milestoneDate: "",
            milestoneContent: ""
          }
        ],
        projectLanguages: [],
        projectFrameworks: "",
        projectFunctions: []
      },
      languagesList: [
        "Java",
        "C",
        "C++",
        "JavaScript",
        "Swift",
        "Python",
        "PHP",
        "Go"
      ],
      allUsers: [
        { userId: "b6703879-e1e2-499c-8ffe-d8b29f71f156", userName: "tester" }
      ],
      allProjectID: [],
      loading: false,
      rules: {
        projectID: [
          { required: true, message: "请选择项目ID", trigger: "change" }
        ],
        projectName: [
          { required: true, message: "请填写项目名称", trigger: "blur" }
        ],
        projectMonitorID: [
          { required: true, message: "请选择项目上级", trigger: "change" }
        ],
        projectStartDate: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        projectEndDate: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        projectLanguages: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个开发语言",
            trigger: "change"
          }
        ],
        projectFrameworks: [
          { required: true, message: "请填写开发框架", trigger: "blur" }
        ],
        projectMilestones: [
          { required: true, message: "请填写开发框架", trigger: "blur" }
        ]
      },
      newFunction: {
        featureName: "",
        featureLevel: 0,
        firstFather: "",
        secondFather: "",
        featureDescription: ""
      },
      newFunctionRules: {
        featureName: [{ required: true, message: "请输入标题" }],
        firstFather: [
          { validator: validateFirstFather, trigger: "change, blur" }
        ],
        secondFather: [
          { validator: validateSecondFather, trigger: "change, blur" }
        ]
      },
      createFunctionDialogVisible: false,
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
      ]
    };
  },
  created: function() {
    this.getProjectId();
    this.getAllUser();
  },
  filters: {
    formatFeatureLevel(val) {
      return val === 0
        ? "一级功能"
        : val === 1
        ? "二级功能"
        : val === 2
        ? "三级功能"
        : val;
    }
  },
  computed: {
    firstFatherDisabled() {
      return this.newFunction.featureLevel === 0;
    },
    secondFatherDisabled() {
      return (
        this.newFunction.featureLevel === 0 ||
        this.newFunction.featureLevel === 1
      );
    },
    firstFatherList() {
      return this.form.projectFunctions.filter(item => item.featureLevel == 0);
    },
    secondFatherList() {
      return this.form.projectFunctions.filter(item => item.featureLevel == 1);
    }
  },
  methods: {
    getProjectId() {
      getProjectIDList().then(response => {
        const { data } = response;
        this.allProjectID = data;
      });
    },
    getAllUser() {
      getAllUser().then(res => {
        const { data } = res;
        this.allUsers = data;
      });
    },
    createProject() {
      createProject(this.form).then(res => {
        console.log(res);
        // this.$router.push("/projectList");
      });
    },
    cancel() {
      this.$router.push("/projectList");
    },
    handleProjectIdChange(projectID) {
      const clientId = projectID.split("-")[1];
      getClientInfo(clientId).then(response => {
        const { data } = response;
        const { clientID, clientCompany, clientContactName } = data;
        this.form.projectClientID = clientID;
        this.form.client_company = clientCompany;
        this.form.client_contact_name = clientContactName;
      });
    },
    removeDomain(item) {
      let index = this.form.projectMilestones.indexOf(item);
      if (index !== -1) {
        this.form.projectMilestones.splice(index, 1);
      }
    },
    addDomain() {
      this.form.projectMilestones.push({
        time: "",
        contents: ""
      });
    },
    showCreateFunctionDialog() {
      this.newFunction = {
        featureName: "",
        featureLevel: 0,
        firstFather: "",
        secondFather: "",
        description: ""
      };
      this.createFunctionDialogVisible = true;
    },
    handleFeatureLevelChange(value) {
      if (value === 0) {
        this.newFunction.firstFather = "";
        this.newFunction.secondFather = "";
      } else if (value === 1) {
        this.newFunction.secondFather = "";
      } else {
      }
    },
    createFeature() {
      this.$refs.newFunction.validate(valid => {
        if (valid) {
          this.form.projectFunctions.push(this.newFunction);
          this.createFunctionDialogVisible = false;
        }
      });
    },
    deleteFeature(index) {
      this.form.projectFunctions.splice(index, 1);
    }
  }
};
</script>

<style lang="scss">
.box-card {
  margin: 10px;
}
</style>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
}
</style>
