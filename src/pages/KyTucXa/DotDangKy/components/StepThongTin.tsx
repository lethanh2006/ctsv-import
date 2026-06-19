import MyDatePicker from '@/components/MyDatePicker';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { Col, Form, Input, Row, Select } from 'antd';
import { useModel } from 'umi';

const StepThongTin = (props: { isOngoing?: boolean; isEnded?: boolean }) => {
	const { isOngoing, isEnded } = props;
	const form = Form.useFormInstance();
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const thoiGianBatDau = Form.useWatch('thoiGianBatDau', form);
	const ngayChuyenVao = Form.useWatch('ngayChuyenVao', form);
	const lockCoreInfo = isOngoing || isEnded;

	return (
		<Row gutter={[12, 0]}>
			<Col span={24} md={12}>
				<Form.Item name='tenDot' label='Tên đợt' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
					<Input disabled={lockCoreInfo} placeholder='Nhập tên đợt' />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='maHocKy' hidden rules={[...rules.required]}>
					<Input />
				</Form.Item>
				<Form.Item label='Học kỳ'>
					<Input disabled value={recHocKy?.ten ? `${recHocKy.ten} - ${recHocKy.ma}` : recHocKy?.ma} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='thoiGianBatDau' label='Thời gian bắt đầu' rules={[...rules.required]}>
					<MyDatePicker disabled={lockCoreInfo} format='DD/MM/YYYY' />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item
					name='thoiGianKetThuc'
					label='Thời gian kết thúc'
					dependencies={['thoiGianBatDau']}
					rules={[
						...rules.required,
						...rules.sauNgay(thoiGianBatDau, 'thời gian bắt đầu'),
						{
							validator: async (_, value) => {
								if (isOngoing && value && dayjs(value).endOf('day').isBefore(dayjs())) {
									throw new Error('Registration end time must be greater than or equal to the current time.');
								}
							},
						},
					]}
				>
					<MyDatePicker
						disabled={isEnded}
						format='DD/MM/YYYY'
						disabledDate={(cur) => {
							if (thoiGianBatDau && dayjs(cur).isBefore(thoiGianBatDau, 'day')) return true;
							if (isOngoing && dayjs(cur).isBefore(dayjs(), 'day')) return true;
							return false;
						}}
					/>
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item
					name='ngayChuyenVao'
					label='Ngày chuyển vào'
					rules={[...rules.required, ...rules.sauNgay(thoiGianBatDau, 'thời gian bắt đầu')]}
				>
					<MyDatePicker
						format='DD/MM/YYYY'
						disabledDate={thoiGianBatDau ? (cur) => dayjs(cur).isBefore(thoiGianBatDau, 'day') : undefined}
					/>
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item
					name='ngayChuyenRa'
					label='Ngày chuyển ra'
					dependencies={['thoiGianBatDau', 'ngayChuyenVao']}
					rules={[
						...rules.required,
						...rules.sauNgay(thoiGianBatDau, 'thời gian bắt đầu'),
						...rules.sauNgay(ngayChuyenVao, 'ngày chuyển vào'),
					]}
				>
					<MyDatePicker
						format='DD/MM/YYYY'
						disabledDate={(cur) => {
							if (thoiGianBatDau && dayjs(cur).isBefore(thoiGianBatDau, 'day')) return true;
							if (ngayChuyenVao && dayjs(cur).isBefore(ngayChuyenVao, 'day')) return true;
							return false;
						}}
					/>
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='loaiDot' label='Loại đợt' rules={[...rules.required]}>
					<Select
						disabled={lockCoreInfo}
						options={[
							{ label: 'Theo khóa', value: 'Theo khoa' },
							{ label: 'Theo danh sách', value: 'Theo danh sách' },
						]}
						placeholder='Chọn loại đợt'
					/>
				</Form.Item>
			</Col>
			<Col xs={24}>
				<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text, ...rules.length(2000)]}>
					<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default StepThongTin;
