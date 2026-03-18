import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import FilterHocPhan from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HocPhan/components/Filter';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { type ThoiKhoaBieu } from '@/services/DaoTaoV2/HocKy/ThoiKhoaBieu/typing';
import { ELoaiLopHocPhan } from '@/services/DaoTaoV2/HocKy/constant';
import { ExportOutlined, ImportOutlined, ReloadOutlined } from '@ant-design/icons';
import { Card, Dropdown, Empty, Menu, Modal, Pagination, Spin } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ThoiKhoaBieuHeader from './CauHinhGiaiDoan/Header';
import ThoiKhoaBieuView from './ThoiKhoaBieuView';
import ModalImportTKB from './components/ModalImportTKB';
import RowThoiKhoaBieu from './components/RowThoiKhoaBieu';
import './components/style.less';

const ThoiKhoaBieuPage = (props: { fromLopHP?: boolean }) => {
	const intl = useIntl();
	const { getModel, page, limit, loading, total, setPage, setLimit, record, setRecord, getByIdModel } =
		useModel('daotaov2.hocky.lophocphan');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recHocPhan, danhSach: danhSachHocPhan, loading: loadHocPhan } = useModel('daotaov2.hocphan.hocphan');
	const { record: recDonVi } = useModel('daotaov2.tochucnhansu.donvi');
	const { loading: loadingTKB, exportThoiKhoaBieuModel } = useModel('daotaov2.hocky.thoikhoabieu');
	const [data, setData] = useState<ThoiKhoaBieu.TThoiKhoaBieuData[]>([]);
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [visibleImport, setVisibleImport] = useState<boolean>(false);
	const [openKey, setOpenKey] = useState<string[]>([]);

	const getDataThoiKhoaBieu = (lopHocPhan: LopHocPhan.IRecord): ThoiKhoaBieu.TThoiKhoaBieuData => {
		const result: ThoiKhoaBieu.TThoiKhoaBieuData = { lopHocPhan, thoiKhoaBieuList: [] };
		const giaiMa = lopHocPhan?.maHoaLichHoc
			?.filter((item) => Array.isArray(item.danhSachTuan))
			.sort((a, b) => a.thu - b.thu);

		result.thoiKhoaBieuList = _.range(1, (recHocKy?.soTuan ?? 0) + 1).map((tuan) => ({
			tuan,
			chiTiet:
				giaiMa
					?.filter((item) => item.danhSachTuan?.find((week) => week.tuan === tuan))
					?.map(({ danhSachTuan, ...item }) => item) ?? [],
		}));
		if (lopHocPhan.children && lopHocPhan.children.length)
			result.children = lopHocPhan.children.map((item) => getDataThoiKhoaBieu(item));

		return result;
	};

	const getLopHocPhan = async (forceReload?: boolean) => {
		if (props.fromLopHP && record?._id) {
			if (forceReload) getByIdModel(record._id).then((rec) => setData([getDataThoiKhoaBieu(rec)]));
			else setData([getDataThoiKhoaBieu(record)]);
		} else
			getModel(
				{
					maHocKy: recHocKy?.ma,
					loai: ELoaiLopHocPhan.CHINH,
					maHocPhan: recHocPhan?.ma,
				},
				!recHocPhan?.ma && recDonVi?.maDonVi
					? [
							{
								active: true,
								field: 'maHocPhan',
								operator: EOperatorType.INCLUDE,
								values: danhSachHocPhan.length ? danhSachHocPhan.map((item) => item.ma) : [''],
							},
					  ]
					: undefined,
			).then((lopHp) => setData(lopHp.map((lop) => getDataThoiKhoaBieu(lop))));
	};

	useEffect(() => {
		if (!loadHocPhan) setOpenKey([]);
	}, [page, limit, recHocKy?._id, recHocPhan?.ma, loadHocPhan]);

	useEffect(() => {
		if (recHocKy?._id && !visibleModal && !loadHocPhan) getLopHocPhan(true);
	}, [page, limit, recHocKy?._id, recHocPhan?.ma, loadHocPhan, visibleModal]);

	const onViewDetail = (lopHp: LopHocPhan.IRecord) => {
		setRecord(lopHp);
		setVisibleModal(true);
	};

	const mainContent = () => (
		<div className='table-base'>
			{!props.fromLopHP ? <FilterHocPhan /> : null}

			<div className='header' style={{ marginBottom: 8 }}>
				<div className='action'>
					{total ? (
						<>
							<ButtonExtend icon={<ImportOutlined />} onClick={() => setVisibleImport(true)}>
								Nhập dữ liệu
							</ButtonExtend>
							<Dropdown
								overlay={
									<Menu>
										<Menu.Item onClick={() => exportThoiKhoaBieuModel(recHocKy?.ma ?? '', 'LopHanhChinh')}>
											Theo lớp kế hoạch giảng dạy
										</Menu.Item>
										<Menu.Item onClick={() => exportThoiKhoaBieuModel(recHocKy?.ma ?? '', 'KhoaSinhVien')}>
											Theo khóa sinh viên
										</Menu.Item>
										<Menu.Item onClick={() => <></>}>Theo ngành đào tạo</Menu.Item>
									</Menu>
								}
							>
								<ButtonExtend loading={loadingTKB} icon={<ExportOutlined />}>
									Xuất dữ liệu
								</ButtonExtend>
							</Dropdown>
						</>
					) : (
						<div />
					)}
				</div>

				{!props.fromLopHP ? (
					<div className='extra'>
						<ButtonExtend tooltip='Tải lại dữ liệu' icon={<ReloadOutlined />} onClick={() => getLopHocPhan(true)}>
							<span className='extend'>Tải lại</span>
						</ButtonExtend>
						<div className='total'>
							Tổng số:
							<span>{total || 0}</span>
						</div>
					</div>
				) : null}
			</div>

			<Spin spinning={loading}>
				{data.length ? (
					<>
						<div style={{ textAlign: 'right' }}>
							<i>Nhấn vào mỗi hàng để chỉnh sửa lịch học chi tiết cho từng lớp</i>
						</div>
						<div className='grid-thoi-khoa-bieu'>
							<ThoiKhoaBieuHeader width={100} />

							{/* Pageable Theo lớp tín chỉ */}
							{data.map((item) => (
								<React.Fragment key={item.lopHocPhan._id}>
									<RowThoiKhoaBieu item={item} onViewDetail={onViewDetail} openKey={openKey} setOpenKey={setOpenKey} />

									{/* Nếu có lớp thực hành thì render tương tự như lớp tín chỉ */}
									{item.children?.length && openKey.includes(item.lopHocPhan._id)
										? item.children.map((i) => (
												<RowThoiKhoaBieu
													key={i.lopHocPhan._id}
													item={i}
													onViewDetail={onViewDetail}
													openKey={openKey}
													setOpenKey={setOpenKey}
													isChild
												/>
										  ))
										: null}
								</React.Fragment>
							))}
						</div>

						{!props.fromLopHP ? (
							<div style={{ textAlign: 'right' }}>
								<Pagination
									pageSize={limit}
									current={page}
									pageSizeOptions={['10', '25', '50']}
									showTotal={(tongSo: number) => <div>Tổng số: {tongSo}</div>}
									showSizeChanger
									total={total}
									onChange={(p, l) => {
										setPage(p);
										setLimit(l);
									}}
								/>
							</div>
						) : null}
					</>
				) : (
					<Empty description={<i>Học kỳ này chưa có Lớp tín chỉ nào</i>} style={{ marginBottom: 32, marginTop: 32 }} />
				)}
			</Spin>
		</div>
	);

	return (
		<>
			{!props.fromLopHP ? (
				<Card title={intl.formatMessage({ id: 'kyhoc.thoikhoabieu.title' })}>{mainContent()}</Card>
			) : (
				mainContent()
			)}

			{/* View thời khóa biểu, mã hóa lịch học với từng lớp */}
			<Modal
				open={visibleModal}
				onCancel={() => setVisibleModal(false)}
				cancelText='Đóng'
				okButtonProps={{ hidden: true }}
				styles={{ padding: 0 }}
				width={1000}
				maskClosable={false}
			>
				<ThoiKhoaBieuView />
			</Modal>

			{/* Import thời khóa biểu */}
			<ModalImportTKB
				visible={visibleImport}
				onCancel={() => setVisibleImport(false)}
				onOk={() => {
					getLopHocPhan(true);
					setVisibleImport(false);
				}}
			/>
		</>
	);
};

export default ThoiKhoaBieuPage;
