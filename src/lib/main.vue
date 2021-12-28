<template>
  <div class="content">
    <div class="left-content">
      <div class="left-box-card">
        <div class="left-title">
          <span>待选列表</span>
          <span style="float: right;color: #bbbbbb;">{{leftDataIng.length}}/{{leftData.length}}项</span>
        </div>
        <div class="left-middle">
          <div style="padding:0 10px 10px 10px">
            <el-row>
              <el-col :style="selectData.length>0?'padding-right: 10px':''" :span="selectData.length>0?16:24">
                <el-input @input="leftInputSearch" size="small" placeholder="请输入姓名" v-model="state.leftSearchValue" clearable></el-input>
              </el-col>
              <el-col v-if="selectData.length>0" :span="8">
                <el-select @change="leftSelectChange" size="small" v-model="state.leftSelectValue" placeholder="请选择" :value="state.leftSelectValue">
                  <el-option v-for="item in selectData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
          <div style="padding: 0 10px">
            <el-table ref="lMultipleTable" @row-click="lToggleSelection" @selection-change="leftSelectionChange" size="small" :data="leftData" style="width: 100%" height="400">
              <el-table-column type="selection" width="45"></el-table-column>
              <el-table-column v-for="(item,index) in columnDate" :key="index" :fixed="item.fixed" :prop="item.prop" :label="item.label" :width="item.width">
                <template v-slot="scope">
                  <slot :name="item.prop" v-if="item.custom" :data="scope['row']"></slot>
                  <div v-else>{{scope.row[''+item.prop]}}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="padding: 10px 10px 0 10px">
            <el-pagination small @current-change="leftCurrentChangeHandle" layout="prev, pager, next" :page-size="pageSize" :total="lTotalPage">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="center-content">
      <div style="margin-right: 3px">
        <el-button class="icon-btn" @click="rightToLeft" circle>
          <div class="icon arrow-left"></div>
        </el-button>
      </div>
      <div style="margin-left: 3px">
        <el-button class="icon-btn" @click="leftToRight" circle>
          <div class="icon arrow-right"></div>
        </el-button>
      </div>
    </div>
    <div class="right-content">
      <div class="right-box-card">
        <div class="right-title">
          <span>已选列表</span>
          <span style="float: right;color: #bbbbbb;">{{rightDataIng.length}}/{{rightData.length}}项</span>
        </div>
        <div class="right-middle">
          <div style="padding:0 10px 10px 10px">
            <el-row>
              <el-col :style="selectData.length>0?'padding-right: 10px':''" :span="selectData.length>0?16:24">
                <el-input @input="rightInputSearch" size="small" placeholder="请输入姓名" v-model="state.rightSearchValue" clearable></el-input>
              </el-col>
              <el-col v-if="selectData.length>0" :span="8">
                <el-select @change="rightSelectChange" size="small" v-model="state.rightSelectValue" placeholder="请选择" :value="state.rightSelectValue">
                  <el-option v-for="item in selectData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
          <div style="padding: 0 10px">
            <el-table ref="rMultipleTable" @row-click="rToggleSelection" @selection-change="rightSelectionChange" size="small" :data="rightData" style="width: 100%" height="400">
              <el-table-column type="selection" width="45"></el-table-column>
              <el-table-column v-for="(item,index) in columnDate" :key="index" :fixed="item.fixed" :prop="item.prop" :label="item.label" :width="item.width">
                <template v-slot="scope">
                  <slot :name="item.prop" v-if="item.custom" :data="scope['row']"></slot>
                  <div v-else>{{scope.row[''+item.prop]}}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="padding: 10px 10px 0 10px">
            <el-pagination small :page-size="pageSize" @current-change="rightCurrentChangeHandle" layout="prev, pager, next" :total="rTotalPage"></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { watch, ref, Ref, reactive, defineComponent } from 'vue';
interface ColumnItem {
	fixed: boolean;
	prop: string;
	label: string;
	width: number;
	custom: boolean;
}
interface SelectItem {
	label: string;
	value: string | number;
}
export default defineComponent({
	name: 'QTransfer',
	props: {
		columnDate: { type: Array }, //表数据列的渲染
		leftData: { type: Array }, //接收左边数据
		rightData: { type: Array }, //接收左边数据
		selectData: { type: Array }, //接收select数据
		rTotalPage: { type: Number }, //接收总数据
		lTotalPage: { type: Number }, //接收总数据
		pageSize: { type: Number, default: 100 },
	},
	setup(props, { emit }) {
		let rightDataIng: Ref<any[]> = ref([]);
		let leftDataIng: Ref<any[]> = ref([]);
		// let rightData: Ref<any[]> = ref([]);
		// let leftData: Ref<any[]> = ref([]);
		const state = reactive({
			leftSearchValue: '',
			rightSearchValue: '',
			leftSelectValue: '',
			rightSelectValue: '',
		});
		//分页事件
		const leftCurrentChangeHandle = (val: any) => {
			emit('page-change', val, 'left');
		};
		//分页事件
		const rightCurrentChangeHandle = (val: any) => {
			emit('page-change', val, 'right');
		};
		//左边表格数据选择
		const leftSelectionChange = (val: any) => {
			leftDataIng.value = val;
		};
		//左边点击某行选中数据
		const lMultipleTable: Ref<HTMLElement | null> = ref(null);
		const lToggleSelection = (rows: any) => {
			if (rows) {
				(lMultipleTable.value as any).toggleRowSelection(rows);
			} else {
				(lMultipleTable.value as any).clearSelection();
			}
		};
		//右边表格数据选择
		const rightSelectionChange = (val: any) => {
			rightDataIng.value = val;
		};
		//右边点击某行选中数据
		const rMultipleTable: Ref<HTMLElement | null> = ref(null);
		const rToggleSelection = (rows: any) => {
			if (rows) {
				(rMultipleTable.value as any).toggleRowSelection(rows);
			} else {
				(rMultipleTable.value as any).clearSelection();
			}
		};
		/**从右到左事件*/
		const rightToLeft = () => {
			if (rightDataIng.value.length > 0) {
				emit(
					'data-change',
					JSON.parse(JSON.stringify(rightDataIng.value)),
					'right-to-left',
				);
			} else {
				// ElMessage.error('请选择数据')
			}
		};
		//从左到右事件
		const leftToRight = () => {
			if (leftDataIng.value.length > 0) {
				emit(
					'data-change',
					JSON.parse(JSON.stringify(leftDataIng.value)),
					'left-to-right',
				);
			} else {
				// ElMessage.error('请选择数据')
			}
		};
		//左边下拉框选择事件
		const leftSelectChange = (val: any) => {
			emit('select-input-search', val, state.leftSearchValue, 'left');
		};
		//右边下拉框选择事件
		const rightSelectChange = (val: any) => {
			emit('select-input-search', val, state.rightSearchValue, 'right');
		};
		//左边输入框change事件
		const leftInputSearch = (val: any) => {
			emit('select-input-search', state.leftSelectValue, val, 'left');
		};
		//右边输入框change事件
		const rightInputSearch = (val: any) => {
			emit('select-input-search', state.rightSelectValue, val, 'right');
		};

		watch(
			() => props.rightData,
			(val, old) => {
				console.log('------', val);
				// rightDataIng.value = val as any[];
			},
		);
		let columnDate = props.columnDate as ColumnItem[];
		let selectData = props.selectData as SelectItem[];
		let leftData = props.leftData as [],
			rightData = props.rightData as [];
		return {
			state,
			rightDataIng,
			leftDataIng,
			rMultipleTable,
			lMultipleTable,
			columnDate,
			selectData,
			leftData,
			rightData,
			leftCurrentChangeHandle,
			rightCurrentChangeHandle,
			leftSelectionChange,
			lToggleSelection,
			rightSelectionChange,
			rToggleSelection,
			rightToLeft,
			leftToRight,
			leftSelectChange,
			rightSelectChange,
			leftInputSearch,
			rightInputSearch,
		};
	},
});
</script>

<style scoped>
.content {
	display: flex;
	width: 100%;
	margin: 0 auto;
	justify-content: space-around;
}
.left-content,
.right-content {
	width: 44%;
	display: inline-block;
}
.left-box-card,
.right-box-card {
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	border-radius: 4px;
	border: 1px solid #e6e9f0;
	background-color: #fff;
	overflow: hidden;
	color: #303133;
	transition: 0.3s;
}
.left-title,
.right-title {
	font-size: 13px;
	padding: 0 15px;
	height: 40px;
	line-height: 40px;
	background: #e5e5e5;
	border-bottom: 1px solid #d9d9d9;
}
.left-middle,
.right-middle {
	padding: 10px;
}
/*center-content*/
.center-content {
	width: 10%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
}
.icon {
	width: 10px;
	height: 10px;
	border-left: 1px solid #bbb;
	border-top: 1px solid #bbb;
	border-radius: 4px 0 0 0;
}
.arrow-left {
	transform: rotate(-45deg);
}
.arrow-right {
	transform: rotate(135deg);
}
.icon-btn {
	width: 40px;
	height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
