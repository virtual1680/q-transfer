<template>
	<div class="content">
		<div class="left-content">
			<div class="left-box-card">
				<div class="left-title">
					<span>待选列表</span>
					<span style="float: right; color: #bbbbbb">{{ leftDataIng.length }}/{{ leftData.length }}项</span>
				</div>
				<div class="left-middle">
					<div style="padding: 0 10px 10px 10px">
						<el-row>
							<el-col v-if="input.show" :style="select.show ? 'padding-right: 10px' : ''" :span="select.show ? 16 : 24">
								<el-input @input="leftInputSearch" size="small" :placeholder="input.placeholder" v-model="state.leftSearchValue" clearable></el-input>
							</el-col>
							<el-col v-if="select.show" :span="8">
								<el-select @change="leftSelectChange" size="small" v-model="state.leftSelectValue" :placeholder="select.placeholder" :value="state.leftSelectValue">
									<el-option v-for="item in select.dicData" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-col>
						</el-row>
					</div>
					<div style="padding: 0 10px">
						<el-table ref="lMultipleTable" @row-click="lToggleSelection" @selection-change="leftSelectionChange" size="small" :data="leftData" style="width: 100%" height="400">
							<el-table-column type="selection" width="45"></el-table-column>
							<el-table-column v-for="(item, index) in columnData" :key="index" :fixed="item.fixed" :prop="item.prop" :label="item.label" :width="item.width">
								<template v-slot="scope">
									<slot :name="item.prop" v-if="item.custom" :data="scope['row']"></slot>
									<div v-else>{{ scope.row['' + item.prop] }}</div>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div style="padding: 10px 10px 0 10px" v-if="page.show">
						<el-pagination small @current-change="leftCurrentChangeHandle" layout="prev, pager, next" :page-size="page.pageSize" :total="page.lTotalPage"></el-pagination>
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
					<span style="float: right; color: #bbbbbb">{{ rightDataIng.length }}/{{ rightData.length }}项</span>
				</div>
				<div class="right-middle">
					<div style="padding: 0 10px 10px 10px">
						<el-row>
							<el-col v-if="input.show" :style="select.show ? 'padding-right: 10px' : ''" :span="select.show ? 16 : 24">
								<el-input @input="rightInputSearch" size="small" :placeholder="input.placeholder" v-model="state.rightSearchValue" clearable></el-input>
							</el-col>
							<el-col v-if="select.show" :span="8">
								<el-select @change="rightSelectChange" size="small" v-model="state.rightSelectValue" :placeholder="select.placeholder" :value="state.rightSelectValue">
									<el-option v-for="item in select.dicData" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-col>
						</el-row>
					</div>
					<div style="padding: 0 10px">
						<el-table ref="rMultipleTable" @row-click="rToggleSelection" @selection-change="rightSelectionChange" size="small" :data="rightData" style="width: 100%" height="400">
							<el-table-column type="selection" width="45"></el-table-column>
							<el-table-column v-for="(item, index) in columnData" :key="index" :fixed="item.fixed" :prop="item.prop" :label="item.label" :width="item.width">
								<template v-slot="scope">
									<slot :name="item.prop" v-if="item.custom" :data="scope['row']"></slot>
									<div v-else>{{ scope.row['' + item.prop] }}</div>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div style="padding: 10px 10px 0 10px" v-if="page.show">
						<el-pagination small :page-size="page.pageSize" @current-change="rightCurrentChangeHandle" layout="prev, pager, next" :total="page.rTotalPage"></el-pagination>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { watch, ref, Ref, reactive, toRefs } from 'vue';
import { ColumnItem, SelectItem, Config, Page } from './types.ts';
export interface Props {
	leftData: []; //接收左边数据
	rightData: []; //接收左边数据
	config: Config; //配置项
}
const props = withDefaults(defineProps<Props>(), { pageSize: 100 });
let rightDataIng: Ref<any[]> = ref([]);
let leftDataIng: Ref<any[]> = ref([]);
const state = reactive({
	leftSearchValue: '',
	rightSearchValue: '',
	leftSelectValue: '',
	rightSelectValue: '',
});
const emit = defineEmits(['page-change', 'data-change', 'select-input-search']);
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
		emit('data-change', JSON.parse(JSON.stringify(rightDataIng.value)), 'right-to-left');
	} else {
		// ElMessage.error('请选择数据')
	}
};
//从左到右事件
const leftToRight = () => {
	if (leftDataIng.value.length > 0) {
		emit('data-change', JSON.parse(JSON.stringify(leftDataIng.value)), 'left-to-right');
	} else {
		// ElMessage.error('请选择数据')
	}
};
//左边下拉框选择事件
const leftSelectChange = (val: any) => {
	emit('select-input-search', { inputValue: state.leftSearchValue, selectValue: val }, 'left');
};
//右边下拉框选择事件
const rightSelectChange = (val: any) => {
	emit('select-input-search', { inputValue: state.rightSearchValue, selectValue: val }, 'right');
};
//左边输入框change事件
const leftInputSearch = (val: any) => {
	emit('select-input-search', { inputValue: val, selectValue: state.leftSelectValue }, 'left');
};
//右边输入框change事件
const rightInputSearch = (val: any) => {
	emit('select-input-search', { inputValue: val, selectValue: state.rightSelectValue }, 'right');
};

const { columnData, select, page, input } = toRefs(props.config);
let leftData = props.leftData as [],
	rightData = props.rightData as [];
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
