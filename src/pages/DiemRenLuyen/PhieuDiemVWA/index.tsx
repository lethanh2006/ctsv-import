import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { PhieuDiemRenLuyen } from '@/services/DiemRenLuyen/PhieuDiem/typings';
import {
	ETrangThaiChamDiem,
	EXepLoai,
	MapKeyNameTrangThaiChamDiem,
	MapKeyNameXepLoai,
} from '@/services/DiemRenLuyen/constants';
import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tooltip } from 'antd';
import { useCallback, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDotDiemRenLuyen from '../DotVWA/components/SelectDot';
import FormPhieuDiem from './components/Form';
import FormCapNhatTrangThai from './components/FormCapNhatTrangThai';

const PhieuDiemRenLuyenComponent = (props: { ssoId?: string; hideCard?: boolean }) => {
	const intl = useIntl();
	const {
		handleEdit,
		deleteModel,
		page,
		limit,
		condition,
		setCondition,
		getModel,
		// danhSach: danhSachPhieuDiem,
	} = useModel('diemrenluyen.phieudiem');
	const { danhSach } = useModel('diemrenluyen.dotvwa');
	const { danhSach: danhSachHocKy } = useModel('daotaov2.hocky.hocky');
	const getData = () => {
		getModel({ 'thongTinNguoiTao.ssoId': props?.ssoId });
	};
	const [visibleFormDoiTrangThai, setVisibleFormDoiTrangThai] = useState(false);

	const column: IColumn<PhieuDiemRenLuyen.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.column.hocky' }),
			dataIndex: 'dotDrlId',
			width: 150,
			render: (val) => danhSachHocKy.find((item) => item.ma === danhSach.find((ele) => ele._id === val)?.maHocKy)?.ten,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.column.hovaten' }),
			dataIndex: ['thongTinNguoiTao', 'ten'],
			width: 150,
			filterType: 'string',
			render: (val, rec) => rec.thongTinNguoiTao.ten,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.column.masinhvien' }),
			dataIndex: ['thongTinNguoiTao', 'ma'],
			width: 120,
			filterType: 'string',
			render: (val, rec) => rec.thongTinNguoiTao.ma,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.column.lop' }),
			dataIndex: 'maLopHanhChinh',
			width: 100,
			filterType: 'string',
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.column.nganh' }),
			dataIndex: 'nganh',
			width: 150,
			filterType: 'string',
			align: 'center',
			render: (val) => val?.ten,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.column.trangthai' }),
			dataIndex: 'trangThai',
			width: 150,
			filterType: 'select',
			filterData: Object.values(ETrangThaiChamDiem).map((item) => ({
				value: item,
				label: MapKeyNameTrangThaiChamDiem[item],
			})),
			render: (val: ETrangThaiChamDiem) => MapKeyNameTrangThaiChamDiem[val],
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.column.diem' }),
			dataIndex: 'diemSo',
			width: 100,
			sortable: true,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.column.xeploai' }),
			dataIndex: 'xepLoai',
			width: 150,
			filterType: 'select',
			filterData: Object.values(EXepLoai).map((item) => ({
				value: item,
				label: MapKeyNameXepLoai[item],
			})),
			render: (val: EXepLoai) => MapKeyNameXepLoai[val],
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.column.diemtrungbinh' }),
			width: 150,
			dataIndex: 'diemTrungBinh',
			align: 'center',
			// hide: props.ssoId ? false : true,
			// sortable: true,
			// render: (val, rec, index) => {
			// 	return (
			// 		danhSachPhieuDiem?.filter((item, ind) => ind <= index)?.reduce((pre, cur) => pre + cur?.diemSo ?? 0, 0) /
			// 		(index + 1)
			// 	).toFixed(2);
			// },
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (rec: PhieuDiemRenLuyen.IRecord) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.tooltip.edit' })}>
						<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title={intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.tooltip.delete' })}>
						<Popconfirm
							onConfirm={() => deleteModel(rec._id, getData)}
							title={intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.confirm.delete' })}
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	const Form = useCallback(() => <FormPhieuDiem ssoId={props.ssoId} />, [props.ssoId]);

	return (
		<>
			<TableBase
				params={{ dotDrlId: condition?.dotDrlId }}
				buttons={{ import: true, export: true }}
				hideCard={props?.hideCard}
				getData={getData}
				otherButtons={[
					<SelectDotDiemRenLuyen
						allowClear
						value={condition?.dotDrlId}
						isSetRecord
						style={{ width: 250 }}
						onChange={(val) => {
							setCondition({ ...condition, dotDrlId: val });
						}}
						key={'dot'}
					/>,
					<Tooltip
						title={
							!condition?.dotDrlId ? intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.tooltip.selecthocky' }) : ''
						}
						key={'trangthai'}
					>
						<Button
							disabled={!condition?.dotDrlId}
							onClick={() => {
								setVisibleFormDoiTrangThai(true);
							}}
							type='primary'
							icon={<CheckOutlined />}
						>
							{intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.button.capnhattrangthai' })}
						</Button>
					</Tooltip>,
				]}
				widthDrawer={700}
				Form={Form}
				title={intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.title' })}
				columns={column}
				modelName={'diemrenluyen.phieudiem'}
				dependencies={[page, limit]}
			/>
			<Modal
				open={visibleFormDoiTrangThai}
				onCancel={() => {
					setVisibleFormDoiTrangThai(false);
				}}
				footer={null}
				styles={{ body: { padding: 0 } }}
			>
				<FormCapNhatTrangThai getData={getData} onCancel={() => setVisibleFormDoiTrangThai(false)} />
			</Modal>
		</>
	);
};

export default PhieuDiemRenLuyenComponent;
