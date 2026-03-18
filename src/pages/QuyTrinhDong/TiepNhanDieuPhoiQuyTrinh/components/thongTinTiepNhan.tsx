import { MapColorTrangThaiTiepNhan, TrangThaiTiepNhan } from '@/services/QuyTrinhDong/TiepNhanDeuPhoi/constants';
import { Descriptions, Tag } from 'antd';


const ThongTinTiepNhan = (props: { data: any }) => {
	const { data } = props;
	return (
		<Descriptions column={2} bordered>
			<Descriptions.Item label='Trạng thái'>
				{' '}
				<Tag color={MapColorTrangThaiTiepNhan?.[data?.trangThaiTiepNhan as TrangThaiTiepNhan] ?? 'yellow'}>
					{data?.trangThaiTiepNhan}
				</Tag>
			</Descriptions.Item>
			<Descriptions.Item label='Bộ phận xử lý'>{data?.maBoPhanXuLy}</Descriptions.Item>
			<Descriptions.Item span={24} label='Ghi chú'>
				{}
			</Descriptions.Item>
		</Descriptions>
	);
};
export default ThongTinTiepNhan;
