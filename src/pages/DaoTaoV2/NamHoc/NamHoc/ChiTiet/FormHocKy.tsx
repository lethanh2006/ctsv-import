import MyDatePicker from '@/components/MyDatePicker';
import rules from '@/utils/rules';
import { Col, Divider, Form, InputNumber, Row } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';

const FormHocKyDetail = (props: { soKyChinh: number; soKyPhu: number; thoiGianBatDau: any; hocKyList: any[] }) => {
	const { soKyChinh, soKyPhu, thoiGianBatDau, hocKyList } = props;

	return (
		<>
			<Divider>Cấu hình thông tin các kỳ học</Divider>
			<Row gutter={[12, 0]}>
				<Form.List name='hocKyList'>
					{() =>
						_.range(1, soKyChinh + soKyPhu + 1).map((ky, index) => {
							const isKyChinh = ky <= soKyChinh;
							const batDau = !index
								? thoiGianBatDau
								: dayjs(hocKyList?.[index - 1]?.thoiGianBatDau ?? thoiGianBatDau)
										.startOf('w')
										.add(hocKyList?.[index - 1]?.soTuan ?? 0, 'w');
							return (
								<Col key={ky} span={24} md={12}>
									<Row gutter={[12, 0]}>
										<Form.Item hidden name={[index, 'soThuTu']} initialValue={ky} />
										<Form.Item hidden name={[index, 'isKyChinh']} initialValue={isKyChinh} />
										<Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
											<div className='fw500'>
												Kỳ {isKyChinh ? 'chính' : 'phụ'} {isKyChinh ? ky : ky - soKyChinh}:
											</div>
										</Col>
										<Col span={12} md={12}>
											<Form.Item name={[index, 'thoiGianBatDau']} label='Thời gian bắt đầu' rules={[...rules.required]}>
												<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(batDau, 'd')} />
											</Form.Item>
										</Col>
										<Col span={12} md={12}>
											<Form.Item
												name={[index, 'soTuan']}
												label='Số tuần dự kiến'
												rules={[...rules.required, ...rules.number(50, 1, false)]}
											>
												<InputNumber placeholder='Số tuần' min={1} max={50} style={{ width: '100%' }} />
											</Form.Item>
										</Col>
									</Row>
								</Col>
							);
						})
					}
				</Form.List>
			</Row>
		</>
	);
};

export default FormHocKyDetail;
