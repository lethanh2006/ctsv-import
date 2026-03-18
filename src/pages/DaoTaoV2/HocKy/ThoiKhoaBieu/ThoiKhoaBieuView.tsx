import { Card, Descriptions, Segmented, Tabs } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import CalendarThoiKhoaBieu from './Calendar';
import LichHocTuanTable from './LichHocTuan';
import ThoiKhoaBieuTable from './Table';
import { hinhThucGiangDay } from '@/services/DaoTaoV2/HocKy/constant';

const ThoiKhoaBieuView = (props: { fromLopHP?: boolean; fromPhanCong?: boolean }) => {
	const { record: recLopHP } = useModel('daotaov2.hocky.lophocphan');
	const [activeTab, setActiveTab] = useState<string>('1');
	const [segmentValue, setSegmentValue] = useState('1');

	const mainContent = () => (
		<>
			<Tabs activeKey={activeTab} onChange={(tab) => setActiveTab(tab)}>
				<Tabs.TabPane key='1' tab='Kế hoạch chung' />
				<Tabs.TabPane key='2' tab='Lịch cụ thể' />
			</Tabs>

			{activeTab === '1' ? (
				<LichHocTuanTable onOk={() => setActiveTab('2')} fromPhanCong={props.fromPhanCong} />
			) : (
				<>
					<div style={{ marginBottom: 12 }}>
						<Segmented
							value={segmentValue}
							onChange={(val) => setSegmentValue(val.toString())}
							options={[
								{ value: '1', label: 'Theo lịch' },
								{ value: '2', label: 'Danh sách chi tiết' },
							]}
						/>
					</div>

					{segmentValue === '1' ? (
						<CalendarThoiKhoaBieu fromPhanCong={props.fromPhanCong} />
					) : (
						<ThoiKhoaBieuTable fromPhanCong={props.fromPhanCong} hideCard tenLopHocPhan={recLopHP?.ten} />
					)}
				</>
			)}
		</>
	);

	if (props.fromLopHP || props.fromPhanCong) return mainContent();
	return (
		<Card title='Thời khóa biểu'>
			<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
				<Descriptions.Item label='Học kỳ'>{recLopHP?.hocKy?.ten}</Descriptions.Item>
				<Descriptions.Item label='Tên lớp tín chỉ'>{recLopHP?.ten}</Descriptions.Item>
				<Descriptions.Item label='Tên học phần'>{recLopHP?.hocPhan?.ten}</Descriptions.Item>
				<Descriptions.Item label='Mã học phần'>{recLopHP?.hocPhan?.ma}</Descriptions.Item>
				<Descriptions.Item label='Hình thức giảng dạy'>
					{recLopHP?.hinhThucGiangDay ? hinhThucGiangDay[recLopHP.hinhThucGiangDay] : ''}
				</Descriptions.Item>
			</Descriptions>

			{mainContent()}
		</Card>
	);
};

export default ThoiKhoaBieuView;
