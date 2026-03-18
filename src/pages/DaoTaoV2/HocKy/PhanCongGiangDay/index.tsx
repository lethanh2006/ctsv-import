import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalImport from '@/components/Table/Import';
import { type IColumn } from '@/components/Table/typing';
import CardFilterHocPhanHocKy from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HocPhan/components/CardFilterHocPhan';
import SelectDonVi from '@/pages/DaoTaoV2/ToChucNhanSu/DonVi/Select';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import {
	ELoaiLopHocPhan,
	ETrangThaiDuyetGiangDay,
	ETrangThaiLopHocPhan,
	colorTrangThaiDuyetGiangDay,
} from '@/services/DaoTaoV2/HocKy/constant';
import { CheckCircleOutlined, CheckOutlined, ImportOutlined, TeamOutlined } from '@ant-design/icons';
import { Card, Col, Modal, Row, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useIntl, useModel } from 'umi';
import FilterHocKy from '../HocKy/components/FilterHocKy';
import ModalPhanCongGiangDay from './components/ModalPhanCongGiangDay';
import StatPhanCongGiangDay from './components/Statistics';
import CauHinhThoiGianHocKyPage from '../CauHinhHocKy/ThoiGianHocKy';

const PhanCongGiangDayPage = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, duyetGiangDayLopHocPhanModel, getModel, thongKeTrangThaiDuyetGiangDay } =
		useModel('daotaov2.hocky.lophocphan');
	const { record: recHocKy, visibleForm, setVisibleForm } = useModel('daotaov2.hocky.hocky');
	const { record: recHocPhan, setRecord: setHocPhan } = useModel('daotaov2.hocphan.decuonghphk');
	const { record: recDonVi, setRecord: setDonVi, danhSach: danhSachDonVi } = useModel('daotaov2.tochucnhansu.donvi');
	const [visibleImport, setVisibleImport] = useState(false);
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('40%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	const getData = () =>
		recHocKy?.ma &&
		getModel({
			maHocKy: recHocKy?.ma,
			loai: ELoaiLopHocPhan.CHINH,
			maHocPhan: recHocPhan?.maHocPhan,
			trangThaiLop: ETrangThaiLopHocPhan.MO,
		});

	const onCell = (rec: LopHocPhan.IRecord) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const handleDuyet = (lopHocPhanId?: string): void => {
		if (lopHocPhanId && recHocKy?.ma)
			duyetGiangDayLopHocPhanModel(recHocKy.ma, {
				trangThaiDuyetGiangDay: ETrangThaiDuyetGiangDay.DA_DUYET,
				lopHocPhanIds: [lopHocPhanId],
			})
				.then(() => {
					getData();
				})
				.catch((er) => console.log(er));
	};

	const handleDuyetAll = () => {
		if (recHocKy?.ma && thongKeTrangThaiDuyetGiangDay?.[ETrangThaiDuyetGiangDay.DANG_XU_LY])
			Modal.confirm({
				title: 'Duyệt phân công giảng dạy',
				content: recHocPhan?.maHocPhan ? (
					<>
						Xác nhận duyệt phân công giảng dạy cho{' '}
						<b>{thongKeTrangThaiDuyetGiangDay[ETrangThaiDuyetGiangDay.DANG_XU_LY]}</b> lớp tín chỉ của học phần{' '}
						<b>{recHocPhan.tenHocPhan}</b> ?
					</>
				) : (
					<>
						Xác nhận duyệt phân công giảng dạy cho{' '}
						<b>{thongKeTrangThaiDuyetGiangDay[ETrangThaiDuyetGiangDay.DANG_XU_LY]}</b> lớp tín chỉ trong học kỳ{' '}
						<b>{recHocKy.ten}</b> ?
					</>
				),
				onOk: () =>
					duyetGiangDayLopHocPhanModel(recHocKy.ma, {
						trangThaiDuyetGiangDay: ETrangThaiDuyetGiangDay.DA_DUYET,
						maHocPhan: recHocPhan?.maHocPhan,
					})
						.then(() => {
							getData();
						})
						.catch((er) => console.log(er)),
			});
	};

	const columns: IColumn<LopHocPhan.IRecord>[] = [
		{
			title: 'Mã lớp',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Sĩ số',
			dataIndex: 'siSo',
			width: 80,
			align: 'center',
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Giảng viên',
			width: 180,
			render: (val, rec) => (
				<ExpandText>
					{rec.nhanSuList
						?.map((item) =>
							item.nhanSu?.ten ? `${item.nhanSu?.hoDem ?? ''} ${item.nhanSu?.ten ?? ''}` : item.tenNhanSu,
						)
						.join(', ')}
				</ExpandText>
			),
			onCell,
		},
		{
			title: 'Trạng thái',
			width: 120,
			dataIndex: 'trangThaiDuyetGiangDay',
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiDuyetGiangDay).map((item) => ({ label: item, value: item })),
			render: (val: ETrangThaiDuyetGiangDay) => <Tag color={colorTrangThaiDuyetGiangDay?.[val]}>{val}</Tag>,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (rec: LopHocPhan.IRecord) => (
				<>
					<ButtonExtend tooltip='DS nhân sự' onClick={() => handleEdit(rec)} type='link' icon={<TeamOutlined />} />
					<ButtonExtend
						tooltip='Duyệt phân công'
						onClick={() => handleDuyet(rec._id)}
						type='link'
						icon={<CheckOutlined />}
						className='btn-success'
						disabled={rec.trangThaiDuyetGiangDay !== ETrangThaiDuyetGiangDay.DANG_XU_LY}
					/>
				</>
			),
		},
	];

	return (
		<>
			<Card title={intl.formatMessage({ id: 'kyhoc.phanconggiangday.title' })}>
				<Space wrap style={{ marginBottom: 8 }}>
					<FilterHocKy isSetHocKy />
					<SelectDonVi
						value={recDonVi?.maDonVi}
						style={{ width: 350 }}
						onChange={(val) => {
							setDonVi(danhSachDonVi.find((item) => item.maDonVi === val));
							setHocPhan(undefined);
						}}
						allowClear
						placeholder='Chọn đơn vị quản lý'
					/>
					{recHocKy?.tgBdPhanCongGiangDay && recHocKy.tgKtPhanCongGiangDay ? (
						<a href='#!' onClick={() => setVisibleForm(true)}>
							Thời gian phân công giảng dạy từ {dayjs(recHocKy.tgBdPhanCongGiangDay).format('DD/MM/YYYY')} đến{' '}
							{dayjs(recHocKy.tgKtPhanCongGiangDay).format('DD/MM/YYYY')}
						</a>
					) : recHocKy?._id ? (
						<ButtonExtend onClick={() => setVisibleForm(true)}>Cấu hình thời gian phân công</ButtonExtend>
					) : null}
				</Space>

				<Row gutter={[12, 12]}>
					<Col span={24}>
						<StatPhanCongGiangDay />
					</Col>

					<Col span={24}>
						<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
							<Pane initialSize={paneSize} minSize='20%'>
								<CardFilterHocPhanHocKy />
							</Pane>

							<Pane minSize='40%'>
								<Card
									title={`Danh sách lớp tín chỉ ${recHocPhan?.maHocPhan ?? ''}`}
									headStyle={{ padding: 0 }}
									styles={{ padding: '8px 0 0' }}
									bordered={false}
								>
									<TableBase
										columns={columns}
										getData={getData}
										dependencies={[page, limit, recHocKy?.ma, recHocPhan?.maHocPhan]}
										modelName='daotaov2.hocky.lophocphan'
										Form={ModalPhanCongGiangDay}
										formProps={{ getData }}
										widthDrawer={1000}
										buttons={{ create: false, filter: false }}
										hideCard
										otherButtons={[
											<ButtonExtend
												key='1'
												type='primary'
												className='btn-success'
												icon={<CheckCircleOutlined />}
												onClick={handleDuyetAll}
												notHideText
												disabled={!thongKeTrangThaiDuyetGiangDay?.[ETrangThaiDuyetGiangDay.DANG_XU_LY]}
											>
												Duyệt phân công
											</ButtonExtend>,
											<ButtonExtend key='2' icon={<ImportOutlined />} onClick={() => setVisibleImport(true)}>
												Nhập DS phân công
											</ButtonExtend>,
										]}
									/>
								</Card>
							</Pane>
						</SplitPane>
					</Col>
				</Row>
			</Card>

			<ModalImport
				modelName='daotaov2.hocky.nhansulophocphan'
				onCancel={() => setVisibleImport(false)}
				onOk={() => {
					setVisibleImport(false);
				}}
				visible={visibleImport}
				titleTemplate='Biểu mẫu phân công giảng dạy.xlsx'
				extendData={{ maHocKy: recHocKy?.ma || '' }}
			/>

			<Modal
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				title='Cấu hình thời gian kỳ học'
				footer={null}
				width={600}
				maskClosable={false}
			>
				<CauHinhThoiGianHocKyPage onlyPhanCong />
			</Modal>
		</>
	);
};

export default PhanCongGiangDayPage;
