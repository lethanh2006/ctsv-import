import { primaryColor } from '@/services/base/constant';
import { colorLoaiHocLuc, ELoaiHocLuc, localeLoaiHocLuc } from '@/services/DaoTaoV2/HocKy/constant';
import { ETrinhDoKqhtHocKy, localeTrinhDoKqhtHocKy } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import '../../KetQuaHocKy/components/style.less';

const StatKetQuaTichLuySinhVien = () => {
	const intl = useIntl();
	const { record } = useModel('daotaov2.ketquahoctap.ketquahocky');

	if (!record?._id) return <></>;
	return (
		<Row gutter={[12, 12]}>
			<Col span={24}>
				<Card className='ket-qua-card'>
					<div className='ket-qua-content'>
						<div className='title'>{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.ketquatichluy' })}</div>
						<Row gutter={[8, 0]}>
							{/* <Col span={24} lg={12}>
								<div className='row'>
									<span className='sum-text'>{record.trungBinhTichLuyToanKhoa ?? '-'}</span>
									{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.trungbinhtichluy10' })}
								</div>
							</Col> */}
							<Col span={24} md={8}>
								<div className='row'>
									<span className='sum-text'>{record.trungBinhTichLuyToanKhoaThang4 ?? '-'}</span>
									{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.trungbinhtichluy4' })}
								</div>
							</Col>
							<Col span={24} md={8}>
								<div className='row'>
									<span className='sum-text' style={{ color: '#9bd437' }}>
										{record.tongSoTinChiTichLuyToanKhoa ?? '-'}
									</span>
									{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.tinchitichluy' })}
								</div>
							</Col>
							<Col span={24} md={8}>
								<div className='row'>
									<span className='sum-text' style={{ color: '#fc7e4d' }}>
										{record.tongSoTinChiNoToanKhoa ?? '-'}
									</span>
									{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.tinchinotoankhoa' })}
									<Tooltip title={intl.formatMessage({ id: 'ketquahoctap.ketquahocky.tinchinotoankhoa_tooltip' })}>
										<InfoCircleOutlined style={{ color: primaryColor }} />
									</Tooltip>
								</div>
							</Col>
						</Row>
					</div>
				</Card>
			</Col>

			<Col span={24} md={12}>
				<Card className='ket-qua-card'>
					<div className='ket-qua-content'>
						<div className='title'>{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.trinhdo' })}</div>
						<span className='sum-text'>
							{record.trinhDo
								? intl.formatMessage({ id: localeTrinhDoKqhtHocKy[record.trinhDo as ETrinhDoKqhtHocKy] })
								: '-'}
						</span>
					</div>
				</Card>
			</Col>
			<Col span={24} md={12}>
				<Card className='ket-qua-card'>
					<div className='ket-qua-content'>
						<div className='title'>{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.hocluc' })}</div>
						<span className='sum-text' style={{ color: colorLoaiHocLuc[record.hocLuc as ELoaiHocLuc] }}>
							{record.hocLuc ? intl.formatMessage({ id: localeLoaiHocLuc[record.hocLuc as ELoaiHocLuc] }) : '-'}
						</span>
					</div>
				</Card>
			</Col>
		</Row>
	);
};

export default StatKetQuaTichLuySinhVien;
