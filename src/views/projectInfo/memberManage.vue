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
        <el-tabs type="card" @tab-click="handleRoleTabChange">
          <el-tab-pane :label="'项目成员('+memberCountByRole[0]+')'" ></el-tab-pane>
          <el-tab-pane :label="'项目经理('+memberCountByRole[1]+')'"></el-tab-pane>
          <el-tab-pane :label="'QA('+memberCountByRole[2]+')'"></el-tab-pane>
          <el-tab-pane :label="'QALeader('+memberCountByRole[3]+')'"></el-tab-pane>
          <el-tab-pane :label="'开发('+memberCountByRole[4]+')'"></el-tab-pane>
          <el-tab-pane :label="'开发Leader('+memberCountByRole[5]+')'"></el-tab-pane>
          <el-tab-pane :label="'EPG('+memberCountByRole[6]+')'"></el-tab-pane>
        </el-tabs>
        <el-table :data="displayedMemberList" border style="width: 100%">
          <el-table-column prop="memberName" label="用户名" width="200" />
          <el-table-column prop="memberMail" label="邮箱" />
          <el-table-column prop="memberRoleString" label="角色" width="200" />
          <el-table-column prop="superiorName" label="项目上级" width="200" />
          <el-table-column fixed="right" label="操作" width="140">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteMember(scope.row)"
                type="text"
                size="small"
              >删除</el-button>
              <el-button
                type="text"
                size="small"
                @click.native="handleChangeSuperior(scope.row)">
                编辑上级
              </el-button>
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
          <el-form-item label="添加成员">
            <el-select
              v-model="addUserFrom.userID"
              filterable
              remote
              reserve-keyword
              placeholder="请搜索账号"
              :loading="loading"
              style="width: 100%"
            >
              <el-option
                v-for="item in addUserList"
                :key="item.userId"
                :label="item.userName+'-'+item.userId"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item label="角色">-->
<!--            <el-select v-model="addUserFrom.memberRole" placeholder="请选择角色">-->
<!--              <el-option v-for="item in memberRoleList" :key="item" :label="item" :value="item"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addUserFromVisible = false">取消</el-button>
        <el-button type="primary" @click="addMember">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑上级" :visible.sync="changeSuperiorVisible">
      <el-form :model="changeSuperiorForm" label-width="100px" label-position="center">
        <el-row>
          <el-form-item label="选择上级">
            <el-select
              v-model="changeSuperiorForm.superiorID"
              filterable
              remote
              reserve-keyword
              placeholder="请搜索账号"
              :loading="loading"
              style="width: 100%"
            >
              <el-option
                v-for="item in memberList"
                :key="item.memberID"
                :label="item.memberName+'-'+item.memberID"
                :value="item.memberID"
              ></el-option>
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="角色">-->
          <!--            <el-select v-model="addUserFrom.memberRole" placeholder="请选择角色">-->
          <!--              <el-option v-for="item in memberRoleList" :key="item" :label="item" :value="item"></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="changeSuperiorVisible = false">取消</el-button>
        <el-button type="primary" @click="changeSuperior">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {addMember, addMemberRole, changeMemberSuperior, deleteMemberRole, getMembers} from "@/api/Member";
import {getAllUser} from "@/api/user";

export default {
  name: "AddProject",
  data() {
    return {
      activeTabName: "memberManage",
      displayedMemberList: [],
      memberList: [
        {
          memberName: "张三",
          memberMail: "839234349@qq.com",
          memberRoleString: "EPG",
          superiorName: "李四"
        },
        {
          memberName: "张三",
          memberMail: "839234349@qq.com",
          memberRoleString: "EPG",
          superiorName: "李四"
        },
        {
          memberName: "张三",
          memberMail: "839234349@qq.com",
          memberRoleString: "EPG",
          superiorName: "李四"
        },
        {
          memberName: "张三",
          memberMail: "839234349@qq.com",
          memberRoleString: "EPG",
          superiorName: "李四"
        }
      ],
      memberListByRole: [],
      memberCountByRole: [0, 0, 0, 0, 0, 0, 0],
      allUsers: [
        { userId: "b6703879-e1e2-499c-8ffe-d8b29f71f156", userName: "tester" }
      ],
      addUserList: [
        { userId: "b6703879-e1e2-499c-8ffe-d8b29f71f156", userName: "tester" }
      ],
      options: [],
      value: [],
      list: [],
      loading: false,
      addUserFromVisible: false,
      addUserFrom: {
        userID: null,
        memberRole: null
      },
      changeSuperiorVisible: false,
      changeSuperiorForm: {
        superiorID: null,
        memberID: null
      },
      memberRoleList: ["QA", "QALeader", "开发", "开发Leader", "EPG"],
      memberRoleTypeList: ["项目经理", "QA", "QALeader", "开发", "开发Leader", "EPG"],
      currentTab: "0"
    };
  },
  created() {
    this.getMembers();
  },
  mounted() {
    // this.list = this.states.map(item => {
    //   return { value: `value:${item}`, label: `label:${item}` };
    // });
  },
  methods: {
    getMembers() {
      getMembers(this.$store.state.project.currentProjectId, -1).then(res => {

        const { data } = res;
        for (let i = 0; i < data.length; i++) {
          const { memberRole } = data[i];
          let roleString = "";
          for (let j = 0; j < memberRole.length; j++) {
            roleString = roleString + this.memberRoleTypeList[ memberRole[j] ];
            if (j !== memberRole.length - 1) {
              roleString = roleString + "、";
            }
          }
          data[i].memberRoleString = roleString;
        }
        this.memberList = data;
        this.displayedMemberList = data;

        this.memberCountByRole = [];
        this.memberCountByRole.push(this.memberList.length);
        this.memberListByRole = [];
        for (let i = 0; i < this.memberRoleTypeList.length; i++) {
          let members = [];
          for (const member of this.memberList) {
            if (member.memberRole.indexOf(i) > -1) {
              members.push(member);
            }
          }
          this.memberListByRole.push(members);
          this.memberCountByRole.push(members.length);
        }

        this.showCurrentMemberList();
      })
    },
    showCurrentMemberList() {
      if (this.currentTab === "0"){  //项目成员
        this.displayedMemberList = this.memberList;
      } else {
        this.displayedMemberList = this.memberListByRole[this.currentTab - 1];
      }
    },
    handleRoleTabChange(tab) {
      this.currentTab = tab.index;
      this.showCurrentMemberList();
    },
    handleTabRoute(tab, event) {
      this.$router.push(`/projectInfo/${tab.name}`);
    },
    handleAddUser() {
      if (this.currentTab === "0") { //项目成员
        this.getAllUser();
      } else {
        this.addUserList = this.memberList.map(member => {
          return {
            userId: member.memberID,
            userName: member.memberName
          }
        });
      }
      this.addUserFromVisible = true;
      this.addUserFrom = {
        userID: null,
        memberRole: null
      };
    },
    addMember() {
      if (this.currentTab === "0") {
        addMember(this.$store.state.project.currentProjectId, this.addUserFrom.userID).then(res => {
          this.getMembers();
          this.addUserFromVisible = false;
        })
      } else {
        addMemberRole(
          this.$store.state.project.currentProjectId,
          this.addUserFrom.userID,
          this.currentTab-1).then(res => {
          this.getMembers();
          this.addUserFromVisible = false;
        })
      }
    },
    getAllUser() {
      getAllUser().then(res => {
        const { data } = res;
        this.allUsers = data;
        this.addUserList = this.allUsers;
      })
    },
    deleteMember(row) {
      if (this.currentTab === "0") {

      } else {
        deleteMemberRole(
          this.$store.state.project.currentProjectId,
          row.memberID,
          this.currentTab-1)
          .then(res => {
          this.getMembers();
        })
      }
    },
    handleChangeSuperior(row) {
      this.changeSuperiorVisible = true;
      this.changeSuperiorForm = {
        superiorID: null,
        memberID: row.memberID
      }
    },
    changeSuperior() {
      changeMemberSuperior(
        this.$store.state.project.currentProjectId,
        this.changeSuperiorForm.memberID,
        this.changeSuperiorForm.superiorID)
        .then(res => {
          this.changeSuperiorVisible = false;
          this.getMembers();
        })
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
