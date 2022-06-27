# q-transfer

#### 基于 element-plus,自定义穿梭框，带下拉，输入框搜索分页

#### vue2 版本不在维护

### 安装

npm https://www.npmjs.com/package/q-transfer

```
npm install element-plus
npm install q-transfer

```

###使用

```
main.js
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import QTransfer from 'q-transfer';
import 'q-transfer/index.css';

app.use(ElementPlus);
app.use(qTransfer);

<q-transfer
		@page-change="listenerPageChange"
		@select-input-search="listenerSelectInputSearch"
		@data-change="listenerDataChange"
		:leftData="tableData.leftData"
		:rightData="tableData.rightData"
		:config="tableData.config">
		<!-- 自定义插槽 在config columnData 中设置slot:true -->
		<template v-slot:roleName="scope">
			<div>
				{{ scope.data.roleName == '1' ? '高手' : '低手' }}
			</div>
		</template>
	</q-transfer>

<script lang="ts">
import { reactive, defineComponent } from 'vue';

export default defineComponent({
	name: 'App',
	setup() {
		console.log('开始加载了---');

		const tableData = reactive({
			rTotalPage: 0,
			lTotalPage: 0,
			leftData: [
				{id: '1',realName: '11111',phoneNo: '1234567809',roleName: '1',duty: '发电机房间',},
				{id: '2',realName: '22222',phoneNo: '1234567809',roleName: '2',duty: '发电机房间',},
				{id: '3',	realName: '33333',	phoneNo: '1234567809',roleName: '1',duty: '发电机房间',},
			],
			rightData: [
				{id: '4',realName: '444444',phoneNo: '1234567809',roleName: '2',duty: '发电机房间',},
				{id: '5',realName: '555555',phoneNo: '1234567809',roleName: '1',duty: '发电机房间',},
				{id: '6',realName: '666666',phoneNo: '1234567809',roleName: '2',duty: '发电机房间',},
			],
			config: {
				input: {
					show: true, //是否显示输入框
					placeholder: '请输入筛选条件',
				},
				select: {
					show: true, //是否显示下拉框
					placeholder: '请选择角色',
					dicData: [{ label: '覃宏扬', value: '111' }], //选项值
				},
				page: {
					show: true, //是否显示分页
					rTotalPage: 3, //右侧分页总数
					lTotalPage: 3, //左侧分页总数
					pageSize: 100, //每页大小
				},
				//表头渲染数据(1.fixed 为 true 是当前列不能滑动，2.slot 是否使用插槽 注意 slot="roleName"的 roleName 要与 columnData 中的 prop 的值一致）)
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
```

### 事件

| 回调方法               | 返回参数       | 参数类型              | 触发说明                       | 返回说明                                    |
| ---------------------- | -------------- | --------------------- | ------------------------------ | ------------------------------------------- |
| `@page-change`         | `(page,type)`  | `(int,string)`        | 点击左 or 右的分页页数         | (页数,left or right)                        |
| `@select-input-search` | `(value,type)` | `(any,string,string)` | 输入框输入及下拉选择(左 or 右) | (下拉选中值和输入框值,left or right)        |
| `@data-change`         | `(val,type)`   | `([],string)`         | 选中数据左移或右移             | (选中的数据,left-to-right or right-to-left) |

### 参数

| 参数名      | 参数类型 | 说明及注意事项                                       |
| ----------- | -------- | ---------------------------------------------------- |
| `leftData`  | `[]`     | 左边表数据(1.字段需要与 columnDate 中 prop 的值一致) |
| `rightData` | `[]`     | 右边表数据(1.字段需要与 columnDate 中 prop 的值一致) |
| `config`    | `Object` | 实例中含全部配置及说明                               |

### 图片

![Alt text](https://github.com/virtual1680/q-transfer/blob/master/WechatIMG26.png?raw=true)

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
