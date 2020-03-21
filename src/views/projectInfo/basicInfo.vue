<template>
  <div class="dashboard-container">
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabRoute">
      <el-tab-pane label="基本信息" name="basicInfo">
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
            <el-button type="primary" @click="updateProjectInfo" style="float:right" v-show="!editMode">保存</el-button>
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
                    <el-input v-model="form.projectClientID" :disabled="true" style="width: 100%"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="接口人">
                    <el-input
                      v-model="form.projectClientContactName"
                      :disabled="true"
                      style="width: 100%"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="公司名称">
                    <el-input v-model="form.projectClientCompany" :disabled="true" style="width: 100%"></el-input>
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
                    v-model="form.projectStartDate"
                    style="width: 100%"
                    :disabled="editMode"
                  ></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="form.projectEndDate"
                    style="width: 100%"
                    :disabled="editMode"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="开发语言">
                    <el-select
                      v-model="form.projectLanguages"
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
                    <el-input type="textarea" v-model="form.projectFrameworks" :disabled="editMode"></el-input>
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
                    <el-input type="textarea" v-model="milestone.milestoneContent" :disabled="editMode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="0" :prop="'projectMilestones.' + index + '.time'">
                    <el-date-picker
                      type="date"
                      placeholder="选择日期"
                      v-model="milestone.milestoneDate"
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
      <el-tab-pane label="功能列表" name="functionList">
      </el-tab-pane>
      <el-tab-pane label="成员管理" name="memberManage">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {getProjectInfo, updateProjectInfo} from "@/api/project";

export default {
  name: "BasicInfo",
  data() {
    return {
      activeTabName: 'basicInfo',
      form: {
        projectID: "",
        projectName: "",
        projectClientID: "",
        projectClientContactName: "",
        projectClientCompany: "",
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
      ]
    };
  },
  created() {
    this.getProjectInfo();
  },
  mounted() {
    this.list = this.states.map(item => {
      return { value: `value:${item}`, label: `label:${item}` };
    });
  },
  methods: {
    getProjectInfo() {
      this.form.projectID = this.$store.state.project.currentProjectId;
      getProjectInfo(this.form.projectID).then(response => {
        const { data } = response;
        this.form = data;
        console.log(data)
      })
    },
    updateProjectInfo() {
      console.log(this.form);
      updateProjectInfo(this.form).then( (response) => {
        this.$router.push("/projectList");
      })
    },
    handleTabRoute(tab, event) {
      this.$router.push(`/projectInfo/${tab.name}`)
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
