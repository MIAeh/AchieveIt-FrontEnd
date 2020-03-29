<template>
  <div class="dashboard-container">
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabRoute">
      <el-tab-pane label="基本信息" name="basicInfo"></el-tab-pane>
      <el-tab-pane label="功能列表" name="functionList"></el-tab-pane>
      <el-tab-pane label="成员管理" name="memberManage"></el-tab-pane>
      <el-tab-pane label="权限管理" name="authorityManage"></el-tab-pane>
      <el-tab-pane label="工时管理" name="workHour"></el-tab-pane>
      <el-tab-pane label="设备列表" name="deviceList">
        <el-row class="dashboard-row">
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-plus" @click="handleAddDevice">登记设备</el-button>
          </el-col>
        </el-row>
        <el-table :data="deviceList" border style="width: 100%">
          <el-table-column prop="deviceID" label="设备ID" />
          <el-table-column prop="deviceType" label="设备类别" width="200" />
          <el-table-column prop="deviceUser" label="使用者" width="160" />
          <el-table-column prop="deviceDate" label="设备使用期限" width="160" />
          <el-table-column prop="deviceStatus" label="设备状态" width="160">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.deviceStatus === '使用中'">使用中</el-tag>
              <el-tag type="info" v-else-if="scope.row.deviceStatus === '已归还'">已归还</el-tag>
              <el-tag type="danger" v-else>已逾期</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="handleReturn(scope.$index)"
                type="text"
                size="small"
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
              remote
              reserve-keyword
              placeholder="请搜索设备"
              :remote-method="handleDeviceSearch"
            >
              <el-option
                v-for="item in deviceSearchList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备使用者">
            <el-select v-model="addFrom.deviceUserID" placeholder="请选择设备使用者">
              <el-option v-for="item in deviceUserList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备使用期限">
            <el-date-picker type="date" placeholder="选择日期" v-model="addFrom.deviceDate"></el-date-picker>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFromVisible = false">取消</el-button>
        <el-button type="primary" @click="addSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTabName: "deviceList",
      deviceList: [
        {
          deviceID: "PC-123123123123",
          deviceType: "PC",
          deviceUser: "小明",
          deviceDate: "2020-20-20",
          deviceStatus: "使用中"
        },
        {
          deviceID: "PHONE-123123123123",
          deviceType: "PHONE",
          deviceUser: "小明",
          deviceDate: "2020-20-20",
          deviceStatus: "已归还"
        },
        {
          deviceID: "PAD-123123123123",
          deviceType: "PAD",
          deviceUser: "小明",
          deviceDate: "2020-20-20",
          deviceStatus: "已逾期"
        }
      ],
      deviceSearchList: [
        {
          id: "PC-12312",
          label: "设备1"
        },
        {
          id: "PC-123123123123",
          label: "设备2"
        },
        {
          id: "PC-123123",
          label: "设备3"
        }
      ],
      deviceUserList: ["小明", "小刘", "小五"],
      addFromVisible: false,
      addFrom: {
        deviceID: "",
        deviceUserID: "",
        deviceDate: ""
      }
    };
  },
  methods: {
    handleTabRoute(tab, event) {
      this.$router.push(`/projectInfo/${tab.name}`);
    },
    handleReturn(index) {
      this.$confirm("确认归还设备吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.deviceList[index].deviceStatus = "已归还";
        })
        .catch(() => {});
    },
    handleDeviceSearch() {},
    handleAddDevice() {
      this.addFromVisible = true;
      this.addFrom = {};
    },
    addSubmit() {
      this.addFromVisible = false;
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