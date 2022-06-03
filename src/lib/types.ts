export interface ColumnItem {
	fixed: boolean;
	prop: string;
	label: string;
	width: number | string;
	slot: boolean;
}

export interface SelectItem {
	label: string;
	value: string | number;
}
export interface Input {
	show?: boolean; //是否显示
	placeholder?: string;
}
export interface Select {
	show?: boolean; //是否显示
	placeholder?: string;
	dicData?: SelectItem[]; //选项值
}
export interface Page {
	show?: boolean; //是否显示分页
	rTotalPage?: number; //右侧分页总数
	lTotalPage?: number; //左侧分页总数
	pageSize?: number; //每页大小
}
export interface Config {
	input: Input;
	select: Select;
	page: Page;
	columnData: ColumnItem[];
}
