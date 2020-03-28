<template>
  <div class="dashboard-container">
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabRoute">
      <el-tab-pane label="基本信息" name="basicInfo"></el-tab-pane>
      <el-tab-pane label="功能列表" name="functionList"></el-tab-pane>
      <el-tab-pane label="成员管理" name="memberManage"></el-tab-pane>
      <el-tab-pane label="权限管理" name="authorityManage">
        <el-row class="dashboard-row">
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加成员权限</el-button>
          </el-col>
        </el-row>
        <el-collapse v-model="activeCollapseNames">
          <el-collapse-item title="Git权限" name="1">
            <div class="tip">允许成员读写项目Git库</div>
            <div v-for="(item,index) in userListGit" :key="index" class="text item">
              {{item.memberName}}，{{item.memberRoleString}}，{{item.memberMail}}
              <el-button type="text" class="btn-text-red" @click="handleDelete('Git', item.memberID)">删除</el-button>
            </div>
          </el-collapse-item>
          <el-collapse-item title="文件服务器权限" name="2">
            <div class="tip">允许成员读写项目文件服务器</div>
            <div v-for="(item,index) in userListFile" :key="index" class="text item">
              {{item.memberName}}，{{item.memberRoleString}}，{{item.memberMail}}
              <el-button type="text" class="btn-text-red" @click="handleDelete('File', item.memberID)">删除</el-button>
            </div>
          </el-collapse-item>
          <el-collapse-item title="邮件通知权限" name="3">
            <div class="tip">管理成员接收通知邮件权限</div>
            <div v-for="(item,index) in userListMail" :key="index" class="text item">
              {{item.memberName}}，{{item.memberRoleString}}，{{item.memberMail}}
              <el-button type="text" class="btn-text-red" @click="handleDelete('Mail', item.memberID)">删除</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="工时管理" name="workHour"></el-tab-pane>
      <el-tab-pane label="设备列表" name="deviceList"></el-tab-pane>
      <el-tab-pane label="风险管理" name="riskManagement"></el-tab-pane>
    </el-tabs>

    <el-dialog title="添加成员权限" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="100px" label-position="center">
        <el-row>
          <el-col :span="12">
            <el-form-item label="权限类别">
              <el-select v-model="addForm.type" placeholder="请选择">
                <el-option v-for="item in typeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成员选择">
              <el-select v-model="addForm.users" multiple placeholder="请选择">
                <el-option
                  v-for="item in allMemberList"
                  :key="item.memberID"
                  :label="item.memberName"
                  :value="item.memberID"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addAuthority, deleteAuthority, getAllMembersByAuthority} from "@/api/authority";
import {getMembers} from "@/api/Member";

export default {
  data() {
    return {
      activeTabName: "authorityManage",
      activeCollapseNames: ["1", "2", "3"],
      addFormVisible: false,
      addForm: {
        type: "",
        users: []
      },
      typeList: ["Git权限", "文件服务器权限", "邮件通知权限"],
      allMemberList: [],
      userListGit: [
        {
          memberName: "小李",
          memberRoleString: "项目经理",
          memberMail: "12345678@qq.com"
        },
        {
          memberName: "小六",
          memberRoleString: "开发",
          memberMail: "12345678@qq.com"
        },
        {
          memberName: "小明",
          memberRoleString: "QA",
          memberMail: "12345678@qq.com"
        }
      ],
      userListFile: [
        {
          memberName: "小李",
          memberRoleString: "项目经理",
          memberMail: "12345678@qq.com"
        },
        {
          memberName: "小六",
          memberRoleString: "开发",
          memberMail: "12345678@qq.com"
        },
        {
          memberName: "小明",
          memberRoleString: "QA",
          memberMail: "12345678@qq.com"
        }
      ],
      userListMail: [
        {
          memberName: "小李",
          memberRoleString: "项目经理",
          memberMail: "12345678@qq.com"
        },
        {
          memberName: "小六",
          memberRoleString: "开发",
          memberMail: "12345678@qq.com"
        },
        {
          memberName: "小明",
          memberRoleString: "QA",
          memberMail: "12345678@qq.com"
        }
      ],
      memberRoleTypeList: ["项目经理", "QA", "QALeader", "开发", "开发Leader", "EPG"]
    };
  },
  created() {
    this.getAllAuthority();
    this.getAllMembers();
  },
  methods: {
    getAllMembers() {
      getMembers(this.$store.state.project.currentProjectId, -1).then(res => {
        const { data } = res;
        this.allMemberList = data.map( member => this.convertRoleToRoleString(member) );
      })
    },
    getAllAuthority() {
      getAllMembersByAuthority(this.$store.state.project.currentProjectId).then(res => {
        const { data } = res;
        this.userListFile = data.file.map( member => this.convertRoleToRoleString(member) );
        this.userListGit = data.git.map( member => this.convertRoleToRoleString(member) );
        this.userListMail = data.mail.map( member => this.convertRoleToRoleString(member) );
      })
    },
    convertRoleToRoleString(member) {
      const { memberRole } = member;
      let roleString = "";
      for (let j = 0; j < memberRole.length; j++) {
        roleString = roleString + this.memberRoleTypeList[ memberRole[j] ];
        if (j !== memberRole.length - 1) {
          roleString = roleString + "、";
        }
      }
      member.memberRoleString = roleString;
      return member
    },
    handleTabRoute(tab, event) {
      this.$router.push(`/projectInfo/${tab.name}`);
    },
    handleAdd() {
      this.addFormVisible = true;
      this.addForm = {
        type: "",
        users: []
      };
    },
    handleSubmit() {
      addAuthority(
        this.$store.state.project.currentProjectId,
        this.addForm.users,
        this.addForm.type
      ).then(res => {
        this.getAllAuthority();
        this.addFormVisible = false;
      }).catch(error => {
          console.log(error.response)
        });
    },
    handleDelete(type, memberID) {
      this.$confirm("确认删除该用户权限吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          deleteAuthority(
            this.$store.state.project.currentProjectId,
            memberID,
            type
          ).then(res => {
            this.getAllAuthority();
          })
        })
        .catch(() => {});
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
  float: right;
}
.btn-text-red:focus,
.btn-text-red:hover {
  color: #f78989;
}
.el-collapse-item__header {
  font-size: 20px;
}
</style>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
}
.tip {
  color: #999;
}
.text {
  font-size: 14px;
}

.item {
  margin-top: 18px;
}
</style>
