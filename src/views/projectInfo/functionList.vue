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
            <el-form-item label="一级父功能">
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
            <el-form-item label="二级父功能">
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
import { createFeature, deleteFeature, getFeature } from "@/api/feature";
import EleImport from "vue-ele-import";

export default {
  name: "AddProject",
  components: {
    EleImport
  },
  data() {
    return {
      activeTabName: "functionList",
      functions: [],
      importForm: {
        // 弹窗的标题
        title: "导入功能列表",
        // 提示信息
        tips: ["名字必填", "年龄必填", "年龄请填写数字"],
        // 假如数据库中是`name`字段, 而Excel模板列是`名字`, 就需要写成 name: '名字'
        // ele-import 内部会抛弃非定义在fields里的列
        fields: {
          name: "名字",
          age: "年龄",
          city: "所在城市"
        },
        // formatter起到替换数据的作用
        formatter: {
          // 可以是对象, 在发送请求时, '深圳' 将被替换成 1, '广州' 被替换成 2
          city: {
            1: "深圳",
            2: "广州"
          },
          // 可以是函数, 在发送请求时, `age` 将加1, 例如 原数据是 19 -> 20
          age: function(value, row) {
            return value + 1;
          }
        },
        // 附加数据, 在每条记录上都会加这两个字段和值
        append: {
          company: "腾讯",
          leader: "小马哥"
        },
        // 参数校检, 和 element-ui 中 form表单中传递的rules一样, 都是使用的 async-validator 库
        // https://element.eleme.cn/#/zh-CN/component/form#biao-dan-yan-zheng
        rules: {
          name: { type: "string", required: true, message: "名字必填" },
          age: [
            { type: "number", message: "年龄必须为数字" },
            { required: true, message: "年龄必须填写" }
          ]
        },
        // Excel模板下载地址
        // 注意, 只能是.xlsx的文件, .xls或者.cvs都会报错
        filepath:
          "https://raw.githubusercontent.com/dream2023/vue-ele-import/master/public/user.xlsx",
        // 控制弹窗, 和dialog的visible一样
        // https://element.eleme.cn/#/zh-CN/component/dialog
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
        featureName: [{ required: true, message: "请输入标题" }]
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
      createFeature(this.newFunction).then(res => {
        this.createFunctionDialogVisible = false;
        this.getFeature();
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
      // 演示代码
      // 1、如果没有针对ele-import做过接口约定, 可以采用如下形式:
      // try {
      //   const res = await axios.post('/user', data)
      //   return Promise.resolve()
      // } catch (error) {
      //   // error经过一系列转化, 转为
      //   const errorData = this.getErrorMessage(error)
      //   {0:{ age: '年龄为数字', city: '城市必填'}, 2:{ age: '年龄为数字'} } // 0 和 2 分别是行号
      //   return Promise.reject(errorData)
      // }
      // 2、如果针对ele-import做过接口约定, 当校检错误时, 后端返回的 error 就是上述错误形式, 则可直接
      // return axios.post('/user', data)
      // 总结: 无论如何总要返回一个Promise对象
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
        const tHeader = [ "项目ID","功能ID", "标题", "功能描述"];
        const filterVal = [
          "projectId",
          "featureId",
          "featureName",
          "featureDescription"
        ];
        const list = this.functions;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '功能列表',
          autoWidth: true,
          bookType: 'xlsx'
        });
        this.downloadLoading = false;
      });
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
