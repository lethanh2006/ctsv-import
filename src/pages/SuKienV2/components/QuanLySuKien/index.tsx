import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, type FormInstance, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';
import FormThemMoi from './components/form';

interface IProps {
	value?: any;
	form: FormInstance;
	fieldName?: string;
	disabled?: boolean;
	type?: 'nckh' | 'other' | 'tren-lop';
	isInit?: boolean;
	handleInitData?: () => void;
}

interface IDataTable {
	noiDung: string;
	lop: string;
	fullname: string;
	email: string;
	siSo: number;
	gioTinh: number;
	quyDoiGio: number;
	soDiem: number;
	isThanhToan: boolean;
	ghiChu: string;
	tenKyHoc: string;
	isInit: boolean;
	maHocPhan: string;
	soTinChi: number;
	heSo: number;
}

const QuanLySuKien = (props: IProps) => {
	const intl = useIntl();
	const { value, form, fieldName, disabled } = props;
	const [edit, setEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(false);
	const [record, setRecord] = useState<any>();
	const [visibleForm, setVisibleForm] = useState<boolean>(false);

	const columns: IColumn<IDataTable>[] = [
		{
			title: intl.formatMessage({ id: 'sukien.form.thongtinchung.qlsk.hoten' }),
			dataIndex: 'fullname',
			width: 150,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sukien.form.thongtinchung.qlsk.email' }),
			dataIndex: 'email',
			width: 120,
			align: 'center',
		},

		{
			title: intl.formatMessage({ id: 'sukien.form.thongtinchung.qlsk.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (recordVal: any) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
						<Button
							onClick={() => {
								setEdit(true);
								setRecord(recordVal);
								setVisibleForm(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
						<Popconfirm
							onConfirm={() => {
								const data = form.getFieldValue(fieldName ?? 'danhSachTrucTiepTrenLop') ?? [];
								form.setFieldsValue({
									//@ts-ignore
									[fieldName]: data?.filter((item: any) => item?.id !== recordVal?.id),
								});
							}}
							title={intl.formatMessage({ id: 'sukien.form.thongtinchung.qlsk.confirm.xoa' })}
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableStaticData
				addStt
				size={'small'}
				hasCreate={!disabled}
				Form={FormThemMoi}
				data={value}
				columns={columns}
				setShowEdit={(val) => {
					setEdit(false);
					setRecord(undefined);
					setVisibleForm(val);
				}}
				widthDrawer={700}
				showEdit={visibleForm}
				formProps={{
					formProps: form,
					edit: edit,
					isView: isView,
					record: record,
					setVisibleForm: setVisibleForm,
					fieldName: fieldName,
					type: props?.type,
				}}
				otherProps={{
					pagination: false,
					scroll: { y: 350 },
					size: 'small',
				}}
			/>
		</>
	);
};
export default QuanLySuKien;
