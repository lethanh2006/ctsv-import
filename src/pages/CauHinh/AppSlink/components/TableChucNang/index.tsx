import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { type FormInstance, Switch } from 'antd';
import { useState } from 'react';
import FormThemMoi from './components/form';

interface IProps {
	value?: any;
	form: FormInstance;
	fieldName?: string;
	disabled?: boolean;
}

interface IDataTable {
	title: string;
	ma: string;
	trangThai: boolean;
}

const ChucNangTable = (props: IProps) => {
	const { value, form, fieldName, disabled } = props;
	const [edit, setEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(false);
	const [record, setRecord] = useState<any>();
	const [visibleForm, setVisibleForm] = useState<boolean>(false);

	const columns: IColumn<IDataTable>[] = [
		{
			title: 'Tên chức năng',
			dataIndex: 'title',
			width: 150,
		},
		{
			title: 'Mã chức năng',
			dataIndex: 'ma',
			width: 150,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 150,
			render: (val, rec) => {
				return (
					<Switch
						checked={val}
						onChange={(data) => {
							const dataOld = form.getFieldValue(fieldName ?? 'gioTrucTiepTrenLop');
							dataOld?.forEach((item: { ma: any }, index: any) => {
								if (item?.ma === rec?.ma) {
									dataOld?.splice(index, 1, {
										...item,
										trangThai: data,
									});
								}
							});
							form.setFieldsValue({
								[fieldName ?? 'gioTrucTiepTrenLop']: dataOld,
							});
						}}
					/>
				);
			},
		},
	];

	return (
		<>
			<TableStaticData
				addStt
				size={'small'}
				hasCreate={!disabled}
				data={value}
				columns={columns}
				setShowEdit={(val) => {
					setEdit(false);
					setRecord(undefined);
					setVisibleForm(val);
				}}
				Form={FormThemMoi}
				formProps={{
					formProps: form,
					edit: edit,
					isView: isView,
					record: record,
					setVisibleForm: setVisibleForm,
					fieldName: fieldName,
				}}
				widthDrawer={700}
				showEdit={visibleForm}
				otherProps={{
					pagination: false,
					scroll: { y: 350 },
					size: 'small',
				}}
			/>
		</>
	);
};
export default ChucNangTable;
