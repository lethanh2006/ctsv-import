import { ELoaiQuyetDinh } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { Button, Card, Descriptions } from 'antd';
import dayjs from 'dayjs';
import { useIntl, useModel } from 'umi';
import TableSVBaoLuu from './TableSVBaoLuu';
import TableSVSongNganh from './TableSVSongNganh';
import TableSVThoiHoc from './TableSVThoiHoc';
import TableSVTotNghiep from './TableSVTotNghiep';

const ViewQuyetDinh = () => {
	const intl = useIntl();
	const { record, setVisibleForm } = useModel('daotaov2.quyetdinh.quyetdinh');

	return (
		<Card title='Chi tiết quyết định'>
			<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2 }}>
				<Descriptions.Item label='Học kỳ'>{record?.hocKy?.ten ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Loại quyết định'>{record?.loai ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Số quyết định'>{record?.soQuyetDinh ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Ngày ban hành'>
					{record?.ngayBanHanh && dayjs(record?.ngayBanHanh).format('DD/MM/YYYY')}
				</Descriptions.Item>
				<Descriptions.Item label='Nội dung' span={2}>
					{record?.noiDung ?? ''}
				</Descriptions.Item>
				<Descriptions.Item label='Tập tin'>
					{record?.url ? <a href={record.url}>Xem chi tiết</a> : ''}
				</Descriptions.Item>
			</Descriptions>

			<div className='fw500'>Danh sách sinh viên</div>
			{record?.loai === ELoaiQuyetDinh.BAO_LUU ? (
				<TableSVBaoLuu />
			) : record?.loai === ELoaiQuyetDinh.THOI_HOC ? (
				<TableSVThoiHoc />
			) : record?.loai === ELoaiQuyetDinh.TOT_NGHIEP ? (
				<TableSVTotNghiep />
			) : record?.loai === ELoaiQuyetDinh.SONG_NGANH ? (
				<TableSVSongNganh />
			) : null}

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default ViewQuyetDinh;
