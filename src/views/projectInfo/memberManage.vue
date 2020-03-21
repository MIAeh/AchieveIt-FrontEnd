<template>
  <div class="dashboard-container">
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabRoute">
      <el-tab-pane label="基本信息" name="basicInfo"></el-tab-pane>
      <el-tab-pane label="功能列表" name="functionList"></el-tab-pane>
      <el-tab-pane label="成员管理" name="memberManage">
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
        <el-table :data="userList" border style="width: 100%">
          <el-table-column prop="userName" label="用户名" width="200" />
          <el-table-column prop="userMail" label="邮箱" />
          <el-table-column prop="userType" label="角色" width="200" />
          <el-table-column prop="userManage" label="项目上级" width="200" />
          <el-table-column fixed="right" label="操作" width="140">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, userList)"
                type="text"
                size="small"
              >删除</el-button>
              <el-button type="text" size="small">编辑上级</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="权限管理" name="authorityManage"></el-tab-pane>
      <el-tab-pane label="工时管理" name="workHour"></el-tab-pane>
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
  </div>
</template>

<script>
export default {
  name: "AddProject",
  data() {
    return {
      activeTabName: "memberManage",
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
      userTypeList: ["QA", "QALeader", "开发", "开发Leader", "EPG"]
    };
  },
  mounted() {
    this.list = this.states.map(item => {
      return { value: `value:${item}`, label: `label:${item}` };
    });
  },
  methods: {
    handleTabRoute(tab, event) {
      this.$router.push(`/projectInfo/${tab.name}`);
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
