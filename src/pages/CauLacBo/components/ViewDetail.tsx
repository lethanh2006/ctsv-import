import DonutChart from '@/components/Chart/DonutChart';
import HoatDongCauLacBo from '@/pages/HoatDongChung/CauLacBo';
import { ETrangThaiThanhVien } from '@/services/CauLacBo/constant';
import { thongKe } from '@/services/HoatDongChung';
import {
	EHoatDongChungType1,
	EHoatDongChungType2,
	MapKeyLabelTrangThaiThongKe,
} from '@/services/HoatDongChung/constants';
import { primaryColor } from '@/services/base/constant';
import { Col, Descriptions, Row, Tabs, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import PhongBanCauLacBo from '../PhongBan';
import ThanhVienCauLacBo from '../ThanhVien';

const ViewDetailCLB = (props: {
	dataThongKe: {
		cauLacBo: string;
		thanhVien: {
			[ETrangThaiThanhVien.DANG_HOAT_DONG]: number;
			[ETrangThaiThanhVien.NGUNG_HOAT_DONG]: number;
		};
	};
}) => {
	const intl = useIntl();
	const { record } = useModel('caulacbo.caulacbo');
	const { danhSach } = useModel('tochucnhansu.donvi');
	const { condition, filters } = useModel('hoatdongchung');

	const [dataThongKe, setDataThongKe] = useState<any>();

	const getThongKe = async () => {
		const res = await thongKe({
			condition: {
				...condition,
				info: {
					type: 'CAU_LAC_BO',
					refId: record?._id,
				},
				phanLoaiCap1: EHoatDongChungType1.VAN_HOA_THE_THAO,
				phanLoaiCap2: EHoatDongChungType2.HOAT_DONG_CAU_LAC_BO,
			},
			filters,
		});
		setDataThongKe(res?.data?.data?.[0]);
	};

	useEffect(() => {
		getThongKe();
	}, [condition, record?._id]);
	return (
		<Tabs>
			<Tabs.TabPane key={'1'} tab={intl.formatMessage({ id: 'quanlyclb.chitiet.tab.thongtinchung' })}>
				<Row>
					<Col span={12}>
						<DonutChart
							showTotal
							formatY={(val) => `${val} ${intl.formatMessage({ id: 'quanlyclb.chitiet.tab.thongtinchung.hd' })}`}
							height={220}
							yLabel={[intl.formatMessage({ id: 'quanlyclb.chitiet.tab.thongtinchung.hd' })]}
							xAxis={Object.values(MapKeyLabelTrangThaiThongKe)}
							yAxis={[[dataThongKe?.chuaDienRa ?? 0, dataThongKe?.dangDienRa ?? 0, dataThongKe?.daDienRa ?? 0]]}
						/>
					</Col>
					<Col span={12}>
						<DonutChart
							formatY={(val) => `${val} ${intl.formatMessage({ id: 'quanlyclb.chitiet.tab.thongtinchung.tv' })}`}
							height={220}
							showTotal
							yLabel={[
								intl.formatMessage({ id: 'quanlyclb.chitiet.tab.thongtinchung.tvhoatdong' }),
								intl.formatMessage({ id: 'quanlyclb.chitiet.tab.thongtinchung.tvngunghd' }),
							]}
							xAxis={Object.values(ETrangThaiThanhVien)}
							yAxis={[Object.values(props.dataThongKe?.thanhVien ?? 0)]}
						/>
					</Col>
				</Row>

				<Descriptions column={{ xs: 2, sm: 2, md: 4, xl: 6, xxl: 6 }}>
					<Descriptions.Item span={3} label={intl.formatMessage({ id: 'quanlyclb.chitiet.tab.thongtinchung.ten' })}>
						{record?.ten}
					</Descriptions.Item>
					<Descriptions.Item span={3} label={intl.formatMessage({ id: 'quanlyclb.chitiet.tab.thongtinchung.donviql' })}>
						{danhSach.find((item) => item._id === record?.donViQuanLy)?.ten}
					</Descriptions.Item>
					{record?.logo && (
						<Descriptions.Item span={3} label={intl.formatMessage({ id: 'quanlyclb.chitiet.tab.thongtinchung.logo' })}>
							<img src={record.logo} style={{ width: 30, height: 30 }} />
						</Descriptions.Item>
					)}
					<Descriptions.Item
						span={3}
						label={intl.formatMessage({ id: 'quanlyclb.chitiet.tab.thongtinchung.khauhieu' })}
					>
						{record?.slogan}
					</Descriptions.Item>
					<Descriptions.Item span={6} label={intl.formatMessage({ id: 'quanlyclb.chitiet.tab.thongtinchung.mucdich' })}>
						<div dangerouslySetInnerHTML={{ __html: record?.mucDich ?? '' }} />
					</Descriptions.Item>
					<Descriptions.Item span={6} label={intl.formatMessage({ id: 'quanlyclb.chitiet.tab.thongtinchung.ynghia' })}>
						<div dangerouslySetInnerHTML={{ __html: record?.yNghia ?? '' }} />
					</Descriptions.Item>

					<Descriptions.Item span={3} label={intl.formatMessage({ id: 'quanlyclb.chitiet.tab.thongtinchung.noiquy' })}>
						<Tag color={primaryColor}>
							<a href={record?.noiQuyQuyChe ?? ''} target='_blank' rel='noreferrer'>
								{intl.formatMessage({ id: 'global.button.teptin' })}
							</a>
						</Tag>
					</Descriptions.Item>
					<Descriptions.Item
						span={3}
						label={intl.formatMessage({ id: 'quanlyclb.chitiet.tab.thongtinchung.quyetdinh' })}
					>
						<Tag color={primaryColor}>
							<a href={record?.quyetDinhThanhLap ?? ''} target='_blank' rel='noreferrer'>
								{intl.formatMessage({ id: 'global.button.teptin' })}
							</a>
						</Tag>
					</Descriptions.Item>
				</Descriptions>
			</Tabs.TabPane>
			<Tabs.TabPane key={'2'} tab={intl.formatMessage({ id: 'quanlyclb.chitiet.tab.dsban' })}>
				<PhongBanCauLacBo />
			</Tabs.TabPane>
			<Tabs.TabPane key={'3'} tab={intl.formatMessage({ id: 'quanlyclb.chitiet.tab.dstv' })}>
				<ThanhVienCauLacBo />
			</Tabs.TabPane>
			<Tabs.TabPane key={'4'} tab={intl.formatMessage({ id: 'quanlyclb.chitiet.tab.hd' })}>
				<HoatDongCauLacBo
					hideCard
					paramCondition={{
						info: {
							type: 'CAU_LAC_BO',
							refId: record?._id,
						},
					}}
				/>
			</Tabs.TabPane>
		</Tabs>
	);
};

export default ViewDetailCLB;
