<template>
	<q-transfer
		@page-change="listenerPageChange"
		@select-input-search="listenerSelectInputSearch"
		@data-change="listenerDataChange"
		:leftData="tableData.leftData"
		:rightData="tableData.rightData"
		:config="tableData.config">
		<!-- 自定义插槽 在config columnData 中设置slot：true -->
		<template v-slot:roleName="scope">
			<div>
				{{ scope.data.roleName === '1' ? '高手' : '低手' }}
			</div>
		</template>
	</q-transfer>
	<qv-rate />
	<qv-input size="small" style="width: 1em; height: 1em; margin-right: 8px" />
</template>

<script lang="ts">
import { QvRate, QvInput } from 'qv-vue';
import { reactive, defineComponent } from 'vue';

export default defineComponent({
	name: 'App',
	components: { QvRate, QvInput },
	setup() {
		console.log('开始加载了---');

		//数据交换
		const tableData = reactive({
			leftData: [
				{ id: '1', realName: '11111', phoneNo: '1234567809', roleName: '1', duty: '发电机房间' },
				{ id: '2', realName: '22222', phoneNo: '1234567809', roleName: '2', duty: '发电机房间' },
				{ id: '3', realName: '33333', phoneNo: '1234567809', roleName: '1', duty: '发电机房间' },
			],
			rightData: [
				{ id: '4', realName: '444444', phoneNo: '1234567809', roleName: '2', duty: '发电机房间' },
				{ id: '5', realName: '555555', phoneNo: '1234567809', roleName: '1', duty: '发电机房间' },
				{ id: '6', realName: '666666', phoneNo: '1234567809', roleName: '2', duty: '发电机房间' },
			],
			config: {
				input: {
					show: true, //是否显示
					placeholder: '请输入筛选条件',
				},
				select: {
					show: true, //是否显示
					placeholder: '请选择角色',
					dicData: [{ label: '覃宏扬', value: '111' }], //选项值
				},
				page: {
					show: true, //是否显示分页
					rTotalPage: 3, //右侧分页总数
					lTotalPage: 3, //左侧分页总数
					pageSize: 100, //每页大小
				},
				columnData: [
					{ fixed: true, prop: 'realName', label: '姓名', width: 70, slot: false },
					{ fixed: false, prop: 'phoneNo', label: '电话', width: 100, slot: false },
					{ fixed: false, prop: 'roleName', label: '角色', width: 100, slot: true },
					{ fixed: false, prop: 'duty', label: '职务', width: 'auto', slot: false },
				],
			},
		});

		//分页事件
		const listenerPageChange = (val: any, type: string) => {
			/** 获取到选中的值，就可以进行你想要的操作了 */
			console.log(val, '我是返回的page数据', type);
		};
		//下拉框选择搜索事件,输入框搜索事件
		const listenerSelectInputSearch = (value: any, type: string) => {
			/** 获取到选中的值，就可以进行你想要的操作了 */
			//value 包含下拉框的值和输入框的值
			console.log(value, `我是${type}数据`);
			// 还可以根据selectValue 进行查询
			if (type === 'left') {
				//模拟查询
				let arr: any[] = [];
				tableData.leftData.forEach(item => {
					if (item.realName.includes(value.inputValue)) {
						arr.push(item);
					}
				});
				tableData.leftData = arr;
			} else if (type === 'right') {
				//模拟查询
				let arr: any[] = [];
				tableData.rightData.forEach(item => {
					if (item.realName.includes(value.inputValue)) {
						arr.push(item);
					}
				});
				tableData.rightData = arr;
			}
		};

		const listenerDataChange = (val: any[], type: string) => {
			/** 获取到选中的值，就可以进行你想要的操作了 */
			console.log(val, '我是返回的data change数据', type);
			if (type === 'left-to-right') {
				//TODO 写自己的业务
				val.forEach(item => {
					tableData.rightData.push(item);
					//删除左边移过去的数据
					delArrayById(item.id, 'left');
				});
			} else if (type === 'right-to-left') {
				//TODO 写自己的业务
				val.forEach(item => {
					tableData.leftData.push(item);
					//删除右边移过去的数据
					delArrayById(item.id, 'right');
				});
			}
		};
		const delArrayById = (id: string, type: string) => {
			if (type === 'left') {
				tableData.leftData.forEach((item, index) => {
					if (id === item.id) {
						tableData.leftData.splice(index, 1);
					}
				});
			} else {
				tableData.rightData.forEach((item, index) => {
					if (id === item.id) {
						tableData.rightData.splice(index, 1);
					}
				});
			}
		};

		return {
			listenerDataChange,
			listenerSelectInputSearch,
			listenerPageChange,
			dialogVisible: false,
			tableData,
		};
	},
});
</script>
<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
