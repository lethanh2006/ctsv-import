import ExpandText from '@/components/ExpandText';
import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiSinhVienDot } from '@/services/constant';
import { type ELoaiChuyenTruong } from '@/services/DaoTaoV2/SinhVien/constant';
import type { SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { formatDate } from '@/utils/formatDate';
import { Button, Carousel } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const ChuyenTruongSinhVienCollapse = (props: { loaiChuyen: ELoaiChuyenTruong }) => {
	const intl = useIntl();
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const { getAllModel, loading, record, setRecord } = useModel('daotaov2.sinhvien.chuyentruong');
	const [danhSach, setDanhSach] = useState<SinhVien.IChuyenTruong[]>([]);
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);
	const { loaiChuyen } = props;

	useEffect(() => {
		if (recSinhVien?.ssoId)
			getAllModel(
				undefined,
				undefined,
				{
					sinhVienSsoId: recSinhVien.ssoId,
					trangThai: ETrangThaiSinhVienDot.DA_RA_QUYET_DINH,
					loaiChuyenTruong: loaiChuyen,
				},
				undefined,
				undefined,
				false,
			).then((res) => setDanhSach(res));
	}, [recSinhVien?.ssoId]);

	const columns: IColumn<SinhVien.IChuyenTruong>[] = [
		// {
		// 	title: 'Loại',
		// 	dataIndex: 'loaiChuyenTruong',
		// 	align: 'center',
		// 	width: 120,
		// 	render: (val: ELoaiChuyenTruong) => val && loaiChuyenTruong[val],
		// },
		{
			title: intl.formatMessage({ id: 'sinhvien.chuyentruong.collapse.quyetdinh' }),
			dataIndex: 'quyetDinhId',
			align: 'center',
			width: 150,
			render: (val, rec) =>
				val && (
					<>
						{rec.quyetDinh?.soQuyetDinh ?? intl.formatMessage({ id: 'sinhvien.chuyentruong.collapse.daraquyetdinh' })},{' '}
						{rec.quyetDinh?.ngayBanHanh ? formatDate(rec.quyetDinh?.ngayBanHanh) : ''}
					</>
				),
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.chuyentruong.collapse.tentruong' }),
			dataIndex: 'tenTruong',
			width: 180,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.chuyentruong.collapse.nganhdaotao' }),
			dataIndex: 'tenNganh',
			width: 160,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.chuyentruong.collapse.taptin' }),
			dataIndex: 'dinhKemUrl',
			width: 120,
			render: (val, rec) =>
				val && (
					<a
						onClick={(e) => {
							e.preventDefault();
							setRecord(rec);
							setVisibleFormFile(true);
						}}
					>
						{intl.formatMessage({ id: 'sinhvien.chuyentruong.collapse.xemchitiet' })}
					</a>
				),
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.chuyentruong.collapse.ghichu' }),
			dataIndex: 'ghiChu',
			width: 140,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
	];

	return (
		<>
			<TableStaticData columns={columns} data={danhSach} loading={loading} addStt />

			<ModalExpandable
				title={intl.formatMessage({ id: 'sinhvien.chuyentruong.collapse.chitiettaptin' })}
				width={1000}
				open={visibleFormFile}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleFormFile(false)}>
							{intl.formatMessage({ id: 'global.button.dong' })}
						</Button>
					</div>
				}
				onCancel={() => setVisibleFormFile(false)}
			>
				<Carousel autoplay pauseOnDotsHover>
					{record?.dinhKemUrl?.map((item) => (
						// eslint-disable-next-line react/jsx-key
						<PreviewFile file={item ?? ''} />
					))}
				</Carousel>
			</ModalExpandable>
		</>
	);
};

export default ChuyenTruongSinhVienCollapse;
