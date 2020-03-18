<template>
  <div class="dashboard-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
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
                  :remote-method="remoteMethod"
                  :loading="loading"
                  @change="handleProjectID"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
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
                <el-input v-model="form.clinet_id" :readonly="true"></el-input>
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
            </el-col>
          </el-row>
          <el-form-item label="起止时间" prop="startDate">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.startDate"
                style="width: 100%"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11" prop="endDate">
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
              <el-form-item label="开发语言" prop="languages">
                <el-select v-model="form.languages" multiple style="width: 100%" placeholder="请选择">
                  <el-option v-for="item in languagesList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开发框架" prop="frameworks">
                <el-input type="textarea" v-model="form.frameworks"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button @click="onSubmit">取消</el-button>
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
                :prop="'projectMilestones.' + index + '.contents'"
                :rules="{
              required: true, message: '内容不能为空', trigger: 'blur'
            }"
              >
                <el-input type="textarea" v-model="milestone.contents"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label-width="0"
                :prop="'projectMilestones.' + index + '.time'"
                :rules="{
              required: true, message: '时间不能为空', trigger: 'blur'
            }"
              >
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="milestone.time"
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
    </el-form>
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
      languagesList: ["Java", "C", "C++", "JavaScript", "Swift", "Python", "PHP", "Go"],
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
        startDate: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        endDate: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        languages: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个开发语言",
            trigger: "change"
          }
        ],
        frameworks: [
          { required: true, message: "请填写开发框架", trigger: "blur" }
        ],
        projectMilestones: [
          { required: true, message: "请填写开发框架", trigger: "blur" }
        ]
      }
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
