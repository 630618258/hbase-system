<template>
  <div class="tb">
    <table v-if="tableVisible" class="table table-striped table-bordered ">
      <!-- background-color: rgb(242,241,246) -->
      <thead style="color: grey;">
        <tr style="text-align: center">
          <th>族名</th>
          <th
            :colspan="item.cols.length == 0 ? 1 : item.cols.length"
            v-for="item in familyGroup"
            :key="item.family"
          >
            {{ item.family }}
          </th>
          <th>#</th>
        </tr>
        <tr style="text-align: center">
          <th>行数</th>
          <th v-for="(col, index) in colArr" :key="index">{{ col }}</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody style="color: black" ref="tbodyRef">
        <tr v-for="(item, index) in rows" :key="index">
          <td>{{ item[0].row }}</td>
          <td v-for="(col, index) in colArr" :key="index"></td>
          <td>
            <a style="text-decoration: none" href="javascript:;" @click="delRow"
              >删除</a
            >
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!tableVisible" class="empty">
      <span>表格中暂无数据</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      familyGroup: [],
      rows: [],
      tableVisible: false
    };
  },
  props: {
    tableList: {
      default: [],
      type: Array,
    },
    families: {
      default: [],
      type: Array,
    },
  },
  watch: {
    tableList: {
      handler(newVal, oldVal) {
        if (newVal.length == 0) {
          this.tableVisible = false
        } else {
          this.handleList();
          this.tableVisible = true
        }
        // if (newVal.length == 0) {
        //   this.tableVisible = true
        // }
      },
      immediate: true
    },
  },
  computed: {
    colArr() {
      var newArr = [];
      this.familyGroup.forEach((fam) => {
        if (fam.cols.length == 0) {
          newArr.push('暂无列')
        } else {
          fam.cols.forEach(col => {
            newArr.push(col)
          })
        }
      });
      return newArr;
    },
  },
  methods: {
    delRow(e) {
      var row = e.target.parentNode.parentNode.children[0].innerHTML;
      this.$parent.delConfirm(row);
    },
    handleList() {
      if (this.tableList.length == 0) return;

      var famGroup = [];

      // console.log(this.families);
      // console.log(this.tableList);

      this.families.forEach((family) => {
        var arr = this.tableList.filter((cell) => {
          return cell.family == family;
        });
        famGroup.push(arr);
      });

      // console.log(this.families);

      var familyGroup = [];
      for (var i = 0; i < famGroup.length; i++) {
        var obj = {};
        obj.family = this.families[i];
        var newArr = [];
        // for (var j = 0; j < famGroup[i].length; j++) {
        //   if (newArr.indexOf(famGroup[i][j].qualifier) == -1) {
        //     newArr.push(famGroup[i][j].qualifier);
        //   }
        // }
        if (famGroup[i].length == 0) {
        } else {
          for (var j = 0; j < famGroup[i].length; j++) {
            if (newArr.indexOf(famGroup[i][j].qualifier) == -1) {
              newArr.push(famGroup[i][j].qualifier);
            }
          }
        }
        obj.cols = newArr;
        familyGroup.push(obj);
      }
      this.familyGroup = familyGroup;

      // 处理tableList

      var rowArr = [];
      this.tableList.forEach((cell) => {
        if (rowArr.indexOf(cell.row) == -1) {
          rowArr.push(cell.row);
        }
      });

      rowArr.sort(function (a, b) {
        return a - b;
      });

      var rows = [];
      rowArr.forEach((row) => {
        var rowTemp = [];
        this.tableList.forEach((cell) => {
          if (cell.row == row) {
            rowTemp.push(cell);
          }
        });
        rows.push(rowTemp);
      });

      this.rows = rows;

      this.$nextTick(() => {
        for (var i = 0; i < rows.length; i++) {
          rows[i].forEach((cell) => {
            var site = this.locate(cell.family, cell.qualifier);
            this.$refs.tbodyRef.children[i].children[site].innerHTML =
              cell.value;
          });
        }
      });
    },
    locate(family, col) {
      for (var i = 0; i < this.familyGroup.length; i++) {
        if (this.familyGroup[i].family == family) {
          if (i == 0) {
            var position = this.familyGroup[i].cols.indexOf(col) + 1;
          } else {
            var num = 0;
            for (var j = 0; j <= i - 1; j++) {
              num = this.familyGroup[j].cols.length + num;
            }
            var position = this.familyGroup[i].cols.indexOf(col) + 1 + num;
          }

          return position;
        }
      }
    },
  },
};
</script>

<style src="../../node_modules/bootstrap/dist/css/bootstrap.css" scoped>
</style>

<style scoped>
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: rgb(239,241,245);
  font-weight: 400;
  color: grey;
  font-size: 20px;
  line-height: 0;
}
</style>