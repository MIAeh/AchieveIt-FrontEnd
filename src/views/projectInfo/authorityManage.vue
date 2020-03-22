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
              {{item.userName}}，{{item.userRole}}，{{item.userMail}}
              <el-button type="text" class="btn-text-red" @click="handleDelete('Git', index)">删除</el-button>
            </div>
          </el-collapse-item>
          <el-collapse-item title="文件服务器权限" name="2">
            <div class="tip">允许成员读写项目文件服务器</div>
            <div v-for="(item,index) in userListFile" :key="index" class="text item">
              {{item.userName}}，{{item.userRole}}，{{item.userMail}}
              <el-button type="text" class="btn-text-red" @click="handleDelete('File', index)">删除</el-button>
            </div>
          </el-collapse-item>
          <el-collapse-item title="邮件通知权限" name="3">
            <div class="tip">管理成员接收通知邮件权限</div>
            <div v-for="(item,index) in userListMail" :key="index" class="text item">
              {{item.userName}}，{{item.userRole}}，{{item.userMail}}
              <el-button type="text" class="btn-text-red" @click="handleDelete('Mail', index)">删除</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="工时管理" name="workHour"></el-tab-pane>
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
                <el-option v-for="item in userListGit" :key="item.userName" :label="item.userName" :value="item.userName"></el-option>
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
export default {
  data() {
    return {
      activeTabName: "authorityManage",
      activeCollapseNames: ["1", "2", "3"],
      addFormVisible: false,
      addForm: {
        type: "",
        users: ""
      },
      typeList: ["Git权限", "文件服务器权限", "邮件通知权限"],
      userListGit: [
        {
          userName: "小李",
          userRole: "项目经理",
          userMail: "12345678@qq.com"
        },
        {
          userName: "小六",
          userRole: "开发",
          userMail: "12345678@qq.com"
        },
        {
          userName: "小明",
          userRole: "QA",
          userMail: "12345678@qq.com"
        }
      ],
      userListFile: [
        {
          userName: "小李",
          userRole: "项目经理",
          userMail: "12345678@qq.com"
        },
        {
          userName: "小六",
          userRole: "开发",
          userMail: "12345678@qq.com"
        },
        {
          userName: "小明",
          userRole: "QA",
          userMail: "12345678@qq.com"
        }
      ],
      userListMail: [
        {
          userName: "小李",
          userRole: "项目经理",
          userMail: "12345678@qq.com"
        },
        {
          userName: "小六",
          userRole: "开发",
          userMail: "12345678@qq.com"
        },
        {
          userName: "小明",
          userRole: "QA",
          userMail: "12345678@qq.com"
        }
      ]
    };
  },
  methods: {
    handleTabRoute(tab, event) {
      this.$router.push(`/projectInfo/${tab.name}`);
    },
    handleAdd() {
      this.addFormVisible = true;
      this.addForm = {};
    },
    handleSubmit() {
      this.addFormVisible = false;
    },
    handleDelete(type, index) {
      this.$confirm("确认删除该用户权限吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          switch (type) {
            case "Git":
              this.userListGit.splice(index, 1);
              break;
            case "Mail":
              this.userListMail.splice(index, 1);
              break;
            case "File":
              this.userListFile.splice(index, 1);
              break;
          }
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