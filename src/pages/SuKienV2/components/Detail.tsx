import ExpandText from '@/components/ExpandText';
import type { IColumn } from '@/components/Table/typing';
import DanhSachSinhVien from '@/pages/SuKienV2/components/DanhSachSinhVien';
import ThongTinChung from '@/pages/SuKienV2/components/ThongTinChung';
import { ELoaiSoLuong, ETrangThaiDienRa } from '@/services/SuKienV2/constant';
import { type SuKienV2 } from '@/services/SuKienV2/typings';
import { EVaiTroBieuMau } from '@/services/TienIch/constant';
import { inputFormat } from '@/utils/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tabs, Tag } from 'antd';
import { first } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ThongKeKhaoSat from './ThongKeKhaoSat';

export const Detail = () => {
	const intl = useIntl();
	const { deleteModel, handleEdit, setIsVisibleFormDetail, record, isVisibleFormDetail, getModel } =
		useModel('sukienv2');

	const [activeKey, setActiveKey] = useState<string | undefined>();
	const [danhSachNhanSu, setDanhSachNhanSu] = useState<SuKienV2.IUser[]>([]);
	const [danhSachSinhVien, setDanhSachSinhVien] = useState<SuKienV2.IUser[]>([]);

	const roles = record?.roles?.length ? record?.roles : record?.filter?.roles;
	const danhSachDoiTuong = [
		...(record?.filter?.idKhoa ?? []),
		...(record?.filter?.idKhoaSinhVien ?? []),
		...(record?.filter?.idLopHanhChinh ?? []),
		...(record?.filter?.idLopHocPhan ?? []),
		...(record?.filter?.idNganh ?? []),
	];
	const columns: IColumn<SuKienV2.IKinhPhiDuTru>[] = [
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.column.noidung' }),
			width: 200,
			dataIndex: 'noiDung',
			align: 'center',
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.column.donvitinh' }),
			width: 90,
			dataIndex: 'dvTinh',
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.column.soluong' }),
			// dataIndex: 'soLuong',
			width: 150,
			// align: 'center',
			children: [
				{
					title: intl.formatMessage({ id: 'sukien.chitiet.column.nguoi' }),
					dataIndex: 'soLuong',
					align: 'center',
					width: 80,
					render: (val, recordVal) => {
						return <>{recordVal?.loaiSoLuong === ELoaiSoLuong.NGUOI && inputFormat(val)}</>;
					},
				},
				{
					title: intl.formatMessage({ id: 'sukien.chitiet.column.ngay' }),
					dataIndex: 'soLuong',
					align: 'center',
					width: 80,
					render: (val, recordVal) => {
						return <>{recordVal?.loaiSoLuong === ELoaiSoLuong.NGAY && inputFormat(val)}</>;
					},
				},
				{
					title: intl.formatMessage({ id: 'sukien.chitiet.column.khac' }),
					dataIndex: 'soLuong',
					align: 'center',
					width: 80,
					render: (val, recordVal) => {
						return <>{recordVal?.loaiSoLuong === ELoaiSoLuong.KHAC && inputFormat(val)}</>;
					},
				},
			],
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.column.luot' }),
			dataIndex: 'luot',
			width: 90,
			align: 'center',
			render: (val) => inputFormat(+val),
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.column.phong' }),
			dataIndex: 'phong',
			width: 120,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.column.dinhmuc' }),
			dataIndex: 'dinhMuc',
			width: 90,
			align: 'center',
			render: (val) => inputFormat(+val),
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.column.dutoan' }),
			dataIndex: 'duToan',
			width: 120,
			align: 'center',
			render: (val) => inputFormat(+val),
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.column.phanbonguon' }),
			// dataIndex: 'phanBoNguon',
			width: 300,
			align: 'center',
			children: [
				{
					title: intl.formatMessage({ id: 'sukien.chitiet.column.nsnn' }),
					dataIndex: 'nguonNSNN',
					width: 100,
					align: 'center',
					render: (val) => inputFormat(+val),
				},
				{
					title: intl.formatMessage({ id: 'sukien.chitiet.column.tuchu' }),
					dataIndex: 'nguonTuChu',
					width: 100,
					align: 'center',
					render: (val) => inputFormat(+val),
				},
				{
					title: intl.formatMessage({ id: 'sukien.chitiet.column.taitro' }),
					dataIndex: 'nguonTaiTro',
					width: 100,
					align: 'center',
					render: (val) => inputFormat(+val),
				},
			],
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.column.tiendo' }),
			dataIndex: 'hoanThanh',
			width: 120,
			align: 'center',
			render: (val) =>
				val ? (
					<Tag color={'green'}>{intl.formatMessage({ id: 'sukien.chitiet.column.hoanthanh' })}</Tag>
				) : (
					<Tag color={'red'}>{intl.formatMessage({ id: 'sukien.chitiet.column.chuahoanthanh' })}</Tag>
				),
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.column.chungtu' }),
			dataIndex: 'chungTuYeuCau',
			width: 150,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sukien.chitiet.column.ykientckt' }),
			dataIndex: 'yKienTCKT',
			width: 200,
			align: 'center',
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
	];
	useEffect(() => {
		if (isVisibleFormDetail) {
			setDanhSachNhanSu((record?.users ?? [])?.filter((item) => item.vaiTro === EVaiTroBieuMau.NHAN_VIEN));
			setDanhSachSinhVien((record?.users ?? [])?.filter((item) => item.vaiTro === EVaiTroBieuMau.SINH_VIEN));
			setActiveKey(first(record?.roles ?? []));
		} else {
			setDanhSachNhanSu([]);
			setDanhSachSinhVien([]);
			setActiveKey(undefined);
		}
	}, [record?._id, isVisibleFormDetail]);

	return (
		<Modal
			styles={{ body: { paddingTop: 4 } }}
			width={1000}
			open={isVisibleFormDetail}
			title={intl.formatMessage({ id: 'sukien.chitiet.title' })}
			destroyOnClose
			onCancel={() => setIsVisibleFormDetail(false)}
			footer={null}
		>
			<Tabs destroyInactiveTabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sukien.chitiet.thongtin' })} key='item-1'>
					<ThongTinChung data={record as SuKienV2.IRecord} />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sukien.chitiet.danhsachdangky' })} key='item-2'>
					<DanhSachSinhVien
						type={'Đăng ký'}
						// disabled={[ETrangThaiDienRa.DANG_DIEN_RA, ETrangThaiDienRa.DA_DIEN_RA].includes(
						// 	record?.trangThai as ETrangThaiDienRa,
						// )}
					/>
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sukien.chitiet.danhsachthamgia' })} key='item-3'>
					<DanhSachSinhVien
						type={'Tham gia'}
						// disabled={[ETrangThaiDienRa.DANG_DIEN_RA, ETrangThaiDienRa.DA_DIEN_RA].includes(
						// 	record?.trangThai as ETrangThaiDienRa,
						// )}
					/>
				</Tabs.TabPane>
				{/* {(record?.idKhaoSatCheckOut || record?.idKhaoSatDangKy || record?.idKhaoSatCheckIn) && ( */}
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sukien.chitiet.thongkekhaosat' })} key='item-4'>
					<ThongKeKhaoSat />
				</Tabs.TabPane>
				{/* )} */}
			</Tabs>
			<div className='form-footer'>
				<Button
					disabled={[ETrangThaiDienRa.DANG_DIEN_RA, ETrangThaiDienRa.DA_DIEN_RA].includes(
						record?.trangThai as ETrangThaiDienRa,
					)}
					type='primary'
					onClick={() => {
						handleEdit(record);
						setIsVisibleFormDetail(false);
					}}
					icon={<EditOutlined />}
				>
					{intl.formatMessage({ id: 'global.button.chinhsua' })}
				</Button>
				<Popconfirm
					title={intl.formatMessage({ id: 'sukien.chitiet.confirm.delete' })}
					onConfirm={() => {
						deleteModel(record?._id ?? '', getModel);
						setIsVisibleFormDetail(false);
					}}
					disabled={[ETrangThaiDienRa.DANG_DIEN_RA, ETrangThaiDienRa.DA_DIEN_RA].includes(
						record?.trangThai as ETrangThaiDienRa,
					)}
				>
					<Button
						disabled={[ETrangThaiDienRa.DANG_DIEN_RA, ETrangThaiDienRa.DA_DIEN_RA].includes(
							record?.trangThai as ETrangThaiDienRa,
						)}
						danger
						icon={<DeleteOutlined />}
					>
						{intl.formatMessage({ id: 'global.button.xoa' })}
					</Button>
				</Popconfirm>

				<Button onClick={() => setIsVisibleFormDetail(false)}>
					{intl.formatMessage({ id: 'global.button.dong' })}
				</Button>
			</div>
		</Modal>
	);
};
