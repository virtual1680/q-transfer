# q-transfer

### 在 Github 中有列子

#### 基于 element-plus,自定义穿梭框，带下拉，输入框搜索分页

#### vue2 走这里 https://github.com/QinHongYang/transfer

###安装
npm https://www.npmjs.com/package/q-transfer

```
vue3.0
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

//简单使用
<q-transfer
    @page-change="listenerPageChange"
    @select-input-search="listenerSelectInputSearch"
    @data-change="listenerDataChange"
    :columnDate="columnDate"
    :rTotalPage="rTotalPage"
    :lTotalPage="lTotalPage"
    :leftData="leftData"
    :rightData="rightData"
    :selectData="options"
    :pageSize="50"
  ></q-transfer>

//自定义使用
  <template>
  <q-transfer @page-change="listenerPageChange" @select-input-search="listenerSelectInputSearch" @data-change="listenerDataChange" :columnDate="columnDate" :rTotalPage="tableData.rTotalPage" :lTotalPage="tableData.lTotalPage" :leftData="tableData.leftData" :rightData="tableData.rightData" :selectData="options">
    <template v-slot:roleName="scope">
      <div>
        {{scope.data.roleName=='1'?'高手':'低手'}}
      </div>
    </template>
  </q-transfer>
</template>

<script lang="ts">
import { reactive, defineComponent } from 'vue';

export default defineComponent({
	name: 'App',
	setup() {
		console.log('开始加载了---');

		//数据交换
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
		});

		//分页事件
		const listenerPageChange = (val: any, type: string) => {
			/** 获取到选中的值，就可以进行你想要的操作了 */
			console.log(val, '我是返回的page数据', type);
		};
		//下拉框选择搜索事件,输入框搜索事件
		const listenerSelectInputSearch = (	selectValue: any,inputValue: any,type: string,) => {
			/** 获取到选中的值，就可以进行你想要的操作了 */
			console.log(selectValue,inputValue,'我是返回的select/input数据',type);
			// 还可以根据selectValue 进行查询
			if (type === 'left') {
				//模拟查询
				let arr: any[] = [];
				tableData.leftData.forEach(item => {
					if (item.realName.includes(inputValue)) {
						arr.push(item);
					}
				});
				tableData.leftData = arr;
			} else if (type === 'right') {
				//模拟查询
				let arr: any[] = [];
				tableData.rightData.forEach(item => {
					if (item.realName.includes(inputValue)) {
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
			options: [{ label: '覃宏扬', value: '111' }],
			tableData,
			columnDate: [
				{
					fixed: true,
					prop: 'realName',
					label: '姓名',
					width: 70,
					custom: false,
				},
				{
					fixed: false,
					prop: 'phoneNo',
					label: '电话',
					width: 100,
					custom: false,
				},
				{
					fixed: false,
					prop: 'roleName',
					label: '角色',
					width: 100,
					custom: true,
				},
				{
					fixed: false,
					prop: 'duty',
					label: '职务',
					width: 'auto',
					custom: false,
				},
			],
		};
	},
});
</script>
```

### 事件

| 回调方法               | 返回参数                    | 参数类型              | 触发说明                       | 返回说明                                    |
| ---------------------- | --------------------------- | --------------------- | ------------------------------ | ------------------------------------------- |
| `@page-change`         | `(page,type)`               | `(int,string)`        | 点击左 or 右的分页页数         | (页数,left or right)                        |
| `@select-input-search` | `(selectVal,inputVal,type)` | `(any,string,string)` | 输入框输入及下拉选择(左 or 右) | (下拉选中值,输入框值,left or right)         |
| `@data-change`         | `(val,type)`                | `([],string)`         | 选中数据左移或右移             | (选中的数据,left-to-right or right-to-left) |

### 参数

| 参数名       | 参数类型 | 说明及注意事项                                                                                                                                                                                                |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `columnDate` | `[]`     | 表头渲染数据(1.fixed 为 true 是当前列不能滑动，2.custom 表示是否能自定义 3.custom 为 true 时(角色为例)，可在 QTransfer 中写入 template（注意 slot="roleName"的 roleName 要与 columnDate 中的 prop 的值一致）) |
| `rTotalPage` | `number` | 右边表数据的总数(1.不需要分页时则传当前数据的长度即可)                                                                                                                                                        |
| `lTotalPage` | `number` | 左边表数据的总数(1.不需要分页时则传当前数据的长度即可)                                                                                                                                                        |
| `leftData`   | `[]`     | 左边表数据(1.字段需要与 columnDate 中 prop 的值一致)                                                                                                                                                          |
| `rightData`  | `[]`     | 右边表数据(1.字段需要与 columnDate 中 prop 的值一致)                                                                                                                                                          |
| `selectData` | `[]`     | 左右下拉框的数据(1.传[]则不显示下拉框)                                                                                                                                                                        |
| `pageSize`   | `number` | 每一页的页数大小(1.默认 100。2.不需要分页时传 10000)                                                                                                                                                          |

### 图片

![Alt text](https://github.com/QinHongYang/transfer/blob/master/WechatIMG26.png?raw=true)

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
