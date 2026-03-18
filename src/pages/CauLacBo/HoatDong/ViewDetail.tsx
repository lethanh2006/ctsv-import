import { ETrangThaiHoatDong, MapKeyColorTrangThaiHoatDongCLB } from '@/services/CauLacBo/constant';
import { primaryColor } from '@/services/base/constant';
import { Descriptions, Tag } from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';

const ViewDetailHoatDongCLB = () => {
	const { record } = useModel('caulacbo.hoatdong');

	return (
		<Descriptions column={{ xs: 2, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }}>
			<Descriptions.Item label='Tên hoạt động' span={2}>
				{record?.ten}
			</Descriptions.Item>

			<Descriptions.Item span={2} label='Thời gian'>
				{dayjs(record?.thoiGianDuKien).format('HH:mm DD/MM/YYYY')}
			</Descriptions.Item>
			<Descriptions.Item label='Trạng thái' span={2}>
				{record?.trangThai && <Tag color={MapKeyColorTrangThaiHoatDongCLB[record?.trangThai]}>{record?.trangThai}</Tag>}
			</Descriptions.Item>
			<Descriptions.Item label='Tài liệu đính kèm' span={2}>
				{record?.fileDinhKem?.map((item) => (
					<Tag key={item} color={primaryColor}>
						<a href={item} target='_blank' rel='noreferrer'>
							Xem tập tin
						</a>
					</Tag>
				))}
			</Descriptions.Item>
			{record?.trangThai && [ETrangThaiHoatDong.DA_THUC_HIEN, ETrangThaiHoatDong.HUY].includes(record?.trangThai) && (
				<>
					<Descriptions.Item label='Ghi chú' span={2}>
						{record?.ghiChu}
					</Descriptions.Item>
					<Descriptions.Item label='Minh chứng' span={4}>
						<Tag color={primaryColor}>
							<a href={record.minhChung} target='_blank' rel='noreferrer'>
								Xem tập tin
							</a>
						</Tag>
					</Descriptions.Item>
				</>
			)}
			<Descriptions.Item span={4} label='Nội dung chi tiết'>
				<div dangerouslySetInnerHTML={{ __html: record?.noiDung ?? '' }} />
			</Descriptions.Item>
		</Descriptions>
	);
};

export default ViewDetailHoatDongCLB;
