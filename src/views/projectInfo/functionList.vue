<template>
  <div class="dashboard-container">
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabRoute">
      <el-tab-pane label="基本信息" name="basicInfo"></el-tab-pane>
      <el-tab-pane label="状态管理" name="stateManage"></el-tab-pane>
      <el-tab-pane label="功能列表" name="functionList">
        <el-row class="dashboard-row">
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-plus" @click="showCreateFunctionDialog">新建功能</el-button>
          </el-col>
          <el-col :span="3" :offset="14">
            <ele-import
              :fields="importForm.fields"
              :filepath="importForm.filepath"
              :append="importForm.append"
              :formatter="importForm.formatter"
              :requestFn="requestFn"
              :rules="importForm.rules"
              :tips="importForm.tips"
              :title="importForm.title"
              :visible.sync="importForm.visible"
              @close="handleCloseImport"
              @finish="handleFinishImport"
            />
            <el-button
              type="primary"
              icon="el-icon-download"
              style="float:right"
              @click="importForm.visible = true"
            >导入</el-button>
          </el-col>
          <el-col :span="3">
            <el-button
              type="primary"
              icon="el-icon-upload2"
              style="float:right"
              @click="handleDownloadExcel"
            >导出</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="functions"
          border
          style="width: 100%"
          @cell-click="getFunctionInfo"
          row-key="featureId"
          default-expand-all
          :tree-props="{children: 'allChildren'}"
        >
          <el-table-column prop="featureId" label="ID" :show-overflow-tooltip="true" width="300" />
          <el-table-column prop="featureName" label="标题" :show-overflow-tooltip="true" />
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
      <el-form ref="newFunction" :model="newFunction" label-position="top" :rules="newFunctionRules">
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
                  :key="item.label"
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
                  :key="item.featureId"
                  :label="item.featureName"
                  :value="item.featureId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="二级父功能" prop="secondFather">
              <el-select :disabled="secondFatherDisabled" v-model="newFunction.secondFather">
                <el-option
                  v-for="item in secondFatherList"
                  :key="item.featureId"
                  :label="item.featureName"
                  :value="item.featureId"
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
import { createFeature, deleteFeature, getFeature, uploadFeatureList } from "@/api/feature";
import EleImport from "vue-ele-import";

export default {
  name: "AddProject",
  components: {
    EleImport
  },
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
      activeTabName: "functionList",
      functions: [],
      importForm: {
        title: "导入功能列表",
        tips: ["功能名称必填", "功能类型必填"],
        fields: {
          featureName: "*功能名称",
          featureDescription: "功能描述",
          featureLevel: "*功能类型（一/二/三级功能）",
          fatherFeatureName: "父功能名称（直系父功能）"
        },
        formatter: {
          featureLevel: {
            0: "一级功能",
            1: "二级功能",
            2: "三级功能"
          },
          firstFather: function(value, row) {
            return value + 1;
          }
        },
        append: {
          projectID: this.$store.state.project.currentProjectId
        },
        rules: {
          featureName: {
            type: "string",
            required: true,
            message: "功能名称必填"
          },
          featureLevel: [{ required: true, message: "功能类型必填" }]
        },
        filepath: "http://116.62.181.135:8080/achieveit/功能列表导入模版.xlsx",
        visible: false
      },
      newFunction: {
        featureName: "",
        projectId: "",
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
      functionInfo: {
        featureId: "",
        featureName: "",
        projectId: "",
        createTime: "",
        featureDescription: ""
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
      return (
        this.newFunction.featureLevel === 0 ||
        this.newFunction.featureLevel === 1
      );
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
    getFunctionInfo(row, column) {
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
      this.$refs.newFunction.validate(valid => {
        if (valid) {
          createFeature(this.newFunction).then(res => {
            this.createFunctionDialogVisible = false;
            this.getFeature();
          });
        }
      });
    },
    deleteFeature(row) {
      deleteFeature(row.featureId).then(res => {
        this.getFeature();
      });
    },
    updateFeature() {},
    handleFeatureLevelChange(value) {
      if (value === 0) {
        this.newFunction.firstFather = "";
        this.newFunction.secondFather = "";
      } else if (value === 1) {
        this.newFunction.secondFather = "";
      }
    },
    async requestFn(data) {
      console.log(data);
      // 演示代码
      // 1、如果没有针对ele-import做过接口约定, 可以采用如下形式:
      try {
        debugger
        const res = await uploadFeatureList({'data': data});
        return Promise.resolve()
      } catch (error) {
        // error经过一系列转化, 转为
        const errorData = this.getErrorMessage(error)
        // {0:{ age: '年龄为数字', city: '城市必填'}, 2:{ age: '年龄为数字'} } // 0 和 2 分别是行号
        return Promise.reject(errorData)
      }
      // 2、如果针对ele-import做过接口约定, 当校检错误时, 后端返回的 error 就是上述错误形式, 则可直接
      // return axios.post('/user', data)
      // 总结: 无论如何总要返回一个Promise对象
    },
    getErrorMessage() {

    },
    handleCloseImport() {
      console.log("弹窗关闭了~");
    },
    handleFinishImport() {
      console.log("导入完毕了~");
    },
    handleDownloadExcel() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "功能ID",
          "功能名称",
          "项目ID",
          "功能描述",
          "创建时间",
          "功能类型",
          "父功能名称",
          "父功能ID"
        ];
        const filterVal = [
          "featureId",
          "featureName",
          "projectId",
          "featureDescription",
          "createTime",
          "featureLevel",
          "fatherName",
          "fatherId"
        ];
        const list = this.treeToList(this.functions);
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "功能列表",
          autoWidth: true,
          bookType: "xlsx"
        });
        this.downloadLoading = false;
      });
    },
    treeToList(functions) {
      let queen = [];
      let out = [];
      queen = queen.concat(functions);
      while (queen.length) {
        let first = queen.shift();
        if (first.allChildren) {
          queen = queen.concat(first.allChildren);
          delete first["allChildren"];
        }

        out.push(first);
      }
      for (let index in out) {
        switch (out[index].featureLevel) {
          case 0:
            out[index].featureLevel = "一级功能";
            break;
          case 1:
            out[index].featureLevel = "二级功能";
            break;
          case 2:
            out[index].featureLevel = "三级功能";
            break;
        }
      }
      return out;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
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
