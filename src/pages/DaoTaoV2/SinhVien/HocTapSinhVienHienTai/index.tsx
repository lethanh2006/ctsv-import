import { getHocTapHienTai } from '@/services/DaoTaoV2/SinhVien';
import type { ETrangThaiHocSv } from '@/services/DaoTaoV2/SinhVien/constant';
import { colorTrangThaiHocSv } from '@/services/DaoTaoV2/SinhVien/constant';
import type { SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { Col, Descriptions, Divider, Form, Row, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

const HocTapSinhVienHienTaiPage = (props: { sinhVienSsoId?: string }) => {
	const intl = useIntl();
	const { sinhVienSsoId } = props;
	const [form] = Form.useForm();
	const [thongTinDaoTaoSinhVien, setThongTinDaoTaoSinhVien] = useState<SinhVien.IThongTinDaoTaoSinhVien>();
	const [loading, setLoading] = useState<boolean>(false);

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
		if (sinhVienSsoId) fetchData();
	}, [sinhVienSsoId]);

	const CardThongTinDaoTao = (rec?: SinhVien.IThongTinHocTapHienTai) => (
		<Row gutter={[12, 0]}>
			<Col span={24}>
				<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
					<Descriptions.Item label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.trangthai' })}>
						{(
							<Tag color={colorTrangThaiHocSv[rec?.trangThaiSinhVien as ETrangThaiHocSv]}>{rec?.trangThaiSinhVien}</Tag>
						) ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.hinhthucdaotao' })}>
						{rec?.hinhThucDaoTao?.ten ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.khoa' })}>
						{'--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.khoasinhvien' })}>
						{rec?.khoaSinhVien?.ten ?? ''}
					</Descriptions.Item>
					<Descriptions.Item
						span={2}
						label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.chuongtrinhdaotao' })}
					>
						{rec?.chuongTrinhDaoTao?.ten ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.nganhdaotao' })}>
						{rec?.nganhDaoTao?.ten ?? ''}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.sinhviennamthu' })}>
						{rec?.sinhVienNamThu ?? ''}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.daotautunam' })}>
						{rec?.khoaSinhVien?.namHocBatDau ?? ''}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.sonamdaotao' })}>
						{rec?.soNamDaoTao ?? '--'} {intl.formatMessage({ id: 'sinhvien.hoctapsinhvienhientai.nam' })}
					</Descriptions.Item>
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
