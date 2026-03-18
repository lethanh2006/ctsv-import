import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import type { CheDoSinhVien } from '@/services/CheDoSinhVien/typings';
import { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tooltip } from 'antd';
import { useCallback, useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormCheDoChinhSach from './Form';
import FormGiaoNopSanPham from './FormGiaoNopSanPham';

const CheDoSinhVienComponent = (props: { loaiCheDoSinhVien: ELoaiCheDoSinhVien; title: string }) => {
	const intl = useIntl();
	const { handleEdit, deleteModel, getModel, setRecord, setVisibleViewForm, visibleViewForm, postModel } = useModel(
		'chedochinhsach.chedochinhsach',
	);

	const { getAllModel: getAllDanhMucChung } = useModel('quytrinh.danhmuc');

	useEffect(() => {
		getAllDanhMucChung(false, undefined, { maModule: ELoaiDanhMucChung.CHE_DO_CHINH_SACH });
	}, []);

	const onCell = (record: CheDoSinhVien.IRecord) => ({
		onClick: () => {
			setRecord(record);
			setVisibleViewForm(true);
		},
		style: { cursor: 'pointer' },
	});

	const onCancelPreview = () => {
		setVisibleViewForm(false);
	};

	const getData = () => {
		getModel({ loaiCheDoSinhVien: props.loaiCheDoSinhVien });
	};

	const columns: IColumn<CheDoSinhVien.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'kyluatkhenthuong.chedosinhvien.column.ten' }),
			dataIndex: 'ten',
			width: 200,
			onCell,
			filterType: 'string',
		},

		{
			title: intl.formatMessage({ id: 'kyluatkhenthuong.chedosinhvien.column.loai' }),
			dataIndex: 'loaiCheDoSinhVien',
			width: 120,
			align: 'center',
			filterType: 'select',
			onCell,
			filterData: Object.values(ELoaiCheDoSinhVien).map((item) => ({ value: item, label: item })),
		},
		{
			title: intl.formatMessage({ id: 'kyluatkhenthuong.chedosinhvien.column.thaotac' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: CheDoSinhVien.IRecord) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'kyluatkhenthuong.chedosinhvien.tooltip.edit' })}>
						<Button
							onClick={() => {
								handleEdit(record);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title={intl.formatMessage({ id: 'kyluatkhenthuong.chedosinhvien.tooltip.delete' })}>
						<Popconfirm
							onConfirm={() => {
								deleteModel(record._id, getData);
							}}
							title={intl.formatMessage({ id: 'kyluatkhenthuong.chedosinhvien.popconfirm.delete' })}
						>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
					<Tooltip title={intl.formatMessage({ id: 'kyluatkhenthuong.chedosinhvien.tooltip.copy' })}>
						<Button
							type='link'
							icon={<CopyOutlined />}
							onClick={() => {
								postModel(
									{
										...record,
										ten: record.ten + intl.formatMessage({ id: 'kyluatkhenthuong.chedosinhvien.copy.suffix' }),
									},
									getData,
								);
							}}
						/>
					</Tooltip>
				</>
			),
		},
	];

	const Form = useCallback(() => <FormCheDoChinhSach getData={getData} />, [props.loaiCheDoSinhVien]);

	return (
		<>
			<TableBase
				getData={getData}
				widthDrawer={800}
				Form={Form}
				title={props.title}
				modelName={'chedochinhsach.chedochinhsach'}
				columns={columns}
			/>
			<Modal
				zIndex={1000}
				styles={{ padding: 0 }}
				footer={
					<Button type='primary' onClick={onCancelPreview}>
						{intl.formatMessage({ id: 'chedosinhvien.button.ok' })}
					</Button>
				}
				width={900}
				open={visibleViewForm}
				onCancel={onCancelPreview}
			>
				<FormGiaoNopSanPham isView getData={() => {}} />
			</Modal>
		</>
	);
};

export default CheDoSinhVienComponent;
