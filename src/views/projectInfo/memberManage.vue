<template>
  <div class="dashboard-container">
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabRoute">
      <el-tab-pane label="基本信息" name="basicInfo"></el-tab-pane>
      <el-tab-pane label="状态管理" name="stateManage"></el-tab-pane>
      <el-tab-pane label="功能列表" name="functionList"></el-tab-pane>
      <el-tab-pane label="成员管理" name="memberManage">
        <el-row class="dashboard-row">
          <el-col :span="4">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="handleAddUser"
              v-if="this.$store.state.user.memberRole.includes(0) && this.$store.state.project.status != 5"
            >{{ addUserFormTitle }}</el-button>
          </el-col>
        </el-row>
        <el-tabs type="card" @tab-click="handleRoleTabChange">
          <el-tab-pane :label="'项目成员('+memberCountByRole[0]+')'"></el-tab-pane>
          <el-tab-pane :label="'项目经理('+memberCountByRole[1]+')'"></el-tab-pane>
          <el-tab-pane :label="'QA('+memberCountByRole[2]+')'"></el-tab-pane>
          <el-tab-pane :label="'EPG('+memberCountByRole[3]+')'"></el-tab-pane>
          <el-tab-pane :label="'开发('+memberCountByRole[4]+')'"></el-tab-pane>
          <el-tab-pane :label="'开发Leader('+memberCountByRole[5]+')'"></el-tab-pane>
          <el-tab-pane :label="'测试('+memberCountByRole[6]+')'"></el-tab-pane>
          <el-tab-pane :label="'测试Leader('+memberCountByRole[7]+')'"></el-tab-pane>
          <el-tab-pane :label="'资产管理者('+memberCountByRole[8]+')'"></el-tab-pane>
        </el-tabs>
        <el-table :data="displayedMemberList" border style="width: 100%">
          <el-table-column prop="memberName" label="用户名" width="200" />
          <el-table-column prop="memberMail" label="邮箱" />
          <el-table-column prop="memberRoleString" label="角色" width="200" />
          <el-table-column prop="superiorName" label="项目上级" width="200" />
          <el-table-column fixed="right" label="操作" width="140"
                           v-if="this.$store.state.user.memberRole.includes(0) && this.$store.state.project.status != 5">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteMember(scope.row)"
                type="text"
                size="small"
                class="btn-text-red"
                v-if="currentTab != '1'"
              >删除</el-button>
              <el-button
                type="text"
                size="small"
                @click.native="handleChangeSuperior(scope.row)"
              >编辑上级</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="权限管理" name="authorityManage"></el-tab-pane>
      <el-tab-pane label="工时管理" name="workHour"></el-tab-pane>
      <el-tab-pane label="设备列表" name="deviceList"></el-tab-pane>
      <el-tab-pane label="风险管理" name="riskManagement"></el-tab-pane>
    </el-tabs>

    <el-dialog :title="addUserFormTitle" :visible.sync="addUserFormVisible">
      <el-form :model="addUserForm" label-width="100px" label-position="center">
        <el-row>
          <el-form-item label="添加成员">
            <el-select
              v-model="addUserForm.userID"
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
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addUserFormVisible = false">取消</el-button>
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
import {
  addMember,
  addMemberRole,
  changeMemberSuperior,
  deleteMember,
  deleteMemberRole,
  getMembers
} from "@/api/Member";
import { getAllUser } from "@/api/user";

export default {
  name: "AddProject",
  data() {
    return {
      activeTabName: "memberManage",
      displayedMemberList: [],
      memberList: [],
      memberListByRole: [],
      memberCountByRole: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      addUserFormTitle: "新增项目成员",
      allUsers: [],
      addUserList: [],
      loading: false,
      addUserFormVisible: false,
      addUserForm: {
        userID: null,
        memberRole: null
      },
      changeSuperiorVisible: false,
      changeSuperiorForm: {
        superiorID: null,
        memberID: null
      },
      memberRoleTypeList: [
        "项目经理",
        "QA",
        "EPG",
        "开发",
        "开发Leader",
        "测试",
        "测试Leader",
        "资产管理者"
      ],
      currentTab: "0"
    };
  },
  created() {
    this.getMembers();
  },
  methods: {
    getMembers() {
      getMembers(this.$store.state.project.currentProjectId, -1).then(res => {
        const { data } = res;
        for (let i = 0; i < data.length; i++) {
          const { memberRole } = data[i];
          let roleString = "";
          for (let j = 0; j < memberRole.length; j++) {
            roleString = roleString + this.memberRoleTypeList[memberRole[j]];
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
      });
    },
    showCurrentMemberList() {
      if (this.currentTab === "0") {
        //项目成员
        this.displayedMemberList = this.memberList;
      } else {
        this.displayedMemberList = this.memberListByRole[this.currentTab - 1];
      }
    },
    handleRoleTabChange(tab) {
      this.addUserFormTitle = "新增" + tab.label.split("(")[0];
      this.currentTab = tab.index;
      this.showCurrentMemberList();
    },
    handleTabRoute(tab, event) {
      this.$router.push(`/projectInfo/${tab.name}`);
    },
    handleAddUser() {
      if (this.currentTab === "0") {
        //项目成员
        this.getAllUser();
      } else {
        this.addUserList = this.memberList.map(member => {
          return {
            userId: member.memberID,
            userName: member.memberName
          };
        });
      }
      this.addUserFormVisible = true;
      this.addUserForm = {
        userID: null,
        memberRole: null
      };
    },
    addMember() {
      if (this.currentTab === "0") {
        addMember(
          this.$store.state.project.currentProjectId,
          this.addUserForm.userID
        ).then(res => {
          this.getMembers();
          this.addUserFormVisible = false;
        });
      } else {
        addMemberRole(
          this.$store.state.project.currentProjectId,
          this.addUserForm.userID,
          this.currentTab - 1
        ).then(res => {
          this.getMembers();
          this.addUserFormVisible = false;
        });
      }
    },
    getAllUser() {
      getAllUser().then(res => {
        const { data } = res;
        this.allUsers = data;
        this.addUserList = this.allUsers;
      });
    },
    deleteMember(row) {
      this.$confirm("确认删除吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          if (this.currentTab === "0") {
            deleteMember(
              this.$store.state.project.currentProjectId,
              row.memberID
            ).then(res => {
              this.getMembers();
            });
          } else {
            deleteMemberRole(
              this.$store.state.project.currentProjectId,
              row.memberID,
              this.currentTab - 1
            ).then(res => {
              this.getMembers();
            });
          }
        })
        .catch(() => {});
    },
    handleChangeSuperior(row) {
      this.changeSuperiorVisible = true;
      this.changeSuperiorForm = {
        superiorID: null,
        memberID: row.memberID
      };
    },
    changeSuperior() {
      changeMemberSuperior(
        this.$store.state.project.currentProjectId,
        this.changeSuperiorForm.memberID,
        this.changeSuperiorForm.superiorID
      ).then(res => {
        this.changeSuperiorVisible = false;
        this.getMembers();
      });
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
.btn-text-red {
  color: #f56c6c;
  float: none;
}
.btn-text-red:focus,
.btn-text-red:hover {
  color: #f78989;
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
