import {
	EMaTrangThaiThanhToan,
	EMauTrangThaiThanhToanTable,
	ETrangThaiThanhToan,
} from '@/services/DaoTaoV2/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { Button, Card, Col, Descriptions, Row, Tabs, Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import LichSuThanhToan from './LichSuGiaoDich';
import TableDanhSachKhoanThu from './TableDanhSachKhoanThu';

const ThongTinThanhToan = (props: { setVisible: any }) => {
	const intl = useIntl();
	const { setVisible } = props;
	const { record } = useModel('daotaov2.taichinh.hoadon');
	const [activeTab, setActiveTab] = useState('1');

	return (
		<Card title={intl.formatMessage({ id: 'sinhvienhocvu.congno.thongtinthanhtoan.title' })}>
			<Row gutter={[12, 12]}>
				<Col span={24}>
					<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} bordered>
						<Descriptions.Item
							label={intl.formatMessage({ id: 'sinhvienhocvu.congno.thongtinthanhtoan.label.trangthai' })}
						>
							{record?.status ? (
								<Tag color={EMauTrangThaiThanhToanTable?.[record.status]}>
									{ETrangThaiThanhToan?.[record.status] ?? ''}
								</Tag>
							) : (
								<i>{intl.formatMessage({ id: 'sinhvienhocvu.congno.thongtinthanhtoan.dangcapnhat' })}</i>
							)}
						</Descriptions.Item>
						<Descriptions.Item
							label={intl.formatMessage({ id: 'sinhvienhocvu.congno.thongtinthanhtoan.label.hotentieunop' })}
						>
							{record?.userFullname ?? (
								<i>{intl.formatMessage({ id: 'sinhvienhocvu.congno.thongtinthanhtoan.dangcapnhat' })}</i>
							)}
						</Descriptions.Item>
						<Descriptions.Item
							label={intl.formatMessage({ id: 'sinhvienhocvu.congno.thongtinthanhtoan.label.tongthanhtien' })}
						>
							{inputFormat(
								record?.billItems
									?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
									?.reduce((acc, item) => acc + (item.amountDue || 0), 0),
							)}{' '}
							VNĐ
						</Descriptions.Item>
						<Descriptions.Item
							label={intl.formatMessage({ id: 'sinhvienhocvu.congno.thongtinthanhtoan.label.sotienuudai' })}
						>
							{inputFormat(
								record?.billItems
									?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
									?.reduce((acc, item) => acc + (item.amountDiscount || 0), 0),
							)}{' '}
							VNĐ
						</Descriptions.Item>
						<Descriptions.Item
							label={intl.formatMessage({ id: 'sinhvienhocvu.congno.thongtinthanhtoan.label.sotiendathu' })}
						>
							{inputFormat(
								record?.billItems
									?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
									?.reduce((acc, item) => acc + (item.amountPaid || 0), 0),
							)}{' '}
							VNĐ
						</Descriptions.Item>
						<Descriptions.Item
							label={intl.formatMessage({ id: 'sinhvienhocvu.congno.thongtinthanhtoan.label.sotienconlaiphaitthu' })}
						>
							{inputFormat(
								record?.billItems
									?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
									?.reduce((acc, item) => acc + (item.amountRemaining || 0), 0),
							)}{' '}
							VNĐ
						</Descriptions.Item>
					</Descriptions>
				</Col>

				<Col span={24}>
					<Tabs activeKey={activeTab} onChange={(tab) => setActiveTab(tab)}>
						<Tabs.TabPane
							key={'1'}
							tab={intl.formatMessage({ id: 'sinhvienhocvu.congno.thongtinthanhtoan.tab.chitiet' })}
						/>
						<Tabs.TabPane
							key={'2'}
							tab={intl.formatMessage({ id: 'sinhvienhocvu.congno.thongtinthanhtoan.tab.lichsuthanhtoan' })}
						/>
					</Tabs>

					{activeTab === '1' ? <TableDanhSachKhoanThu /> : <LichSuThanhToan />}
				</Col>
			</Row>

			<div className='form-footer' style={{ marginTop: 18 }}>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default ThongTinThanhToan;
