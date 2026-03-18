import ThongTinThanhToan from '@/pages/TaiChinh/HoaDon/ThanhToan/ThongTinThanhToan';
import { MapColorTrangThaiTiepNhanDon, TrangThaiTiepNhanDon } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/constants';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/typings';
import { EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { Button, Collapse, Descriptions, Modal, Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ViewFromCauHinh from './ViewFromCauHinh';

const ThongTinTiepNhan = (props: { data: KhaiBaoQuyTrinh.IBuocXuLy; modelName: any; isBuocNgoaiHeThong?: boolean }) => {
	const intl = useIntl();
	const { data, modelName } = props;
	const model = useModel(modelName);
	const { dataQuyTrinh } = model;
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [visibleThongTinDuyet, setVisibleThongTinDuyet] = useState<boolean>(false);
	const { record, getByIdModel } = useModel('taichinh.hoadon');
	const buocHienTai = dataQuyTrinh?.quyTrinh?.danhSachBuocXuLy?.find((item: { ma: string }) => item?.ma === data?.ma);
	const maFormTiepNhan = buocHienTai?.maFormTiepNhan;
	const cauHinhFormTiepNhan = dataQuyTrinh?.quyTrinh?.danhSachFormTiepNhan?.find(
		(item: { ma: string }) => item?.ma === maFormTiepNhan,
	)?.cauHinhLoaiHinh;
	const dataFormTiepNhan = dataQuyTrinh?.danhSachBuocXuLy?.find(
		(item: { ma: string }) => item.ma === buocHienTai?.ma,
	)?.thongTinTiepNhan;

	return (
		<>
			<Collapse defaultActiveKey={['thongtinchung']} ghost>
				<Collapse.Panel
					style={{ padding: 0 }}
					key={'thongtinchung'}
					header={<b>{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.thongtintiepnhan.thongtinchung' })}</b>}
				>
					<Descriptions column={2} bordered>
						{buocHienTai?.moTa || buocHienTai?.danhSachVanBanLuuTru?.length ? (
							<Descriptions.Item
								span={24}
								label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.thongtintiepnhan.mota' })}
							>
								<div
									dangerouslySetInnerHTML={{
										__html: buocHienTai?.moTa ?? '',
									}}
								/>
								{buocHienTai?.danhSachVanBanLuuTru?.length ? (
									<div>
										{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.thongtintiepnhan.bieumau' })}
										{buocHienTai.danhSachVanBanLuuTru.map((item: { url: string; tenFile: string }, index: number) => (
											<div key={item.url}>
												<a href={item.url} target='_blank' rel='noreferrer'>
													{index + 1}. {item.tenFile}
												</a>
											</div>
										))}
									</div>
								) : null}
							</Descriptions.Item>
						) : null}
						<Descriptions.Item
							label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.thongtintiepnhan.bophan' })}
						>
							{
								dataQuyTrinh?.quyTrinh?.danhSachBoPhanXuLy?.find(
									(item: { ma: string }) => item?.ma === data?.maBoPhanXuLy,
								)?.ten
							}
						</Descriptions.Item>
						{!props.isBuocNgoaiHeThong && data?.coKhaiBao && (
							<>
								<Descriptions.Item
									label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.thongtintiepnhan.trangthai' })}
								>
									<Tag
										color={MapColorTrangThaiTiepNhanDon?.[data?.trangThaiTiepNhan as TrangThaiTiepNhanDon] ?? 'yellow'}
									>
										{data?.trangThaiTiepNhan}
									</Tag>
									{data?.trangThaiTiepNhan === TrangThaiTiepNhanDon.DUYET && maFormTiepNhan ? (
										<Button
											onClick={() => {
												setVisibleThongTinDuyet(true);
											}}
											type='link'
											size='small'
										>
											({intl.formatMessage({ id: 'global.button.chitiet' })})
										</Button>
									) : (
										''
									)}
								</Descriptions.Item>

								{dataQuyTrinh?.idHoaDon && (
									<Descriptions.Item
										label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.thongtintiepnhan.thanhtoan' })}
									>
										<Tag color={EMauTrangThaiThanhToanTable?.[dataQuyTrinh?.trangThaiThanhToan ?? ''] ?? 'gray'}>
											{dataQuyTrinh?.trangThaiThanhToan
												? ETrangThaiThanhToan[dataQuyTrinh.trangThaiThanhToan]
												: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.thongtintiepnhan.phi' })}
										</Tag>{' '}
										{dataQuyTrinh?.idHoaDon ? (
											<Button
												onClick={() => {
													getByIdModel(dataQuyTrinh.idHoaDon);
													setVisibleModal(true);
												}}
												type='link'
												size='small'
											>
												({intl.formatMessage({ id: 'global.button.chitiet' })})
											</Button>
										) : (
											''
										)}
									</Descriptions.Item>
								)}
								{data?.ghiChu && (
									<Descriptions.Item
										span={24}
										label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.thongtintiepnhan.ghichu' })}
									>
										<div dangerouslySetInnerHTML={{ __html: data?.ghiChu ?? '' }} />
									</Descriptions.Item>
								)}
								{data?.vanBan?.url && (
									<Descriptions.Item
										span={24}
										label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.thongtintiepnhan.vanban' })}
									>
										<a href={data?.vanBan?.url} target='_blank' rel='noreferrer'>
											{data?.vanBan?.ten}
										</a>
									</Descriptions.Item>
								)}
							</>
						)}
					</Descriptions>
				</Collapse.Panel>
			</Collapse>
			<Modal
				open={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				styles={{ body: { padding: 0 } }}
				width={1000}
				destroyOnClose
			>
				{record?._id ? <ThongTinThanhToan setVisible={setVisibleModal} /> : null}
			</Modal>
			<Modal
				title={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.thongtintiepnhan.xuly' })}
				open={visibleThongTinDuyet}
				onCancel={() => setVisibleThongTinDuyet(false)}
				footer={null}
				width={1000}
				destroyOnClose
			>
				<ViewFromCauHinh cauHinhLoaiHinh={cauHinhFormTiepNhan} thongTinKhaiBao={dataFormTiepNhan} />
			</Modal>
		</>
	);
};
export default ThongTinTiepNhan;
