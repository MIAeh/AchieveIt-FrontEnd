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
              <el-form-item label="项目名称">
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
              <el-form-item label="项目上级">
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
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
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
        languages: "",
        frameworks: ""
      },
      languagesList: ["Java", "C", "C++"],
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
