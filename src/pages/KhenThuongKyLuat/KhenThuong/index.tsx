import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type QuyetDinhKhenThuong } from '@/services/KhenThuong/QuyetDinhKhenThuong/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Tooltip, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import { useIntl, useModel } from 'umi';
import {
	FormKhenThuongTheoQuyetDinh,
	type FormKhenThuongTheoQuyetDinhProps,
} from './components/FormKhenThuongTheoQuyetDinh';

export default () => {
	const intl = useIntl();
	const {
		handleEdit: handleEdit_,
		handleView,
		visibleForm,
		setVisibleForm,
		setDanhSach,
		danhSach,
		record,
		edit,
		setEdit,
		setIsView,
	} = useModel('khenthuongkyluat.khenthuong.quyetdinhkhenthuong');

	const handleEdit = (tableRecord: QuyetDinhKhenThuong.IRecord) => {
		handleEdit_(tableRecord);
		setVisibleForm(true);
		setEdit(true);
		setIsView(false);
	};

	const onCell = (rec: QuyetDinhKhenThuong.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});
	const columns: IColumn<QuyetDinhKhenThuong.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'kyluatkhenthuong.catagory.column.soquyetdinh' }),
			dataIndex: 'soQuyetDinh',
			width: 160,
			filterType: 'string',
			onCell,
		},
		// {
		// 	title: 'Cơ quan quyết định',
		// 	dataIndex: 'coQuanQuyetDinh',
		// 	width: 180,
		// 	filterType: 'string',
		// onCell,
		// },
		{
			title: intl.formatMessage({ id: 'kyluatkhenthuong.catagory.column.ngayquyetdinh' }),
			width: 160,
			dataIndex: 'ngayQuyetDinh',
			filterType: 'date',
			sortable: true,
			onCell,
			align: 'center',
			render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : null),
		},
		{
			title: intl.formatMessage({ id: 'kyluatkhenthuong.catagory.column.ngayky' }),
			width: 160,
			dataIndex: 'ngayKy',
			filterType: 'date',
			sortable: true,
			onCell,
			align: 'center',
			render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : null),
		},

		{
			title: intl.formatMessage({ id: 'kyluatkhenthuong.catagory.column.nguoiky' }),
			dataIndex: 'nguoiKy',
			width: 160,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'kyluatkhenthuong.catagory.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (_, tableRecord) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'kyluatkhenthuong.catagory.tooltip.chinhsua' })}>
						<Button onClick={() => handleEdit(tableRecord)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title={intl.formatMessage({ id: 'kyluatkhenthuong.catagory.tooltip.xoa' })}>
						<Popconfirm
							onConfirm={() => {
								setDanhSach((state) => state.filter((item) => item._id !== tableRecord._id));
								message.success(intl.formatMessage({ id: 'kyluatkhenthuong.catagory.message.success.delete' }));
							}}
							title={intl.formatMessage({ id: 'kyluatkhenthuong.catagory.tooltip.confirm.delete' })}
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
				localStorage.setItem('danhSachQuyetDinhKhenThuong', JSON.stringify(danhSach ?? []));
			}
		} catch {
			/** empty */
		}
	}, [danhSach]);

	useEffect(() => {
		try {
			if (!danhSach?.length) {
				const localData = JSON.parse(localStorage.getItem('danhSachQuyetDinhKhenThuong') ?? '');
				setDanhSach(Array.isArray(localData) ? localData : []);
			}
		} catch {
			setDanhSach([]);
			/** empty */
		}
		mounted.current = true;
	}, []);
	return (
		<Card title={intl.formatMessage({ id: 'kyluatkhenthuong.catagory.title' })}>
			<TableStaticData
				addStt
				data={danhSach ?? []}
				columns={columns}
				hasCreate
				showEdit={visibleForm}
				setShowEdit={(vi) => {
					setVisibleForm(vi);
					setIsView(false);
					setEdit(false);
				}}
				Form={FormKhenThuongTheoQuyetDinh as any}
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
					} as FormKhenThuongTheoQuyetDinhProps
				}
				widthDrawer={900}
			/>
		</Card>
	);
};
