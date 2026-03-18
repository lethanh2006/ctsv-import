import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/ChuongTrinhDaoTao/KhoiHocPhanCTDT/style.less';
import ModalHocPhan from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HocPhan/components/ModalHocPhan';
import SelectDonVi from '@/pages/DaoTaoV2/ToChucNhanSu/DonVi/Select';
import type { HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { getJSONLopDuKien } from '@/services/DaoTaoV2/HocKy/LopHocPhan';
import type { LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import rules from '@/utils/rules';
import { CheckOutlined, EditOutlined, RetweetOutlined } from '@ant-design/icons';
import { Form, InputNumber, Modal, Popconfirm, Space, Switch } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ModalChiTietNhuCauHocPhan from '../NhuCauHocPhan/Modal';
import ConfirmDongBoLop from './components/ConfirmDongBoLop';
import FormDeCuong from './components/Form';
import ModalCapNhatDeCuongHPHK from './components/Modal';

const RaSoatHocPhanPage = () => {
	const { record: recordKyHoc } = useModel('daotaov2.hocky.hocky');
	const { danhSach, handleEdit, page, limit, getModel, setRecord, putModel, record } =
		useModel('daotaov2.hocphan.decuonghphk');
	const {
		getOneModel: getHocPhan,
		handleEdit: handleEditHocPhan,
		visibleForm: visibleHocPhan,
		setVisibleForm: setVisibleHocPhan,
	} = useModel('daotaov2.hocphan.hocphan');
	const { setVisibleForm: setVisibleNhuCau } = useModel('daotaov2.hocky.nhucauhocphan');
	const { record: recDonVi, setRecord: setDonVi, danhSach: danhSachDonVi } = useModel('daotaov2.tochucnhansu.donvi');
	const { formSubmiting, khoiTaoNhuCauHocPhanModel } = useModel('daotaov2.hocky.sinhvienhphk');
	const [visibleInit, setVisibleInit] = useState(false);
	const [visibleDongBo, setVisibleDongBo] = useState<boolean>(false);
	const [lopHocPhanList, setLopHocPhanList] = useState<LopHocPhan.IRecord[]>();
	const [recEditInline, setRecEditInline] = useState<HocPhan.IDeCuongHocPhanHocKy>();
	const [form] = Form.useForm();

	const getData = () => recordKyHoc?.ma && getModel({ maHocKy: recordKyHoc?.ma, maDonVi: recDonVi?.maDonVi });

	const handleNhuCau = (rec: HocPhan.IDeCuongHocPhanHocKy) => {
		setRecord(rec);
		setVisibleNhuCau(true);
	};

	const handleHocPhan = (rec: HocPhan.IDeCuongHocPhanHocKy) =>
		getHocPhan({ ma: rec.maHocPhan }).then((data) => handleEditHocPhan(data));

	const handleKeHoach = async (value: HocPhan.IDeCuongHocPhanHocKy) => {
		if (recEditInline?.soNhuCauKeHoach !== value.soNhuCauKeHoach) putModel(recEditInline?._id ?? '', value, getData);
		setRecEditInline(undefined);
	};

	const handleActive = (active: boolean, rec: HocPhan.IDeCuongHocPhanHocKy) =>
		rec._id && putModel(rec._id, { active }, getData);

	const columns: IColumn<HocPhan.IDeCuongHocPhanHocKy>[] = [
		{
			title: 'Mã HP',
			width: 80,
			dataIndex: 'maHocPhan',
			filterType: 'string',
			sortable: true,
			render: (val, rec) => (
				<a href='#!' onClick={() => handleHocPhan(rec)}>
					{val}
				</a>
			),
		},
		{
			title: 'Tên học phần',
			width: 180,
			dataIndex: 'tenHocPhan',
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Số tín chỉ',
			width: 80,
			dataIndex: 'soTinChi',
			sortable: true,
			filterType: 'number',
			align: 'center',
		},
		{
			title: 'Thông số mở lớp',
			width: 280,
			children: [
				{
					title: 'Sĩ số lớp',
					align: 'center',
					width: 80,
					render: (val, rec) => `${rec.siSoLopToiThieu ?? 0} - ${rec.siSoLopToiDa ?? 0}`,
				},
				{
					title: 'Sĩ số nhóm TH',
					align: 'center',
					width: 80,
					render: (val, rec) => `${rec.siSoNhomToiThieu ?? 0} - ${rec.siSoNhomToiDa}`,
				},
				{
					title: 'Phiên bản đề cương',
					width: 120,
					align: 'center',
					render: (val, rec) => rec.deCuong?.ma ?? <i style={{ color: 'red' }}>(chưa có đề cương)</i>,
				},
			],
		},
		{
			title: 'Số nhu cầu dự kiến',
			dataIndex: 'soNhuCauDuKien',
			width: 100,
			align: 'center',
			sortable: true,
			filterType: 'number',
			render: (val, rec) =>
				val && (
					<a href='#!' onClick={() => handleNhuCau(rec)}>
						{val}
					</a>
				),
		},
		{
			title: 'Số nhu cầu kế hoạch',
			dataIndex: 'soNhuCauKeHoach',
			width: 100,
			align: 'center',
			sortable: true,
			filterType: 'number',
			onCell: (rec) => ({
				onClick: () => {
					if (recEditInline?._id !== rec?._id) {
						setRecEditInline(rec);
						form.setFieldsValue({ soNhuCauKeHoach: rec.soNhuCauKeHoach });
					}
				},
				className: 'hovered-cell',
			}),
			render: (val, rec) =>
				recEditInline?._id === rec?._id ? (
					<Form onFinish={handleKeHoach} form={form}>
						<Form.Item name='soNhuCauKeHoach' rules={[...rules.required, ...rules.number(1000, 1, false)]} noStyle>
							<InputNumber
								autoFocus
								min={1}
								max={1000}
								style={{ width: '100%' }}
								onBlur={() =>
									form
										.validateFields()
										.then(handleKeHoach)
										.catch(() => setRecEditInline(undefined))
								}
							/>
						</Form.Item>
					</Form>
				) : (
					<span>{val ?? 0}</span>
				),
		},
		// {
		// 	title: 'Số lớp dự kiến',
		// 	// dataIndex: 'soNhuCauDuKien',
		// 	width: 100,
		// 	align: 'center',
		// 	// sortable: true,
		// 	// filterType: 'number',
		// 	render: (val, rec) =>
		// 		rec.siSoLopToiDa && Math.ceil((rec.soNhuCauKeHoach ?? rec.soNhuCauDuKien ?? 0) / rec.siSoLopToiDa),
		// },
		// {
		// 	title: 'Đơn vị quản lý',
		// 	width: 150,
		// 	dataIndex: 'maDonVi',
		// 	render: (val, rec) => rec.donVi?.ten ?? val,
		// 	hide: !!recDonVi?.maDonVi,
		// },
		// {
		// 	title: 'Ý kiến phòng ban',
		// 	dataIndex: 'trangThaiYKien',
		// 	width: 120,
		// 	align: 'center',
		// 	filterType: 'select',
		// 	filterData: Object.values(ETrangThaiYKienHocPhan).map((item) => ({ label: item, value: item })),
		// 	render: (val: ETrangThaiYKienHocPhan, rec) => (
		// 		<>
		// 			<Tag color={colorYKienHocPhan[val]}>{val}</Tag>
		// 			{rec.yKien ? (
		// 				<div>
		// 					<a href='#!' onClick={() => handleYKien(rec)}>
		// 						Xem ý kiến
		// 					</a>
		// 				</div>
		// 			) : null}
		// 		</>
		// 	),
		// },
		{
			title: 'Mở lớp',
			dataIndex: 'active',
			width: 60,
			align: 'center',
			render: (val, rec) => <Switch checked={!!val} size='small' onChange={(active) => handleActive(active, rec)} />,
		},
		{
			title: 'Thao tác',
			width: 60,
			fixed: 'right',
			align: 'center',
			render: (val, rec) => (
				<ButtonExtend icon={<EditOutlined />} tooltip='Chỉnh sửa' type='link' onClick={() => handleEdit(rec)} />
			),
		},
	];

	const syncHocPhan = () => {
		getJSONLopDuKien(recordKyHoc?.ma ?? '').then((res) => {
			setLopHocPhanList(res.data?.data);
			setVisibleDongBo(true);
		});
	};

	const onRefresh = () => {
		if (recordKyHoc?.ma)
			khoiTaoNhuCauHocPhanModel({ maHocKy: recordKyHoc?.ma })
				.then(() => {
					getModel({ maHocKy: recordKyHoc.ma });
				})
				.catch((er) => console.log(er));
	};

	return (
		<>
			<Space style={{ marginBottom: 12 }}>
				<SelectDonVi
					value={recDonVi?.maDonVi}
					style={{ width: 350 }}
					onChange={(val) => {
						setDonVi(danhSachDonVi.find((item) => item.maDonVi === val));
					}}
					allowClear
					placeholder='Chọn đơn vị quản lý'
				/>
			</Space>

			<TableBase
				modelName='daotaov2.hocphan.decuonghphk'
				columns={columns}
				dependencies={[page, limit, recordKyHoc?.ma, recDonVi?.maDonVi]}
				params={{ maHocKy: recordKyHoc?.ma, maDonVi: recDonVi?.maDonVi }}
				hideCard
				buttons={{ export: true, filter: false }}
				Form={FormDeCuong}
				widthDrawer={800}
				otherButtons={[
					<Popconfirm key='3' onConfirm={onRefresh} title='Xác nhận rà soát số nhu cầu học phần?'>
						<ButtonExtend tooltip='Rà soát nhu cầu học phần' icon={<RetweetOutlined />} loading={formSubmiting}>
							Rà soát
						</ButtonExtend>
					</Popconfirm>,
					<ButtonExtend
						key='4'
						tooltip='Cập nhật thông số sĩ số mở lớp'
						icon={<EditOutlined />}
						onClick={() => setVisibleInit(true)}
						disabled={!danhSach?.length}
					>
						Cập nhật thông số
					</ButtonExtend>,
					<ButtonExtend
						key='2'
						className='btn-success'
						icon={<CheckOutlined />}
						onClick={() => syncHocPhan()}
						disabled={!danhSach?.length}
					>
						Lưu DS lớp tín chỉ
					</ButtonExtend>,
				]}
			/>

			<ModalCapNhatDeCuongHPHK
				visible={visibleInit}
				setVisible={setVisibleInit}
				getData={() => getModel({ maHocKy: recordKyHoc?.ma })}
			/>

			<Modal
				styles={{ padding: 0 }}
				width={1000}
				open={visibleHocPhan}
				onCancel={() => setVisibleHocPhan(false)}
				footer={null}
			>
				<ModalHocPhan title='Học phần' focusDeCuong />
			</Modal>

			<ConfirmDongBoLop visible={visibleDongBo} setVisible={setVisibleDongBo} lopHocPhanList={lopHocPhanList} />

			<ModalChiTietNhuCauHocPhan maHocPhan={record?.maHocPhan ?? ''} deCuongHphk={record} />
		</>
	);
};

export default RaSoatHocPhanPage;
