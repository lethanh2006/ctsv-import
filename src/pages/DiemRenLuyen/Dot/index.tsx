import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import FormThemMoi from '@/pages/DiemRenLuyen/Dot/components/FormThemMoi';
import ViewChiTiet from '@/pages/DiemRenLuyen/Dot/components/ViewChiTiet';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const DotPage = () => {
	const intl = useIntl();
	const { handleEdit, deleteModel, isView, handleView } = useModel('diemrenluyen.dot');
	const { danhSach: danhSachKyHoc, getAllModel: getAllKyHoc } = useModel('daotaov2.hocky.hocky');

	const onCell = (record: DotChamDiemRenLuyen.IRecord) => ({
		onClick: () => {
			handleView(record);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<DotChamDiemRenLuyen.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'diemrenluyen.dot.title' }),
			dataIndex: 'tenDot',
			filterType: 'string',
			width: 150,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.dot.kyhoc' }),
			dataIndex: 'kyHoc',
			align: 'center',
			filterType: 'customselect',
			filterCustomSelect: <SelectHocKy selectMa multiple />,
			width: 150,
			onCell,
			render: (val) => {
				const kyHoc = danhSachKyHoc?.find((item) => item?.ma === val);
				return kyHoc?.ten;
			},
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.dot.tgtiepnhan' }),
			render: (val, rec) =>
				`${
					rec.thoiGianTiepNhanMinhChung?.thoiGianBatDau
						? dayjs(rec.thoiGianTiepNhanMinhChung.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
						: ''
				} - ${
					rec.thoiGianTiepNhanMinhChung?.thoiGianKetThuc
						? dayjs(rec.thoiGianTiepNhanMinhChung.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
						: ''
				}`,
			width: 150,
			onCell,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.dot.tgsvcham' }),
			render: (val, rec) =>
				`${
					rec.thoiGianSVChamDiem?.thoiGianBatDau
						? dayjs(rec.thoiGianSVChamDiem.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
						: ''
				} - ${
					rec.thoiGianSVChamDiem?.thoiGianKetThuc
						? dayjs(rec.thoiGianSVChamDiem.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
						: ''
				}`,
			width: 150,
			onCell,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.dot.tgbcscham' }),
			render: (val, rec) =>
				`${
					rec.thoiGianBCSChamDiem?.thoiGianBatDau
						? dayjs(rec.thoiGianBCSChamDiem.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
						: ''
				} - ${
					rec.thoiGianBCSChamDiem?.thoiGianKetThuc
						? dayjs(rec.thoiGianBCSChamDiem.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
						: ''
				}`,
			width: 150,
			onCell,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.dot.tgchunhiem' }),
			render: (val, rec) =>
				`${
					rec.thoiGianCoVanChamDiem?.thoiGianBatDau
						? dayjs(rec.thoiGianCoVanChamDiem.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
						: ''
				} - ${
					rec.thoiGianCoVanChamDiem?.thoiGianKetThuc
						? dayjs(rec.thoiGianCoVanChamDiem.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
						: ''
				}`,
			width: 150,
			onCell,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.dot.tgkhieunai' }),
			render: (val, rec) =>
				`${
					rec.thoiGianKhieuNai?.thoiGianBatDau
						? dayjs(rec.thoiGianKhieuNai.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
						: ''
				} - ${
					rec.thoiGianKhieuNai?.thoiGianKetThuc
						? dayjs(rec.thoiGianKhieuNai.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
						: ''
				}`,
			width: 150,
			onCell,
			align: 'center',
		},

		// {
		// 	title: 'Thời gian phòng CTSV chấm điểm',
		// 	render: (val, rec) =>
		// 		`${
		// 			rec.thoiGianPhongCTSVChamDiem?.thoiGianBatDau
		// 				? dayjs(rec.thoiGianPhongCTSVChamDiem.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
		// 				: ''
		// 		} - ${
		// 			rec.thoiGianPhongCTSVChamDiem?.thoiGianKetThuc
		// 				? dayjs(rec.thoiGianPhongCTSVChamDiem.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
		// 				: ''
		// 		}`,
		// 	width: 150,
		// 	onCell,
		// 	align: 'center',
		// },
		{
			title: intl.formatMessage({ id: 'diemrenluyen.dot.thaotac' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chitiet' })}
						type='link'
						icon={<EyeOutlined />}
						onClick={() => {
							handleView(rec);
						}}
					/>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						type='link'
						icon={<EditOutlined />}
						onClick={() => {
							handleEdit(rec);
						}}
					/>
					<Popconfirm
						title={intl.formatMessage({ id: 'diemrenluyen.dot.confirm.xoa' })}
						placement={'topLeft'}
						onConfirm={() => {
							deleteModel(rec?._id, undefined, {
								messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
							});
						}}
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
							type='link'
							danger
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	useEffect(() => {
		getAllKyHoc();
	}, []);

	return (
		<>
			<TableBase
				Form={isView ? ViewChiTiet : FormThemMoi}
				title={'Đợt chấm điểm rèn luyện'}
				modelName={'diemrenluyen.dot'}
				columns={columns}
				widthDrawer={700}
				destroyModal
			/>
		</>
	);
};
export default DotPage;
