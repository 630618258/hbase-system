<template>
  <div class="main">
    <Navbar></Navbar>
    <div class="main-area">
      <!-- 菜单 -->
      <div class="menu">
        <el-menu
          active-text-color="#ffd04b"
          text-color="#fff"
          background-color="#545c64"
          @open="handleOpen"
          unique-opened
          class="el-menu-vertical-demo"
        >
          <el-submenu
            v-for="(item, index) in tableForm.sourceName"
            :index="`${index}`"
            :key="index"
          >
            <template slot="title">
              <i class="el-icon-folder-opened"></i>
              <span>{{ item }}</span>
            </template>
            <el-submenu
              v-for="(item2, index2) in tableForm.namespace"
              :key="index2"
              :index="`${index}-${index2}`"
            >
              <template slot="title">
                <i class="el-icon-folder"></i>
                <span>{{ item2 }}</span>
              </template>
              <el-menu-item
                @click="getTableList"
                v-for="(item3, index3) in tableNames"
                :key="index3"
                :index="`${index}-${index2}-${index3}`"
              >
                <template slot="title">
                  <i class="el-icon-document"></i>
                  <span>{{ item3 }}</span>
                </template></el-menu-item
              >
            </el-submenu>
          </el-submenu>
        </el-menu>
      </div>
      <!-- 主题内容 -->
      <div class="content">
        <div class="ipt">
          <el-form :inline="true" :model="tableForm" class="demo-form-inline">
            <el-form-item label="起始行">
              <el-input size="small" v-model="tableForm.startRow"></el-input>
            </el-form-item>
            <el-form-item label="结束行">
              <el-input size="small" v-model="tableForm.stopRow"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="getList"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div class="table-frame">
          <Table ref="tableRef" :families="families" :tableList="tableList"></Table>
          <!-- <div class="tb">
            <el-table stripe border :data="tableList">
              <el-table-column label="行数" prop="row"></el-table-column>
              <el-table-column label="family" prop="family"></el-table-column>
              <el-table-column label="列名" prop="qualifier"></el-table-column>
              <el-table-column label="值" prop="value"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click="delConfirm(scope.row)"
                    type="text"
                    size="small"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div> -->
        </div>
        <div class="btn">
          <el-button @click="dialogInsertVisible = true" type="success"
            >插入数据</el-button
          >
        </div>
      </div>

      <!-- 插入数据 -->
      <el-dialog
        title="插入数据"
        :visible.sync="dialogInsertVisible"
        width="30%"
      >
        <el-form :model="tableForm" label-width="100px">
          <el-form-item label="数据源">
            <el-input
              style="width: 80%"
              :disabled="true"
              v-model="sourceNamec"
            ></el-input>
          </el-form-item>
          <el-form-item label="命名空间">
            <el-input
              style="width: 80%"
              :disabled="true"
              v-model="namespacec"
            ></el-input>
          </el-form-item>

          <el-form-item label="表名称">
            <el-input
              style="width: 80%"
              :disabled="true"
              v-model="tableNamec"
            ></el-input>
          </el-form-item>

          <el-form-item label="插入行数">
            <el-input style="width: 20%" v-model="tableForm.rowKey"></el-input>
          </el-form-item>

          <el-form-item label="列族名称">
            <el-select v-model="familyVal" placeholder="请选择族名">
              <el-option
                v-for="(item, index) in familyOptions"
                :key="item.value + index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-row>
            <el-col :span="12">
              <el-form-item label="列名">
                <el-input
                  style="width: 100%"
                  v-model="tableForm.columnName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="值">
                <el-input
                  style="width: 80%"
                  v-model="tableForm.value"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogInsertVisible = false">取 消</el-button>
          <el-button type="primary" @click="insertValue">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 新建表 -->
      <el-dialog
        title="新建表"
        :visible.sync="dialogCreateTableVisible"
        width="30%"
        class="greyline"
      >
        <el-form :model="tableForm" label-width="100px">
          <el-form-item label="表名">
            <el-input
              style="width: 80%"
              v-model="tableForm.tableNameTemp"
            ></el-input>
          </el-form-item>
          <!-- 注意注意 -->
          <!-- <el-form-item v-for="(item, index) in familyArr" :key="index" :label="'列族' + (index + 1)">
            <el-input style="width: 80%" v-model="item"></el-input>
          </el-form-item> -->

          <el-form-item
            v-for="(domain, index) in domains"
            :key="domain.key"
            :label="'族名' + (index + 1)"
          >
            <el-input style="width: 50%" v-model="domain.value"></el-input>
            <el-button @click="removeDomain(domain)">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addDomain">新增</el-button>
          </el-form-item>

          <el-form-item label="命名空间">
            <el-input
              style="width: 80%"
              :disabled="true"
              v-model="currentNamespace"
            ></el-input>
          </el-form-item>
          <el-form-item label="数据源">
            <el-input
              style="width: 80%"
              :disabled="true"
              v-model="currentSourceName"
            ></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogCreateTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="createSingleTable">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 新建命名空间 -->

      <el-dialog
        title="新建命名空间"
        :visible.sync="dialogCreateNamespaceVisible"
        width="30%"
        class="greyline"
      >
        <el-form :model="tableForm" label-width="100px">
          <el-form-item label="数据源">
            <el-input
              style="width: 80%"
              :disabled="true"
              v-model="currentSourceName"
            ></el-input>
          </el-form-item>
          <el-form-item label="命名空间">
            <el-input style="width: 80%" v-model="namespaceTemp"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogCreateNamespaceVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="namespaceFormSubmit"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 删除表 -->

      <el-dialog
        title="删除表"
        :visible.sync="dialogDeleteTableVisible"
        width="30%"
        class="greyline"
      >
        <el-form :model="tableForm" label-width="100px">
          <el-form-item label="数据源">
            <el-input
              style="width: 80%"
              :disabled="true"
              v-model="currentSourceName"
            ></el-input>
          </el-form-item>
          <el-form-item label="命名空间">
            <el-input
              style="width: 80%"
              :disabled="true"
              v-model="currentNamespace"
            ></el-input>
          </el-form-item>
          <el-form-item label="表名称">
            <el-select v-model="tableIndex" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogDeleteTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="delTable">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 删除命名空间 -->

      <el-dialog
        title="删除命名空间"
        :visible.sync="dialogDeleteNamespaceVisible"
        width="30%"
        class="greyline"
      >
        <el-form :model="tableForm" label-width="100px">
          <el-form-item label="数据源">
            <el-input
              style="width: 80%"
              :disabled="true"
              v-model="currentSourceName"
            ></el-input>
          </el-form-item>
          <el-form-item label="命名空间">
            <el-select v-model="nameSpaceIndex" placeholder="请选择">
              <el-option
                v-for="item in optionsNamespace"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogDeleteNamespaceVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="delNamespace">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 删除数据源 -->
      <el-dialog
        title="删除数据源"
        :visible.sync="dialogDeleteSourcenameVisible"
        width="30%"
        class="greyline"
      >
        <el-form :model="tableForm">
          <el-form-item label="数据源">
            <el-select v-model="sourceNameIndex" placeholder="请选择">
              <el-option
                v-for="item in optionsSourcename"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogDeleteSourcenameVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="delSourcename">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 黑名单列表 -->
      <!-- <el-dialog
        title="黑名单列表"
        :visible.sync="dialogBlackListVisible"
        width="30%"
      >
        <el-form>
          <el-form-item
            v-for="(item, index) in blackList"
            :key="index"
            :label="item.email"
          >
            <el-switch
              @change="blackEmailSubmit(item.email, item.ban)"
              v-model="item.ban"
            ></el-switch>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogBlackListVisible = false">取 消</el-button>
          <el-button @click="dialogBlackListVisible = false" type="primary"
            >确 定</el-button
          >
        </span>
      </el-dialog> -->

      <!-- 黑名单 -->

      <el-dialog
        title="黑名单"
        :visible.sync="dialogBlackListVisible"
        width="30%"
        class="greyline"
      >
        <el-form label-width="200px">
          <el-form-item
            v-for="(item, index) in blackList"
            :key="index"
            :label="item.email"
          >
            <el-switch
              @change="postBlackList(item.email, item.ban)"
              v-model="item.ban"
            ></el-switch>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogBlackListVisible = false"
            >取 消</el-button
          >
        </span>
      </el-dialog>

      <!-- 新建数据源 -->

      <el-dialog
        title="新建数据源"
        :visible.sync="dialogConfigVisible"
        width="50%"
        class="greyline"
      >
        <el-form>
          <el-form-item label="数据源名称">
            <el-input v-model="sourcename" style="width: 70%"></el-input>
          </el-form-item>
          <!-- 配置项 -->
          <el-form
            v-for="item in maps"
            :key="item.key"
            :model="item"
            :inline="true"
          >
            <el-form-item label="name">
              <el-input v-model="item.name"></el-input>
            </el-form-item>
            <el-form-item label="value">
              <el-input v-model="item.value"></el-input>
            </el-form-item>
            <el-button
              @click="removeItem(item.key)"
              style="margin-left: 15px"
              size="medium"
              type="warning"
              >删除</el-button
            >
          </el-form>
          <el-button @click="addItem" type="success">添加</el-button>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogConfigVisible = false">取 消</el-button>
          <el-button type="primary" @click="sourceFormSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Table from './Table.vue'
export default {
  components: {
    Navbar,
    Table
  },
  data() {
    return {
      families: [],
      tableNames: [],
      currentSourceName: "",
      currentNamespace: "",
      currentTableName: "",
      namespaceTemp: "",
      // familyName: ["cyx1"],
      domains: [
        {
          value: "",
          key: 1,
        },
      ],
      tableName: "",
      familyVal: "",
      familyOptions: [],
      familyArr: [],
      maps: [],
      sourcename: "",
      dialogConfigVisible: false,
      dialogBlackListVisible: false,
      dialogDeleteSourcenameVisible: false,
      dialogDeleteNamespaceVisible: false,
      dialogDeleteTableVisible: false,
      dialogInsertVisible: false,
      dialogCreateTableVisible: false,
      dialogCreateNamespaceVisible: false,
      tableList: [],
      arr: [],
      tableForm: {
        tableNameTemp: "",
        sourceName: [],
        namespace: [],
        tableName: [],
        startRow: 0,
        stopRow: 10,
        rowKey: 0,
        columnFamily: "",
        columnName: "",
        value: "",
        family: [],
      },
      tableIndex: 0,
      nameSpaceIndex: 0,
      sourceNameIndex: 0,
      blackList: [],
    };
  },
  computed: {
    tableNamecc() {
      return this.tableNamec.split(":")[1];
    },
    sourceNamec() {
      return this.tableForm.sourceName[this.arr[0]];
    },
    namespacec() {
      return this.tableForm.namespace[this.arr[1]];
    },
    tableNamec() {
      return this.tableForm.tableName[this.arr[2]];
    },
    options() {
      // var options = []

      // this.tableForm.tableName.forEach(val => {
      //   var obj = {}

      // })

      var obj = {};
      var options = [];
      this.tableForm.tableName.forEach((val, index) => {
        obj = {
          value: index,
          label: val,
        };
        options.push(obj);
      });
      return options;
    },
    optionsNamespace() {
      var obj = {};
      var options = [];
      this.tableForm.namespace.forEach((val, index) => {
        obj = {
          value: index,
          label: val,
        };
        options.push(obj);
      });
      return options;
    },
    optionsSourcename() {
      var obj = {};
      var options = [];
      this.tableForm.sourceName.forEach((val, index) => {
        obj = {
          value: index,
          label: val,
        };
        options.push(obj);
      });
      return options;
    },
  },
  methods: {
    removeDomain(domain) {
      var index = this.domains.indexOf(domain);

      this.domains.splice(index, 1);
    },
    addDomain() {
      var obj = {
        value: "",
        key: +new Date(),
      };
      this.domains.push(obj);
    },
    async sourceFormSubmit() {
      var newMaps = [];

      this.maps.forEach((item) => {
        var obj = {};
        for (var k in item) {
          if (k != "key") {
            obj[k] = item[k];
          }
        }
        newMaps.push(obj);
      });

      const { data: res } = await this.posts(
        "/api/manage/hbaseDataSourceConfiguration/auth/createDataConfig",
        {
          sourceName: this.sourcename,
          configMap: newMaps,
        }
      );

      if (res.status.code === 200) {
        this.$message.success("新建数据源成功");
        this.tableForm.sourceName = [];
        this.tableForm.namespace = [];
        this.tableForm.tablename = [];
        this.getSourceName();
        this.dialogConfigVisible = false;
      } else {
        this.$message.error(res.status.msg);
      }
    },
    removeItem(key) {
      this.maps = this.maps.filter((val) => {
        return val.key != key;
      });
    },
    addItem() {
      var obj = {
        name: "",
        value: "",
        key: this.maps.length,
      };
      this.maps.push(obj);
    },

    async blackEmailSubmit(email, ban) {
      const { data: res } = await this.posts("/api/user/auth/blackList", {
        email: email,
        ban: ban,
      });
      if (res.status.code === 200) {
        this.$message.success("修改成功");
      } else {
        this.$message.error("修改失败");
      }
    },

    async delSourcename() {
      const { data: res } = await this.posts(
        "/api/manage/hbaseDataSourceConfiguration/auth/delSourceData",
        {
          sourceName: this.tableForm.sourceName[this.sourceNameIndex],
        }
      );
      if (res.status.code === 200) {
        this.$message.success("删除成功");
        this.getSourceName();
        this.dialogDeleteSourcenameVisible = false;
      } else {
        this.$message.error("删除失败");
      }
    },
    // 删除命名空间
    async delNamespace() {
      const { data: res } = await this.gets(
        "/api/manage/hbaseManage/auth/delNamespace",
        {
          sourceName: this.currentSourceName,
          namespace: this.tableForm.namespace[this.nameSpaceIndex],
        }
      );

      if (res.status.code === 200) {
        this.$message.success("删除成功");
        this.getNamespace(this.currentSourceName);
        this.dialogDeleteNamespaceVisible = false;
      }
    },

    // 删除表
    async delTable() {
      var that = this;
      const { data: res } = await this.posts(
        "/api/manage/HbaseTable/auth/delTable",
        {
          sourceName: this.currentSourceName,
          namespace: this.currentNamespace,
          tableName: this.tableForm.tableName[this.tableIndex].split(":")[1],
        }
      );
      if (res.status.code === 200) {
        that.$message.success("删除成功");

        that.getTableName(that.currentSourceName, that.currentNamespace);

        that.dialogDeleteTableVisible = false;
      } else {
        this.$message.error("删除失败");
      }
    },
    //  新建命名空间
    namespaceFormSubmit() {
      var that = this;

      this.posts(
        "/api/manage/hbaseDataSourceConfiguration/auth/createNamespace",
        {
          sourceName: that.currentSourceName,
          namespace: that.namespaceTemp,
        }
      ).then(function (res) {
        if (res.data.status.code === 200) {
          that.$message.success("命名空间创建成功");
          that.namespaceTemp = "";
          that.getNamespace(that.currentSourceName);
          that.dialogCreateNamespaceVisible = false;
        } else {
          that.$message.error("命名空间创建失败");
        }
      });
    },
    // 新建表
    createSingleTable() {
      var that = this;

      this.domains.forEach((item) => {
        this.familyArr.push(item.value);
      });

      this.posts("/api/manage/HbaseTable/auth/createTable", {
        tableName: this.tableForm.tableNameTemp,
        family: this.familyArr,
        namespace: this.currentNamespace,
        sourceName: this.currentSourceName,
      }).then(function (res) {
        if (res.data.status.code === 200) {
          that.$message.success("表创建成功!");
          that.tableForm.tableNameTemp = "";
          that.getTableName(that.currentSourceName, that.currentNamespace);
          that.dialogCreateTableVisible = false;
        } else {
          that.$message.error(res.data.status.msg);
        }
      });

      this.familyArr = [];
      this.domains = [
        {
          value: "",
          key: 1,
        },
      ];
    },

    // 插入表格数据
    insertValue() {
      var that = this;

      this.posts("/api/manage/HbaseTable/auth/insertValue", {
        sourceName: this.sourceNamec,
        namespace: this.namespacec,
        tableName: this.tableNamec.split(":")[1],
        rowKey: this.tableForm.rowKey,
        columnFamily: this.familyVal,
        columnName: this.tableForm.columnName,
        value: this.tableForm.value,
      }).then(function (res) {
        if (res.data.status.code === 200) {
          // 拿到表格数据

          that.getList();

          that.$message.success("插入成功");
          that.dialogInsertVisible = false;
        } else {
          that.$message.error("插入失败");
        }
      });
    },

    delConfirm(row) {
      this.$confirm("此操作将删除此行数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delRowData(row);
        })
        .catch(() => {});
    },

    delRowData(row) {
      var that = this;

      this.gets("/api/manage/HbaseTable/auth/delRowData", {
        sourceName: this.sourceNamec,
        namespace: this.namespacec,
        tableName: this.tableNamecc,
        rowKey: row.row,
      }).then(function (res) {
        if (res.data.status.code === 200) {
          that.getList();
          that.$message.success("删除成功");
        } else {
          that.$message.error("删除失败");
        }
      });
    },
    async getList() {
      const { data: res } = await this.gets(
        "/api/manage/HbaseTable/auth/getTable",
        {
          sourceName: this.sourceNamec,
          namespace: this.namespacec,
          startRow: this.tableForm.startRow,
          stopRow: this.tableForm.stopRow,
          tableName: this.tableNamec.split(":")[1],
        }
      );

      // 拿到族名
      this.getFamilies();

      if (res.status.code === 200) {
        this.tableList = res.data.cells;

        this.$nextTick(() => {
          this.$refs.tableRef.handleList()
        })

        // var arrs = [];
        // var familys = [];
        // this.tableList.forEach((val) => {
        //   for (var k in val) {
        //     if (k == "family") {
        //       arrs.push(val[k]);
        //     }
        //   }
        // });

        // arrs.forEach((val, index) => {
        //   if (familys.indexOf(arrs[index]) == -1) {
        //     familys.push(arrs[index]);
        //   }
        // });

        // this.familyArr = familys;

        // for (var i = 0; i < this.familyArr.length; i++) {
        //   var obj = {};
        //   (obj.value = this.familyArr[i]), (obj.label = this.familyArr[i]);
        //   this.familyOptions.push(obj);
        // }
      } else {
        this.$message.error("查询失败");
      }
    },
    // 点击三级列表时拿到table数据
    async getTableList(e) {
      var arr = e.index.split("-");
      this.arr = arr;

      this.currentTableName = this.tableNames[arr[2]];

      const { data: res } = await this.gets(
        "/api/manage/HbaseTable/auth/getTable",
        {
          sourceName: this.sourceNamec,
          namespace: this.namespacec,
          startRow: this.tableForm.startRow,
          stopRow: this.tableForm.stopRow,
          tableName: this.tableNamec.split(":")[1],
        }
      );

      // 拿到族名
      this.getFamilies();

      if (res.status.code === 200) {
        this.tableList = res.data.cells;

        
        this.$nextTick(() => {
          this.$refs.tableRef.handleList()
        })

        // var arrs = [];
        // var familys = [];
        // this.tableList.forEach((val) => {
        //   for (var k in val) {
        //     if (k == "family") {
        //       arrs.push(val[k]);
        //     }
        //   }
        // });

        // arrs.forEach((val, index) => {
        //   if (familys.indexOf(arrs[index]) == -1) {
        //     familys.push(arrs[index]);
        //   }
        // });

        // this.familyArr = familys;

        // for (var i = 0; i < this.familyArr.length; i++) {
        //   var obj = {};
        //   (obj.value = this.familyArr[i]), (obj.label = this.familyArr[i]);
        //   this.familyOptions.push(obj);
        // }
      } else {
        this.$message.error("查询失败");
      }
    },

    // 存储族名
    getFamilies() {
      var that = this;

      this.posts("/api/manage/HbaseTable/auth/getFamilies", {
        sourceName: this.currentSourceName,
        namespace: this.currentNamespace,
        tableName: this.currentTableName,
      }).then(function (res) {
        if (res.data.status.code === 200) {
          that.families = [];
          that.families = res.data.data;

          that.familyOptions = [];
          that.families.forEach((val) => {
            var obj = {};
            obj.label = val;
            obj.value = val;
            that.familyOptions.push(obj);
          });
        }
      });
    },

    // 存储数据源
    async getSourceName() {
      const { data: res } = await this.gets(
        "/api/manage/hbaseDataSourceConfiguration/auth/getDataSource"
      );
      this.tableForm.sourceName = res.data;
    },

    // 存储命名空间
    async getNamespace(sourceName) {
      const { data: res } = await this.gets(
        "/api/manage/hbaseDataSourceConfiguration/auth/getNamespace",
        {
          sourceName: sourceName,
        }
      );
      // 接收数据
      this.tableForm.namespace = res.data;
    },
    async getTableName(sourceName, namespace) {
      const { data: res } = await this.gets(
        "/api/manage/HbaseTable/auth/getTableName",
        {
          sourceName: sourceName,
          namespace: namespace,
        }
      );

      this.tableNames = [];
      this.tableForm.tableName = [];

      this.tableForm.tableName = res.data;

      var json = res.data;

      json.forEach((val) => {
        var str = val.split(":")[1];
        this.tableNames.push(str);
      });
    },
    handleOpen(key, keyPath) {
      if (keyPath.length == 1) {
        this.currentSourceName = this.tableForm.sourceName[parseInt(key)];
        this.getNamespace(this.currentSourceName); //数据源名
      } else {
        this.currentNamespace = this.tableForm.namespace[key.split("-")[1]];
        this.getTableName(this.currentSourceName, this.currentNamespace);
      }
    },
    getBlackList() {
      var that = this;

      this.gets("/api/user/auth/getBlackList").then(function (res) {
        if (res.data.status.code === 200) {
          that.blackList = res.data.data;
        }
      });
    },
    postBlackList(email, ban) {
      var that = this;

      this.posts("/api/user/auth/blackList", {
        email: email,
        ban: ban,
      }).then(function (res) {
        if (res.data.status.code === 200) {
          if (res.data.status.msg == "用户已启用") {
            that.$message.success("用户已启用");
          } else {
            that.$message(res.data.status.msg);
          }
        } else {
          that.$message.error("未知错误");
        }
      });
    },
  },
  created() {
    this.getSourceName();
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.main {
  height: 100vh;
}

.main-area {
  display: flex;
  height: calc(100vh - 75px);
}

.menu {
  margin-top: 60px;
  width: 230px;
  background-color: pink;
  max-height: calc(100vh - 200px);
}

.content {
  flex: 1;
}

.table-frame {
  height: calc(100vh - 250px);
  background-color: #fff;
  /* padding: 0 30px; */
}

.tb {
  margin: 0 auto;
  width: 96%;
  height: 100%;
  background-color: #fff;
  overflow: auto;
}

.btn {
  border-top: 1px solid gainsboro;
  height: 100px;
  background-color: #fff;
}
.ipt {
  padding-top: 15px;
  height: 75px;
  background-color: rgb(239, 241, 245);
}

.ipt .el-form {
  /* justify-content: center;
  align-items: center;
  text-align: center;
  height: 75px; */
}

.ipt .el-form {
  display: flex;
  justify-content: flex-start;
  margin-left: 4%;
}

.ipt .el-input {
  width: 50px;
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn .el-button {
  margin-left: 200px;
}

.el-dialog {
  /* max-height: 600px;
  overflow: auto; */
}

.greyline .el-dialog .el-dialog__body {
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
}

/* .newSource >>> .el-dialog >>> .el-dialog__body {
  border-top: 1px solid #EAEAEA;
  border-bottom: 1px solid #EAEAEA;
} */
</style>