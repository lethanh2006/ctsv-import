import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import SelectCapKyLuat from '@/pages/DanhMuc/CapKyLuat/components/Select';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Tooltip, message } from 'antd';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import { FormKyLuat, type FormKyLuatProps } from './components/Form';
import { type KyLuat } from '@/services/KhenThuongKyLuat/KyLuat/typing';
import { useEffect, useRef } from 'react';

export default () => {
	const {
		setEdit,
		setVisibleForm,
		visibleForm,
		setRecord,
		// getModel,
		// page,
		// limit,
		// deleteModel,
		condition,
		setCondition,
		setDanhSach,
		danhSach,
		record,
		edit,
		handleView,
		setIsView,
	} = useModel('khenthuongkyluat.kyluat');

	const handleEdit = (tableRecord: KyLuat.IRecord) => {
		setRecord(tableRecord);
		setVisibleForm(true);
		setEdit(true);
		setIsView(false);
	};

	const onCell = (rec: KyLuat.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});
	const columns: IColumn<KyLuat.IRecord>[] = [
		{
			title: 'Sinh viên',
			dataIndex: 'hoTen',
			filterType: 'string',
			width: 160,
			onCell,
		},

		// {
		// 	title: 'Cơ quan quyết định',
		// 	dataIndex: 'coQuanQuyetDinh',
		// 	width: 160,
		// 	filterType: 'string',
		// 	sortable: true,
		// },

		{
			title: 'Cấp kỷ luật',
			width: 160,
			dataIndex: 'capKyLuatId',
			filterType: 'customselect',
			onCell,
			// sortable: true,
			render: (val, rec) => rec.capKyLuat?.ten,
			filterCustomSelect: (
				<div style={{ paddingRight: 8 }}>
					<SelectCapKyLuat
						value={condition?.capKyLuatId}
						onChange={(value) => {
							setCondition((state: any) => ({ ...state, capKyLuatId: isEmpty(value) ? undefined : value }));
						}}
						style={{ width: '100%', paddingRight: 8 }}
						hasCreate={false}
						multiple
					/>
				</div>
			),
		},
		{
			title: 'Số quyết định',
			dataIndex: 'soQuyetDinh',
			width: 140,
			filterType: 'string',
			sortable: true,
			onCell,
		},

		{
			title: 'Người ký',
			dataIndex: 'nguoiKy',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},

		{
			title: 'Ngày quyết định',
			width: 140,
			dataIndex: 'ngayQuyetDinh',
			filterType: 'date',
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			sortable: true,
			align: 'center',
			onCell,
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',

			render: (_, tableRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(tableRecord)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								setDanhSach((state) => state.filter((item) => item._id !== tableRecord._id));
								message.success('Xóa thành công');
							}}
							title='Bạn có chắc chắn muốn xóa kỷ luật này?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	const mounted = useRef(false);

	useEffect(() => {
		try {
			if (mounted.current) {
				localStorage.setItem('danhSachKyLuat', JSON.stringify(danhSach ?? []));
			}
		} catch {
			/** empty */
		}
	}, [danhSach]);

	useEffect(() => {
		try {
			if (!danhSach?.length) {
				const localData = JSON.parse(localStorage.getItem('danhSachKyLuat') ?? '');
				setDanhSach(Array.isArray(localData) ? localData : []);
			}
		} catch {
			setDanhSach([]);
			/** empty */
		}
		mounted.current = true;
	}, []);

	return (
		<Card title='Kỷ luật'>
			<TableStaticData
				columns={columns}
				addStt
				data={danhSach ?? []}
				hasCreate
				showEdit={visibleForm}
				setShowEdit={(vi) => {
					setVisibleForm(vi);
					setIsView(false);
					setEdit(false);
				}}
				widthDrawer={700}
				Form={FormKyLuat}
				formProps={
					{
						onFinishProps: (value) => {
							setDanhSach((state) => {
								if (edit) {
									return state.map<any>((item) => {
										if (record?._id === item._id) {
											return {
												...item,
												...value,
											};
										}
										return item;
									});
								} else {
									return state.concat({
										...value,
										_id: Math.random().toString(36).slice(2),
									} as any);
								}
							});
						},
					} as FormKyLuatProps
				}
			/>
		</Card>
	);

	// return (
	// 	<TableBase
	// 		columns={columns}
	// 		dependencies={[page, limit, condition]}
	// 		modelName='khenthuongkyluat.kyluat'
	// 		Form={FormKyLuatAll}
	// 		title='Kỷ luật'
	// 		widthDrawer={700}
	// 		buttons={{ export: true }}
	// 	/>
	// );
};
