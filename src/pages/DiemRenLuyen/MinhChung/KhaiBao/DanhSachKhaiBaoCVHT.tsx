import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import SelectDotDiemRenLuyen from '@/pages/DiemRenLuyen/Dot/Select';
import FormKhaiBao from '@/pages/DiemRenLuyen/MinhChung/KhaiBao/components/FormKhaiBao';
import {
	ETrangThaiTiepNhanMinhChung,
	MapColorETrangThaiTiepNhanMinhChung,
} from '@/services/DiemRenLuyen/MinhChung/KhaiBao/constants';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Divider, message, Popconfirm, Popover, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

import useCheckAccess from '@/hooks/useCheckAccess';
import { duyetTheoLopHanhChinh } from '@/services/DiemRenLuyen';

const KhaiBaoMinhChungCVHT = (props: { idLopHanhChinh?: string }) => {
	const intl = useIntl();
	const { getModel, page, limit, condition, handleEdit, deleteModel, handleView, putModel } = useModel(
		'diemrenluyen.minhchung.khaibao',
	);
	//@ts-ignore
	const [dataCheckTrangThaiMinhChung, setDataCheckTrangThaiMinhChung] = useState<boolean>(false);
	const { record: recordCauHinh } = useModel('diemrenluyen.minhchung.cauhinh');
	const { getAllModel } = useModel('quytrinh.danhmuc');
	const { getAllModel: getAllMinhChung } = useModel('diemrenluyen.minhchung.cauhinh');
	const idDuyet = useCheckAccess('ctsv|diem-ren-luyen|minh-chung|khai-bao|duyet');
	const isKhoa = useCheckAccess('ctsv|diem-ren-luyen|minh-chung|khai-bao|duyet-tong');

	const {
		record: recordDot,
		setRecord: setRecortdDot,
		loading: loadingDot,
		dataPhanQuyen,
		handleCheckPhanQuyen,
	} = useModel('diemrenluyen.dot');

	const { record: recordLopHanhChinh } = useModel('daotaov2.lophanhchinh.lophanhchinh');

	const getAllMinhChungModel = () => {
		getAllMinhChung(false, undefined, {
			dungChoSuKien: false,
			dotChamDiemId: recordDot?._id,
			lopHanhChinh: recordLopHanhChinh?.ten,
		});
	};

	const getData = () => {
		getModel({
			cauHinhMinhChungId: recordCauHinh?._id,
			dotChamDiemId: recordDot?._id,
			lopHanhChinh: recordLopHanhChinh?.ten,
		});
	};

	useEffect(() => {
		handleCheckPhanQuyen(idDuyet, isKhoa);
	}, []);

	const handleCheckTrangThaiKhaiBaoMinhChung = async () => {
		try {
			// const res = await checkTrangThaiKhaiBaoMinhChung(
			// 	recodDot?._id ?? '',
			// 	props?.idLopHanhChinh ?? '',
			// 	dataPhanQuyen?.isKhoa ? ETrangThaiTiepNhanMinhChung.DUYET : ETrangThaiTiepNhanMinhChung.CHO_XU_LY,
			// );
			// if (res) {
			// 	setDataCheckTrangThaiMinhChung(res?.data?.data);
			// }
			getModel(
				{
					dotChamDiemId: recordDot?._id,
					lopHanhChinh: recordLopHanhChinh?.ten,
				},
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				false,
			).then((res) => {
				const data = res?.find((item) => item?.trangThai === ETrangThaiTiepNhanMinhChung.CHO_XU_LY);
				if (data) setDataCheckTrangThaiMinhChung(true);
				else setDataCheckTrangThaiMinhChung(false);
			});
		} catch (e) {
			console.log(e);
		}
	};
	//@ts-ignore
	const handleDuyetTheoLopHanhChinh = async () => {
		try {
			const res = await duyetTheoLopHanhChinh(
				recordDot?._id ?? '',
				props?.idLopHanhChinh ?? '',
				dataPhanQuyen?.isKhoa ? ETrangThaiTiepNhanMinhChung.XAC_NHAN : ETrangThaiTiepNhanMinhChung.DUYET,
			);
			if (res) {
				message.success(
					dataPhanQuyen?.isKhoa
						? intl.formatMessage({ id: 'minhchung.khaibao.xacnhanthanhcong' })
						: intl.formatMessage({ id: 'minhchung.khaibao.duyetthanhcong' }),
				);
				getData();
			}
		} catch (e) {
			console.log(e);
		}
	};

	const handleChangeTrangThai = async (id: string, trangThai: ETrangThaiTiepNhanMinhChung) => {
		try {
			putModel(id, { trangThai: trangThai }, () => {
				getData();
				getAllMinhChungModel();
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
			title: intl.formatMessage({ id: 'minhchung.khaibao.hoten' }),
			dataIndex: 'hoTen',
			filterType: 'string',
			onCell,
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'minhchung.khaibao.masv' }),
			dataIndex: 'maSinhVien',
			align: 'center',
			filterType: 'string',
			onCell,
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'minhchung.khaibao.lophanhchinh' }),
			dataIndex: 'lopHanhChinh',
			align: 'center',
			filterType: 'string',
			onCell,
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'minhchung.khaibao.nguoikhaibao' }),
			dataIndex: 'nguoiKhaiBao',
			align: 'center',
			onCell,
			width: 150,
			render: (val) => val?.ten ?? '',
		},
		{
			title: intl.formatMessage({ id: 'minhchung.khaibao.trangthai' }),
			dataIndex: 'trangThai',
			align: 'center',
			onCell,
			width: 120,
			render: (val) => (
				<Tag color={MapColorETrangThaiTiepNhanMinhChung?.[val as ETrangThaiTiepNhanMinhChung]}>{val}</Tag>
			),
		},
		{
			title: intl.formatMessage({ id: 'minhchung.khaibao.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			// hide: dataPhanQuyen?.isKhoa,
			render: (val, rec) => (
				<Popover
					placement='right'
					content={
						<>
							{/*<ButtonExtend*/}
							{/*	tooltip='Xem chi tiết'*/}
							{/*	type='link'*/}
							{/*	icon={<EyeOutlined />}*/}
							{/*	onClick={() => {*/}
							{/*		handleView(rec);*/}
							{/*	}}*/}
							{/*/>*/}
							{true && (
								<>
									<Popconfirm
										title={intl.formatMessage({ id: 'minhchung.khaibao.confirm.duyet' })}
										placement={'topLeft'}
										disabled={rec?.trangThai !== ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
										onConfirm={() => {
											handleChangeTrangThai(rec?._id ?? '', ETrangThaiTiepNhanMinhChung.DUYET);
										}}
									>
										<ButtonExtend
											disabled={rec?.trangThai !== ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
											tooltip={intl.formatMessage({ id: 'minhchung.khaibao.duyet' })}
											type='link'
											icon={<CheckOutlined />}
										/>
									</Popconfirm>
									<Divider type={'vertical'} />
									<Popconfirm
										title={intl.formatMessage({ id: 'minhchung.khaibao.confirm.tuchoi' })}
										placement={'topLeft'}
										disabled={rec?.trangThai !== ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
										onConfirm={() => {
											handleChangeTrangThai(rec?._id ?? '', ETrangThaiTiepNhanMinhChung.KHONG_DUYET);
										}}
									>
										<ButtonExtend
											disabled={rec?.trangThai !== ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
											tooltip={intl.formatMessage({ id: 'minhchung.khaibao.tuchoi' })}
											type='link'
											danger
											icon={<CloseOutlined />}
										/>
									</Popconfirm>
									<Divider type={'vertical'} />
								</>
							)}

							<ButtonExtend
								disabled={
									rec?.trangThai === ETrangThaiTiepNhanMinhChung.DUYET ||
									rec?.trangThai === ETrangThaiTiepNhanMinhChung.XAC_NHAN
								}
								tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
								type='link'
								icon={<EditOutlined />}
								onClick={() => {
									handleEdit(rec);
								}}
							/>
							<Divider type={'vertical'} />
							<Popconfirm
								disabled={
									rec?.trangThai === ETrangThaiTiepNhanMinhChung.DUYET ||
									rec?.trangThai === ETrangThaiTiepNhanMinhChung.XAC_NHAN
								}
								title={intl.formatMessage({ id: 'minhchung.khaibao.confirm.xoa' })}
								placement={'topLeft'}
								onConfirm={() => {
									deleteModel(rec?._id, getData);
								}}
							>
								<ButtonExtend
									disabled={
										rec?.trangThai === ETrangThaiTiepNhanMinhChung.DUYET ||
										rec?.trangThai === ETrangThaiTiepNhanMinhChung.XAC_NHAN
									}
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
		if (recordDot?._id && props?.idLopHanhChinh) {
			handleCheckTrangThaiKhaiBaoMinhChung();
		}
	}, [recordDot, props?.idLopHanhChinh, dataPhanQuyen]);

	useEffect(() => {
		getAllModel();
	}, []);

	return (
		<Spin spinning={loadingDot}>
			<TableBase
				hideCard
				// title={'Danh sách khai báo'}
				Form={FormKhaiBao as any}
				modelName={'diemrenluyen.minhchung.khaibao'}
				columns={columns}
				getData={getData}
				dependencies={[recordCauHinh?._id, page, limit, condition, recordDot?._id, recordLopHanhChinh]}
				widthDrawer={700}
				destroyModal
				formProps={{ getData: getData }}
				buttons={{ create: dataPhanQuyen?.isKhoa ? false : recordCauHinh?.doiTuongNhap?.includes('CAN_BO') }}
				otherButtons={[
					<>
						<SelectDotDiemRenLuyen
							style={{ width: 300 }}
							value={recordDot?._id}
							onChange={(val, option) => {
								const rawData = option?.rawData;
								setRecortdDot(rawData);
							}}
							isSetRecord={true}
						/>
					</>,
				]}
			/>
		</Spin>
	);
};
export default KhaiBaoMinhChungCVHT;
