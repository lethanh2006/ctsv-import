import access from '@/access';
import {
	colorLoaiXuLyKQHT,
	ELoaiXuLyKQHT,
	ETrinhDoKqhtHocKy,
	loaiXuLyKQHT,
	localeTrinhDoKqhtHocKy,
} from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { colorTrangThaiHocSv, localeTrangThaiHocSv, type ETrangThaiHocSv } from '@/services/DaoTaoV2/SinhVien/constant';
import { getHocTapHienTai } from '@/services/SinhVien';
import type { SinhVien } from '@/services/SinhVien/typings';
import { Col, Descriptions, Divider, Form, Row, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const HocTapSinhVienHienTaiPage = (props: { sinhVienSsoId?: string }) => {
	const intl = useIntl();
	const { sinhVienSsoId } = props;
	const [form] = Form.useForm();
	const [thongTinDaoTaoSinhVien, setThongTinDaoTaoSinhVien] = useState<SinhVien.IThongTinDaoTaoSinhVien>();
	const [loading, setLoading] = useState<boolean>(false);
	const { record, getByIdModel } = useModel('daotaov2.sinhvien.sinhvien');
	const { minorAccessFilter } = access({});

	const fetchData = async () => {
		if (sinhVienSsoId) {
			setLoading(true);

			getHocTapHienTai(sinhVienSsoId)
				.then((res) => {
					setThongTinDaoTaoSinhVien(res.data?.data);
					setLoading(false);
				})
				.catch((er) => console.log(er));
		}
	};

	useEffect(() => {
		if (sinhVienSsoId) getByIdModel(`${sinhVienSsoId}/info`);
	}, [sinhVienSsoId]);

	useEffect(() => {
		if (sinhVienSsoId) fetchData();
	}, [sinhVienSsoId]);

	const CardThongTinDaoTao = (rec?: SinhVien.IThongTinHocTapHienTai) => (
		<Row gutter={[12, 0]}>
			<Col span={24}>
				<Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}>
					<Descriptions.Item label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.trangthaisv' })}>
						{rec?.trangThaiSinhVien ? (
							<Tag color={colorTrangThaiHocSv[rec?.trangThaiSinhVien as ETrangThaiHocSv]}>
								{intl.formatMessage({ id: localeTrangThaiHocSv[rec?.trangThaiSinhVien as ETrangThaiHocSv] })}
							</Tag>
						) : (
							'--'
						)}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.trangthaixulyhocvu' })}>
						{(() => {
							const trangThaiHocVu = record?.svKhoaNganhList?.find(
								(i) => i.maKhoaNganh === rec?.khoaNganh?.ma,
							)?.trangThaiHocVu;
							if (!trangThaiHocVu) return '--';

							return (
								<Tag color={colorLoaiXuLyKQHT[trangThaiHocVu as ELoaiXuLyKQHT]}>
									{intl.formatMessage({ id: loaiXuLyKQHT[trangThaiHocVu as ELoaiXuLyKQHT] })}
								</Tag>
							);
						})()}
					</Descriptions.Item>

					<Descriptions.Item label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.hinhthuc' })}>
						{rec?.hinhThucDaoTao?.ten ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.namthu' })}>
						{rec?.sinhVienNamThu
							? intl.formatMessage({ id: localeTrinhDoKqhtHocKy[rec?.sinhVienNamThu as ETrinhDoKqhtHocKy] })
							: ''}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.nienkhoa' })}>
						{rec?.khoaNganh?.namBatDau ?? ''} - {rec?.khoaNganh?.namKetThuc ?? ''}
					</Descriptions.Item>
					<Descriptions.Item span={2} label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.chuongtrinh' })}>
						{rec?.chuongTrinhDaoTao?.ten ?? '--'}
					</Descriptions.Item>

					{/* <Descriptions.Item label='Khoa'>{'--'}</Descriptions.Item> */}
					<Descriptions.Item label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.khoanganh' })} span={2}>
						{rec?.khoaNganh?.ten ?? ''}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.chuyennganh' })}>
						{rec?.chuyenNganh?.ten ?? '-'}
					</Descriptions.Item>

					{minorAccessFilter() && (
						<Descriptions.Item label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.minor' })}>
							{rec?.chuyenNganhPhu?.ten ?? '-'}
						</Descriptions.Item>
					)}
				</Descriptions>
			</Col>
		</Row>
	);

	return (
		<Spin spinning={loading}>
			<Form form={form} layout='vertical'>
				<Divider orientation='center'>{intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.title' })}</Divider>
				{CardThongTinDaoTao(thongTinDaoTaoSinhVien?.thongTinNganhChinh)}

				{thongTinDaoTaoSinhVien?.thongTinNganh2 ? (
					<>
						<Divider orientation='center'>{intl.formatMessage({ id: 'sinhvien.hoctapsinhviennganh2.title' })}</Divider>
						{CardThongTinDaoTao(thongTinDaoTaoSinhVien?.thongTinNganh2)}
					</>
				) : null}

				{/* <Divider orientation='center'>Thông tin kết quả học tập</Divider>
			<Row gutter={[12, 0]}>
				<Col span={24} md={8}>
					<Form.Item label='Điểm TBTL hệ 10' name={'diemTbtl10'}>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item label='Điểm TBTL hệ 4' name={'diemTbtl4'}>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item label='Điểm TBTL chữ' name={'diemTbtlChu'}>
						<Input disabled />
					</Form.Item>
				</Col>
			</Row> */}
			</Form>
		</Spin>
	);
};

export default HocTapSinhVienHienTaiPage;
