<template>
  <div class="dashboard-container">
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabRoute">
      <el-tab-pane label="基本信息" name="basicInfo"></el-tab-pane>
      <el-tab-pane label="状态管理" name="stateManage"></el-tab-pane>
      <el-tab-pane label="功能列表" name="functionList"></el-tab-pane>
      <el-tab-pane label="成员管理" name="memberManage"></el-tab-pane>
      <el-tab-pane label="权限管理" name="authorityManage"></el-tab-pane>
      <el-tab-pane label="工时管理" name="workHour"></el-tab-pane>
      <el-tab-pane label="设备列表" name="deviceList">
        <el-row class="dashboard-row">
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-plus" @click="handleAddDevice"
                       v-if="this.$store.state.user.memberRole.includes(7)">
              登记设备
            </el-button>
          </el-col>
        </el-row>
        <el-table :data="deviceList" border style="width: 100%">
          <el-table-column prop="deviceID" label="设备ID" />
          <el-table-column prop="deviceType" label="设备类别" width="200" />
          <el-table-column prop="userName" label="使用者" width="160" />
          <el-table-column prop="dueDate" label="设备使用期限" width="160" />
          <el-table-column prop="deviceStatus" label="设备状态" width="160">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.deviceStatus === 'Using'">使用中</el-tag>
              <el-tag type="info" v-else-if="scope.row.deviceStatus === 'Returned'">已归还</el-tag>
              <el-tag type="danger" v-else-if="scope.row.deviceStatus === 'Overdue'">已逾期</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120"
                           v-if="this.$store.state.user.memberRole.includes(7)">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="handleReturn(scope.row)"
                type="text"
                size="small"
                v-if="scope.row.deviceStatus !== 'Returned'"
              >归还</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="风险管理" name="riskManagement"></el-tab-pane>
    </el-tabs>

    <el-dialog title="登记设备" :visible.sync="addFromVisible">
      <el-form :model="addFrom" label-width="100px" label-position="center">
        <el-row>
          <el-form-item label="登记设备">
            <el-select
              v-model="addFrom.deviceID"
              filterable
              reserve-keyword
              placeholder="请搜索设备"
            >
              <el-option
                v-for="item in deviceSearchList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备使用者">
            <el-select v-model="addFrom.deviceUserID" placeholder="请选择设备使用者">
              <el-option v-for="item in memberList" :key="item.memberID" :label="item.memberName" :value="item.memberID"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备使用期限">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-model="addFrom.deviceDate" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFromVisible = false">取消</el-button>
        <el-button type="primary" @click="registerDevice">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getDeviceIDList, getDeviceList, registerDevice, returnDevice} from "@/api/device";
  import {getMembers} from "@/api/Member";

export default {
  data() {
    return {
      activeTabName: "deviceList",
      deviceList: [],
      deviceSearchList: [],
      memberList: [],
      addFromVisible: false,
      addFrom: {
        deviceID: "",
        deviceUserID: "",
        deviceDate: ""
      }
    };
  },
  created() {
    this.getDeviceList();
  },
  methods: {
    getDeviceList() {
      getDeviceList(this.$store.state.project.currentProjectId).then(res => {
        const { data } = res;
        this.deviceList = data;
      })
    },
    handleTabRoute(tab, event) {
      this.$router.push(`/projectInfo/${tab.name}`);
    },
    handleReturn(row) {
      this.$confirm("确认归还设备吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          returnDevice(
            this.$store.state.project.currentProjectId,
            row.userID,
            row.deviceID
          ).then(res => {
            this.getDeviceList();
          })
        })
        .catch(() => {});
    },
    handleAddDevice() {
      this.getDeviceIDList();
      this.getMemberList();
      this.addFromVisible = true;
      this.addFrom = {};
    },
    getDeviceIDList() {
      getDeviceIDList().then(res => {
        const { data } = res;
        this.deviceSearchList = data;
      })
    },
    getMemberList() {
      getMembers(this.$store.state.project.currentProjectId, -1).then(res => {
        const { data } = res;
        this.memberList = data;
      })
    },
    registerDevice() {
      registerDevice(
        this.$store.state.project.currentProjectId,
        this.addFrom.deviceUserID,
        this.addFrom.deviceID,
        this.addFrom.deviceDate
      ).then(res => {
        this.addFromVisible = false;
        this.getDeviceList();
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
</style>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
}
</style>
