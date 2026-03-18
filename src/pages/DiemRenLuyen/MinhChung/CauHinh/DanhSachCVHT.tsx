import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import useCheckAccess from '@/hooks/useCheckAccess';
import { duyetTheoLopHanhChinh } from '@/services/DiemRenLuyen';
import { ETrangThaiTiepNhanMinhChung } from '@/services/DiemRenLuyen/MinhChung/KhaiBao/constants';
import { MinhChungDrl } from '@/services/DiemRenLuyen/MinhChung/typing';
import { CheckOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const DanhSachMinhChungCVHT = (props: { idLopHanhChinh?: string }) => {
	const intl = useIntl();
	const { getAllModel, danhSach, record, setRecord } = useModel('diemrenluyen.minhchung.cauhinh');
	const { dataPhanQuyen, record: recordDot, handleCheckPhanQuyen } = useModel('diemrenluyen.dot');
	const { getModel, getAllModel: getAllMinhChung } = useModel('diemrenluyen.minhchung.khaibao');
	const { record: recordLopHanhChinh } = useModel('daotaov2.lophanhchinh.lophanhchinh');
	const accessDuyetMinhChung = useCheckAccess('ctsv|diem-ren-luyen|minh-chung|khai-bao|duyet');
	const [dataCheckTrangThaiMinhChung, setDataCheckTrangThaiMinhChung] = useState<boolean>(false);
	const { record: recordCauHinh } = useModel('diemrenluyen.minhchung.cauhinh');

	const idDuyet = useCheckAccess('ctsv|diem-ren-luyen|minh-chung|khai-bao|duyet');
	const isKhoa = useCheckAccess('ctsv|diem-ren-luyen|minh-chung|khai-bao|duyet-tong');

	const getData = async (isSetRecord: boolean) => {
		try {
			getAllModel(isSetRecord, undefined, {
				dungChoSuKien: false,
				dotChamDiemId: recordDot?._id,
				lopHanhChinh: recordLopHanhChinh?.ten,
			});
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		handleCheckPhanQuyen(idDuyet, isKhoa);
		getData(true);

		return () => {};
	}, [recordDot, recordLopHanhChinh]);

	const getDataDanhSachKhaiBao = () => {
		getModel({
			cauHinhMinhChungId: recordCauHinh?._id,
			dotChamDiemId: recordDot?._id,
			lopHanhChinh: recordLopHanhChinh?.ten,
		});
	};

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
			getAllMinhChung(
				undefined,
				undefined,
				{
					dotChamDiemId: recordDot?._id,
					lopHanhChinh: recordLopHanhChinh?.ten,
				},
				undefined,
				undefined,
				false,
			).then((res) => {
				if (res?.length > 0) {
					const data = res?.find((item) => item?.trangThai === ETrangThaiTiepNhanMinhChung.CHO_XU_LY);
					if (data) setDataCheckTrangThaiMinhChung(true);
					else setDataCheckTrangThaiMinhChung(false);
				}
			});
		} catch (e) {
			console.log(e);
		}
	};

	const handleDuyetTheoLopHanhChinh = async () => {
		try {
			const res = await duyetTheoLopHanhChinh(
				recordDot?._id ?? '',
				recordLopHanhChinh?.ten ?? '',
				dataPhanQuyen?.isKhoa ? ETrangThaiTiepNhanMinhChung.XAC_NHAN : ETrangThaiTiepNhanMinhChung.DUYET,
			);
			if (res) {
				message.success(
					dataPhanQuyen?.isKhoa
						? intl.formatMessage({ id: 'minhchung.khaibao.xacnhanthanhcong' })
						: intl.formatMessage({ id: 'minhchung.khaibao.duyetthanhcong' }),
				);
				// getData();
				getDataDanhSachKhaiBao();
				getData(false);
			}
		} catch (e) {
			console.log(e);
		}
	};

	const onCell = (recordVal: MinhChungDrl.IBieuMau) => ({
		onClick: () => {
			setRecord(recordVal);
		},
		style: {
			cursor: 'pointer',
			fontWeight: recordVal.maMinhChung === record?.maMinhChung ? 700 : 600,
			color: recordVal.maMinhChung === record?.maMinhChung ? '#1890ff' : undefined,
			backgroundColor: recordVal.maMinhChung === record?.maMinhChung ? '#f0f0f0' : undefined,
		},
	});

	const columns: IColumn<MinhChungDrl.IBieuMau>[] = [
		{
			title: intl.formatMessage({ id: 'minhchung.column.tenminhchung' }),
			dataIndex: 'tenMinhChung',
			width: 200,
			filterType: 'string',
			onCell,
			render: (val, rec) => {
				return (
					<>
						{val}{' '}
						<Space>
							{rec?.doiTuongNhap?.map((item) => {
								return (
									<Tag color={item === 'CAN_BO' ? 'orange' : 'yellow'}>
										{item === 'CAN_BO'
											? intl.formatMessage({ id: 'minhchung.doituong.canbo' })
											: intl.formatMessage({ id: 'minhchung.doituong.sinhvien' })}
									</Tag>
								);
							})}
						</Space>
						{rec?.trangThaiMinhChung && (
							<div>
								({/*<b>{rec?.trangThaiMinhChung?.['Xác nhận']}</b> Xác nhận,*/}
								{/*<b>{rec?.trangThaiMinhChung?.['Duyệt']}</b> Duyệt,*/}
								<b style={{ color: 'red' }}>{rec?.trangThaiMinhChung?.['Chờ xử lý']}</b>{' '}
								{intl.formatMessage({ id: 'minhchung.khaibao.choxuly' })}
								{/*<b>{rec?.trangThaiMinhChung?.['Không duyệt']}</b> Không duyệt*/})
							</div>
						)}
					</>
				);
			},
		},
	];

	useEffect(() => {
		if (recordDot?._id && props?.idLopHanhChinh) {
			handleCheckTrangThaiKhaiBaoMinhChung();
		}
	}, [recordDot, props?.idLopHanhChinh, dataPhanQuyen]);

	return (
		<div style={{ paddingTop: 3 }}>
			<>
				{dataCheckTrangThaiMinhChung && (
					<>
						{accessDuyetMinhChung ? (
							<Popconfirm
								title={intl.formatMessage({ id: 'minhchung.confirm.duyettatca' })}
								onConfirm={() => {
									handleDuyetTheoLopHanhChinh();
								}}
							>
								<Button type={'primary'} icon={<CheckOutlined />}>
									{intl.formatMessage({ id: 'minhchung.action.duyettatca' })}
								</Button>
							</Popconfirm>
						) : (
							''
						)}
					</>
				)}
			</>
			<TableStaticData columns={columns} data={danhSach} otherProps={{ scroll: { x: 350 }, pagination: false }} />
		</div>
	);
};

export default DanhSachMinhChungCVHT;
