import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import useCheckAccess from '@/hooks/useCheckAccess';
import SelectLopHanhChinh from '@/pages/DaoTaoV2/NamHoc/LopHanhChinh/components/SelectLopHanhChinh';
import SelectDotDiemRenLuyen from '@/pages/DiemRenLuyen/Dot/Select';
import FormKhaiBao from '@/pages/DiemRenLuyen/MinhChung/KhaiBao/components/FormKhaiBao';
import {
	ETrangThaiTiepNhanMinhChung,
	MapColorETrangThaiTiepNhanMinhChung,
} from '@/services/DiemRenLuyen/MinhChung/KhaiBao/constants';
import {
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
	EditOutlined,
	ImportOutlined,
	MenuOutlined,
	UndoOutlined,
} from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, Modal, Popconfirm, Popover, Spin, Tag } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormImport from './components/FormImport';

const KhaiBaoMinhChung = (props: { idLopHanhChinh?: string; getDataMinhChung?: () => void }) => {
	const intl = useIntl();
	const {
		getModel,
		page,
		limit,
		condition,
		handleEdit,
		deleteModel,
		handleView,
		putModel,
		getTemplateImportMinhChungModel,
		setVisibleFormImport,
		visibleFormImport,
	} = useModel('diemrenluyen.minhchung.khaibao');
	const { record: recordCauHinh } = useModel('diemrenluyen.minhchung.cauhinh');
	const { getAllModel, danhSach: danhSachDanhMuc } = useModel('quytrinh.danhmuc');
	const { loading } = useModel('diemrenluyen.minhchung.cauhinh');
	const {
		record: recordDot,
		setRecord: setRecortdDot,
		loading: loadingDot,
		dataPhanQuyen,
		handleCheckPhanQuyen,
	} = useModel('diemrenluyen.dot');

	const { record: recordLopHanhChinh, setRecord: setRecordLopHanhChinh } = useModel(
		'daotaov2.lophanhchinh.lophanhchinh',
	);

	const idDuyet = useCheckAccess('ctsv|diem-ren-luyen|minh-chung|khai-bao|duyet');
	const isKhoa = useCheckAccess('ctsv|diem-ren-luyen|minh-chung|khai-bao|duyet-tong');

	useEffect(() => {
		handleCheckPhanQuyen(idDuyet, isKhoa);
	}, []);

	const getData = () => {
		if (
			(!props?.idLopHanhChinh && recordCauHinh?._id && recordDot?._id) ||
			(props.idLopHanhChinh && recordCauHinh?._id && recordDot?._id && recordLopHanhChinh?._id)
		) {
			getModel({
				cauHinhMinhChungId: recordCauHinh?._id,
				dotChamDiemId: recordDot?._id,
				lopHanhChinh: recordLopHanhChinh?.ten,
			});
			if (props?.getDataMinhChung) props?.getDataMinhChung();
		}
	};

	const handleChangeTrangThai = async (id: string, trangThai: ETrangThaiTiepNhanMinhChung) => {
		try {
			putModel(id, { trangThai: trangThai }, () => {
				getData();
			});
		} catch (e) {
			console.log(e);
		}
	};

	const onCell = (rec: KhaiBaoDRL.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<KhaiBaoDRL.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.hoten' }),
			dataIndex: 'hoTen',
			filterType: 'string',
			onCell,
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.masv' }),
			dataIndex: 'maSinhVien',
			align: 'center',
			filterType: 'string',
			onCell,
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.lhc' }),
			dataIndex: 'lopHanhChinh',
			align: 'center',
			filterType: 'string',
			onCell,
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.nguoikhaobao' }),
			dataIndex: 'nguoiKhaiBao',
			align: 'center',
			onCell,
			width: 150,
			render: (val) => val?.ten ?? '',
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.trangthai' }),
			dataIndex: 'trangThai',
			align: 'center',
			onCell,
			filterType: 'select',
			filterData: Object.values(ETrangThaiTiepNhanMinhChung),
			width: 120,
			render: (val) => (
				<Tag color={MapColorETrangThaiTiepNhanMinhChung?.[val as ETrangThaiTiepNhanMinhChung]}>{val}</Tag>
			),
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<Popover
					placement='right'
					content={
						<>
							<Popconfirm
								title={intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.confirm.duyet' })}
								placement={'topLeft'}
								disabled={rec?.trangThai !== ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
								onConfirm={() => {
									handleChangeTrangThai(rec?._id ?? '', ETrangThaiTiepNhanMinhChung.DUYET);
								}}
							>
								<ButtonExtend
									disabled={rec?.trangThai !== ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
									tooltip={intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.button.duyet' })}
									type='link'
									icon={<CheckOutlined />}
								/>
							</Popconfirm>
							<Divider type={'vertical'} />
							<Popconfirm
								title={intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.confirm.tuchoi' })}
								placement={'topLeft'}
								disabled={rec?.trangThai !== ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
								onConfirm={() => {
									handleChangeTrangThai(rec?._id ?? '', ETrangThaiTiepNhanMinhChung.KHONG_DUYET);
								}}
							>
								<ButtonExtend
									disabled={rec?.trangThai !== ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
									tooltip={intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.button.tuchoi' })}
									type='link'
									danger
									icon={<CloseOutlined />}
								/>
							</Popconfirm>
							<Divider type={'vertical'} />
							<Popconfirm
								title={intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.confirm.chuyenvechoxuly' })}
								placement={'topLeft'}
								disabled={rec?.trangThai === ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
								onConfirm={() => {
									handleChangeTrangThai(rec?._id ?? '', ETrangThaiTiepNhanMinhChung.CHO_XU_LY);
								}}
							>
								<ButtonExtend
									disabled={rec?.trangThai === ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
									tooltip={intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.button.chuyenvechoxuly' })}
									type='link'
									icon={<UndoOutlined />}
								/>
							</Popconfirm>
							<Divider type={'vertical'} />

							<ButtonExtend
								disabled={rec?.trangThai === ETrangThaiTiepNhanMinhChung.DUYET}
								tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
								type='link'
								icon={<EditOutlined />}
								onClick={() => {
									handleEdit(rec);
								}}
							/>
							<Divider type={'vertical'} />
							<Popconfirm
								disabled={rec?.trangThai === ETrangThaiTiepNhanMinhChung.DUYET}
								title={intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.confirm.xoa' })}
								placement={'topLeft'}
								onConfirm={() => {
									deleteModel(rec?._id, getData, {
										messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
									});
								}}
							>
								<ButtonExtend
									disabled={rec?.trangThai === ETrangThaiTiepNhanMinhChung.DUYET}
									tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
									type='link'
									danger
									icon={<DeleteOutlined />}
								/>
							</Popconfirm>
						</>
					}
				>
					<Button type='link' icon={<MenuOutlined />} />
				</Popover>
			),
		},
	];

	useEffect(() => {
		if (!danhSachDanhMuc.length) getAllModel();
	}, []);

	return (
		<Spin spinning={loadingDot || loading}>
			<TableBase
				hideCard
				Form={FormKhaiBao as any}
				modelName={'diemrenluyen.minhchung.khaibao'}
				columns={columns}
				getData={getData}
				dependencies={[recordCauHinh?._id, page, limit, condition, recordDot?._id, recordLopHanhChinh]}
				widthDrawer={700}
				destroyModal
				formProps={{ getData: getData }}
				buttons={{
					create: dataPhanQuyen?.isPhongCTSV
						? true
						: dataPhanQuyen?.isKhoa
							? false
							: recordCauHinh?.doiTuongNhap?.includes('CAN_BO'),
				}}
				otherButtons={[
					<>
						<Dropdown
							overlay={
								<Menu>
									<Menu.Item
										onClick={() => {
											getTemplateImportMinhChungModel(recordCauHinh?._id ?? '', recordCauHinh?.tenMinhChung ?? '');
										}}
									>
										{intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.button.taimau' })}
									</Menu.Item>
									<Menu.Item
										onClick={() => {
											setVisibleFormImport(true);
										}}
									>
										{intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.button.import' })}
									</Menu.Item>
								</Menu>
							}
						>
							<Button icon={<ImportOutlined />}>
								{intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.button.import' })}
							</Button>
						</Dropdown>
						<SelectDotDiemRenLuyen
							style={{ width: 300 }}
							value={recordDot?._id}
							onChange={(val, option) => {
								const rawData = option?.rawData;
								setRecortdDot(rawData);
							}}
							isSetRecord={true}
						/>
						{!props.idLopHanhChinh && (
							<SelectLopHanhChinh
								allowClear
								value={recordLopHanhChinh?._id}
								style={{ width: 150 }}
								onChange={(val: any, option: any) => {
									const rawData = option?.rawData;
									setRecordLopHanhChinh(rawData);
								}}
							/>
						)}
					</>,
				]}
			/>
			<Modal
				destroyOnClose
				open={visibleFormImport}
				title={intl.formatMessage({ id: 'lophanhchinh.minhchung.khaobai.button.importminhchung' })}
				onCancel={() => {
					setVisibleFormImport(false);
				}}
				footer={null}
			>
				<FormImport getData={getData} />
			</Modal>
		</Spin>
	);
};
export default KhaiBaoMinhChung;
