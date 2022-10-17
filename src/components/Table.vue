<template>
  <div class="tb">
    <table class="table table-bordered table-hover ">
      <thead style="color: grey; background-color: rgb(233,235,235)">
        <tr style="text-align: center;">
          <th>族名</th>
          <th
            :colspan="item.cols.length"
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
            <a style="text-decoration: none;" href="javascript:;" @click="delRow">删除</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      familyGroup: [],
      rows: [],
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
  computed: {
    colArr() {
      var newArr = [];
      this.familyGroup.forEach((fam) => {
        fam.cols.forEach((col) => {
          newArr.push(col);
        });
      });
      return newArr;
    },
  },
  methods: {
    delRow(e) {
      var row = e.target.parentNode.parentNode.children[0].innerHTML
      console.log(row);
      this.$parent.delConfirm(row)
    },
    handleList() {
      var famGroup = [];

      this.families.forEach((family) => {
        var arr = this.tableList.filter((item) => {
          return item.family == family;
        });
        famGroup.push(arr);
      });

      var familyGroup = [];
      for (var i = 0; i < famGroup.length; i++) {
        var obj = {};
        obj.family = famGroup[i][0].family;
        var newArr = [];
        for (var j = 0; j < famGroup[i].length; j++) {
          if (newArr.indexOf(famGroup[i][j].qualifier) == -1) {
            newArr.push(famGroup[i][j].qualifier);
          }
        }
        obj.cols = newArr;
        familyGroup.push(obj);
      }
      this.familyGroup = familyGroup;

      console.log(this.familyGroup);
      console.log(this.colArr);
      console.log(this.tableList);

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
      console.log(rows);

      this.$nextTick(() => {
        for (var i = 0; i < rows.length; i++) {
          // console.log(this.$refs.tbodyRef.children[i]);

          rows[i].forEach(cell => {
            var site = this.locate(cell.family, cell.qualifier)
            this.$refs.tbodyRef.children[i].children[site].innerHTML = cell.value
          })

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