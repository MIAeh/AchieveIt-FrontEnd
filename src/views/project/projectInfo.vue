<template>
  <div class="dashboard-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>项目信息</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目ID">
                <el-input
                  v-model="form.projectID"
                  :disabled="true"
                  style="width: 100%"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目名称">
                <el-input v-model="form.projectName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="客户ID">
                <el-input
                  v-model="form.client_id"
                  :disabled="true"
                  style="width: 100%"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接口人">
                <el-input
                  v-model="form.client_contact_name"
                  :disabled="true"
                  style="width: 100%"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="公司名称">
                <el-input
                  v-model="form.client_company"
                  :disabled="true"
                  style="width: 100%"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目上级">
                <el-input
                  v-model="form.projectMonitorID"
                  :disabled="true"
                  style="width: 100%"
                >
                </el-input>
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
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.endDate"
                style="width: 100%"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开发语言">
                <el-select v-model="form.languages" multiple style="width: 100%" placeholder="请选择">
                  <el-option v-for="item in languagesList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开发框架">
                <el-input type="textarea" v-model="form.frameworks"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button>取消</el-button>
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
          <el-form-item
            v-for="(milestone, index) in form.projectMilestones"
            :label="'里程碑' + index"
            :key="index"
          >
            <el-row :gutter="5">
              <el-col :span="10">
                <el-input type="textarea" v-model="milestone.contents"></el-input>
              </el-col>
              <el-col :span="8">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="milestone.time"
                  style="width: 100%"
                ></el-date-picker>
              </el-col>
              <el-col :span="2">
                <el-button v-show="index" @click.prevent="removeDomain(milestone)">删除</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>功能列表</span>
            <el-button
              @click.prevent="createFunction"
              style="float: right; padding: 3px 0"
              type="text"
            >新增功能</el-button>
          </div>
          <el-table
            :data="form.functions"
            border
            style="width: 100%"
            @row-click="handleClickFunction"
            row-key="id"
            default-expand-all
          >
            <el-table-column prop="id" label="ID" show-overflow-tooltip=true width="120" />
            <el-table-column prop="name" label="标题" show-overflow-tooltip=true />
            <el-table-column prop="project" label="所属项目" show-overflow-tooltip=true width="100"/>
          </el-table>
        </el-card>
      </el-col>
    </el-form>

    <el-dialog title="新建功能" :visible.sync="createFunctionDialogVisible">
      <el-form
        :model="newFunction"
        label-position="top"
        :rules="newFunctionRules"
      >
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
          projectID: "54321",
          projectName: "12345",
          client_id: "007",
          client_contact_name: "詹姆斯·邦德",
          client_company: "军情六处",
          startDate: "2020-03-14",
          endDate: "2020-03-14",
          projectMonitorID: "006",
          projectManagerID: "005",
          projectMilestones: [
            {
              time: "",
              contents: ""
            }
          ],
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
                      name: "三级功能1-2-1",
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
          languages: "",
          frameworks: ""
        },
        newFunction: {
          title: "",
          project: "",
          type: "",
          firstFather: "",
          secondFather: "",
          description: ""
        },
        newFunctionRules: {
          title: [
            {required: true, message: "请输入标题"}
          ]
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
        languagesList: ["Java", "C", "C++"],
        options: [],
        value: [],
        list: [],
        loading: false,
        createFunctionDialogVisible: false,
        functionInfoDialogVisible: false,
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
        ]
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
        this.form.client_id = (Math.random() * 1000).toFixed();
        const data = val.split(":");
        this.form.client_contact_name = data[0];
        this.form.client_company = data[1];
      },
      handleClickFunction() {
        this.functionInfoDialogVisible = true;
      },
      createFunction() {
        this.createFunctionDialogVisible = true;
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
