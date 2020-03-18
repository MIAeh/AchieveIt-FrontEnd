<template>
  <div class="dashboard-container">
    <el-tabs type="border-card">
      <el-tab-pane label="基本信息">
        <el-row>
          <el-col :span="4">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editMode = true"
              v-if="!editMode"
            >编辑模式</el-button>
            <el-button type="primary" icon="el-icon-view" @click="editMode = false" v-else>浏览模式</el-button>
          </el-col>
          <el-col :span="4" :offset="16">
            <el-button type="primary" @click="onSubmit" style="float:right" v-show="!editMode">保存</el-button>
          </el-col>
        </el-row>
        <el-form ref="form" :model="form" label-width="80px">
          <el-col :span="12">
            <el-card class="box-card-left">
              <div slot="header" class="clearfix">
                <span>项目信息</span>
              </div>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="项目ID">
                    <el-input v-model="form.projectID" :disabled="true" style="width: 100%"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目名称">
                    <el-input v-model="form.projectName" :disabled="editMode"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="客户ID">
                    <el-input v-model="form.client_id" :disabled="true" style="width: 100%"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="接口人">
                    <el-input
                      v-model="form.client_contact_name"
                      :disabled="true"
                      style="width: 100%"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="公司名称">
                    <el-input v-model="form.client_company" :disabled="true" style="width: 100%"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目上级">
                    <el-input v-model="form.projectMonitorID" :disabled="true" style="width: 100%"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="起止时间">
                <el-col :span="11">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="form.startDate"
                    style="width: 100%"
                    :disabled="editMode"
                  ></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="form.endDate"
                    style="width: 100%"
                    :disabled="editMode"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="开发语言">
                    <el-select
                      v-model="form.languages"
                      multiple
                      style="width: 100%"
                      :disabled="editMode"
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
                  <el-form-item label="开发框架">
                    <el-input type="textarea" v-model="form.frameworks" :disabled="editMode"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card-right">
              <div slot="header" class="clearfix">
                <span>里程碑</span>
                <el-button
                  @click.prevent="addDomain"
                  style="float: right; padding: 0"
                  type="text"
                  v-show="!editMode"
                >新增里程碑</el-button>
              </div>
              <el-row v-for="(milestone, index) in form.projectMilestones" :key="index">
                <el-col :span="14">
                  <el-form-item
                    :label="'里程碑' + index"
                    :prop="'projectMilestones.' + index + '.contents'"
                  >
                    <el-input type="textarea" v-model="milestone.contents" :disabled="editMode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="0" :prop="'projectMilestones.' + index + '.time'">
                    <el-date-picker
                      type="date"
                      placeholder="选择日期"
                      v-model="milestone.time"
                      :disabled="editMode"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="text"
                    v-show="index && !editMode"
                    @click.prevent="removeDomain(milestone)"
                  >删除</el-button>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="功能列表">
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
          :data="form.functions"
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
                @click.native.prevent="deleteRow(scope.$index, form.functions)"
                type="text"
                size="small"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="成员管理">
        <el-row class="dashboard-row">
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-plus" @click="handleAddUser">新增成员</el-button>
          </el-col>
        </el-row>
        <el-tabs type="card">
          <el-tab-pane label="项目成员(0)"></el-tab-pane>
          <el-tab-pane label="项目经理(0)"></el-tab-pane>
          <el-tab-pane label="QA(0)"></el-tab-pane>
          <el-tab-pane label="QALeader(0)"></el-tab-pane>
          <el-tab-pane label="开发(0)"></el-tab-pane>
          <el-tab-pane label="开发Leader(0)"></el-tab-pane>
          <el-tab-pane label="EPG(0)"></el-tab-pane>
        </el-tabs>
        <el-table :data="form.userList" border style="width: 100%">
          <el-table-column prop="userName" label="用户名" width="200" />
          <el-table-column prop="userMail" label="邮箱"/>
          <el-table-column prop="userType" label="角色" width="200" />
          <el-table-column prop="userManage" label="项目上级" width="200" />
          <el-table-column fixed="right" label="操作" width="140">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, form.userList)"
                type="text"
                size="small"
              >删除</el-button>
              <el-button type="text" size="small">编辑上级</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="新增成员" :visible.sync="addUserFromVisible">
      <el-form :model="addUserFrom" label-width="100px" label-position="center">
        <el-row>
          <el-form-item label="账号邀请">
            <el-select
              v-model="addUserFrom.userName"
              filterable
              remote
              reserve-keyword
              placeholder="请搜索账号"
              :remote-method="remoteMethod"
              :loading="loading"
              style="width: 100%"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="addUserFrom.userType" placeholder="请选择角色">
              <el-option v-for="item in userTypeList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addUserFromVisible = false">取消</el-button>
        <el-button type="primary" @click="addUserSubmit">提交</el-button>
      </div>
    </el-dialog>

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
      form: {
        projectID: "",
        projectName: "",
        clinet_id: "",
        client_contact_name: "",
        client_company: "",
        startDate: "",
        endDate: "",
        projectMonitorID: "",
        projectManagerID: "",
        projectMilestones: [
          {
            time: "",
            contents: ""
          }
        ],
        languages: [],
        frameworks: "",
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
        userList: [
          {
            userName: "张三",
            userMail: "839234349@qq.com",
            userType: "EPG",
            userManage: "李四"
          },
          {
            userName: "张三",
            userMail: "839234349@qq.com",
            userType: "EPG",
            userManage: "李四"
          },
          {
            userName: "张三",
            userMail: "839234349@qq.com",
            userType: "EPG",
            userManage: "李四"
          },
          {
            userName: "张三",
            userMail: "839234349@qq.com",
            userType: "EPG",
            userManage: "李四"
          }
        ]
      },
      editMode: true,
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
      options: [],
      value: [],
      list: [],
      loading: false,
      states: [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming"
      ],
      addUserFromVisible: false,
      addUserFrom: {
        userName: null,
        userType: null
      },
      userTypeList: ["QA", "QALeader", "开发", "开发Leader", "EPG"],
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
  mounted() {
    this.list = this.states.map(item => {
      return { value: `value:${item}`, label: `label:${item}` };
    });
  },
  methods: {
    onSubmit() {
      console.log("submit!");
      this.$router.push("/project");
    },
    handleProjectID(val) {
      this.form.clinet_id = (Math.random() * 1000).toFixed();
      const data = val.split(":");
      this.form.client_contact_name = data[0];
      this.form.client_company = data[1];
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
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    handleAddUser() {
      this.addUserFromVisible = true;
      this.addUserFrom = {};
    },
    addUserSubmit() {
      this.addUserFromVisible = false;
    },
    handleClickFunction(row, column, event, cell) {
      console.log(row);
      console.log(column);
      console.log(event);
      console.log(cell);
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
