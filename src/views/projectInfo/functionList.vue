<template>
  <div class="dashboard-container">
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabRoute">
      <el-tab-pane label="基本信息" name="basicInfo"></el-tab-pane>
      <el-tab-pane label="功能列表" name="functionList">
        <el-row class="dashboard-row">
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-plus" @click="createFunction">新建功能</el-button>
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
          row-key="id"
          default-expand-all
        >
          <el-table-column prop="id" label="ID" :show-overflow-tooltip="true" width="300" />
          <el-table-column prop="name" label="标题" :show-overflow-tooltip="true" />
          <el-table-column prop="project" label="所属项目" :show-overflow-tooltip="true" width="150" />
          <el-table-column fixed="right" label="操作" width="80">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, functions)"
                type="text"
                size="small"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="成员管理" name="memberManage"></el-tab-pane>
    </el-tabs>

    <el-dialog title="新建功能" :visible.sync="createFunctionDialogVisible">
      <el-form :model="newFunction" label-position="top" :rules="newFunctionRules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="newFunction.title"></el-input>
        </el-form-item>
        <el-form-item label="所属项目">
          <el-input v-model="newFunction.project" :disabled="true"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="功能类型">
              <el-select v-model="newFunction.type">
                <el-option v-for="item in functionTypeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="一级父功能">
              <el-select v-model="newFunction.firstFather">
                <el-option v-for="item in firstFatherList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="二级父功能">
              <el-select v-model="newFunction.secondFather">
                <el-option v-for="item in secondFatherList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="newFunction.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="createFunctionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createFunctionDialogVisible = false">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="功能信息" :visible.sync="functionInfoDialogVisible">
      <el-form :model="functionInfo">
        <el-form-item label="ID">
          <el-input v-model="functionInfo.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="functionInfo.title"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="functionInfo.createTime" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="functionInfo.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="functionInfoDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="functionInfoDialogVisible = false">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "AddProject",
  data() {
    return {
      activeTabName: "functionList",
      functions: [
        {
          id: "54321-0001",
          name: "一级功能1",
          project: "54321",
          children: [
            {
              id: "54321-0001-001",
              name: "二级功能1-1",
              project: "54321"
            },
            {
              id: "54321-0001-002",
              name: "二级功能1-2",
              project: "54321",
              children: [
                {
                  id: "54321-0001-002-001",
                  name: "二级功能1-2-1",
                  project: "54321"
                }
              ]
            }
          ]
        },
        {
          id: "54321-0002",
          name: "一级功能2",
          project: "54321"
        },
        {
          id: "54321-0003",
          name: "一级功能3",
          project: "54321"
        }
      ],
      newFunction: {
        title: "",
        project: "",
        type: "",
        firstFather: "",
        secondFather: "",
        description: ""
      },
      newFunctionRules: {
        title: [{ required: true, message: "请输入标题" }]
      },
      functionInfo: {
        id: "54321-0001",
        title: "一级功能1",
        project: "54321",
        createTime: "2020-03-14",
        description: "一级功能1的描述"
      },
      functionTypeList: ["一级功能", "二级功能", "三级功能"],
      firstFatherList: ["一级功能1", "一级功能2", "一级功能3"],
      secondFatherList: ["二级功能1-1", "二级功能1-2"],
      createFunctionDialogVisible: false,
      functionInfoDialogVisible: false
    };
  },
  methods: {
    handleTabRoute(tab, event) {
      this.$router.push(`/projectInfo/${tab.name}`);
    },
    handleClickFunction(row, column, event, cell) {
      if (column.label === "ID") this.functionInfoDialogVisible = true;
    },
    createFunction() {
      this.createFunctionDialogVisible = true;
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
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
