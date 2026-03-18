import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import { colorLoaiHocLuc } from '@/services/DaoTaoV2/HocKy/constant';
import { Card, Col, Empty, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import CardLopHanhChinh from './components/CardLopHanhChinh';
import TableDiemHocPhan from './components/TableDiemHocPhan';
import './components/style.less';

const KetQuaHocKyPage = () => {
	const intl = useIntl();
	const { record: recordSVLopHC } = useModel('daotaov2.namhoc.sinhvienlophanhchinh');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { getOneModel: getKetQuaHocKy, record, loading } = useModel('daotaov2.ketquahoctap.ketquahocky');

	const getData = () =>
		recordSVLopHC?.sinhVienSsoId &&
		recHocKy?.ma &&
		getKetQuaHocKy({ sinhVienSsoId: recordSVLopHC.sinhVienSsoId, maHocKy: recHocKy.ma });

	useEffect(() => {
		getData();
	}, [recordSVLopHC?.sinhVienSsoId, recHocKy?.ma]);

	return (
		<CardLopHanhChinh
			title={intl.formatMessage({ id: 'ketquahoctap.ketquahocky.title' })}
			otherComponent={<FilterHocKy hideExpand isSetHocKy />}
		>
			<Spin spinning={loading}>
				{record?._id ? (
					<>
						<Row gutter={[12, 12]}>
							<Col span={24} md={12}>
								<Card className='ket-qua-card'>
									<div className='ket-qua-content'>
										<div className='title'>{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.ketquahocky' })}</div>
										<Row gutter={[8, 0]}>
											<Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.trungBinhHocKy ?? '--'}</span>
													{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.trungbinhhocky10' })}
												</div>
											</Col>
											<Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.trungBinhHocKyThang4 ?? '--'}</span>
													{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.trungbinhhocky4' })}
												</div>
											</Col>
											<Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.trungBinhHocBongHocKyThang4 ?? '--'}</span>
													{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.trungbinhhocbong' })}
												</div>
											</Col>
											<Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.tongSoTinChiTichLuyHocKy ?? '--'}</span>
													{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.tinchidat' })}
												</div>
											</Col>
											{/* <Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.tongSoTinChiNoHocKy ?? '--'}</span>
													{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.tinchino' })}
												</div>
											</Col> */}
										</Row>
									</div>
								</Card>
							</Col>

							<Col span={24} md={12}>
								<Card className='ket-qua-card'>
									<div className='ket-qua-content'>
										<div className='title'>{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.ketquatichluy' })}</div>
										<Row gutter={[8, 0]}>
											<Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.trungBinhTichLuyToanKhoa ?? '--'}</span>
													{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.trungbinhtichluy10' })}
												</div>
											</Col>
											<Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.trungBinhTichLuyToanKhoaThang4 ?? '--'}</span>
													{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.trungbinhtichluy4' })}
												</div>
											</Col>
											<Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.tongSoTinChiTichLuyToanKhoa ?? '--'}</span>
													{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.tinchitichluy' })}
												</div>
											</Col>
											<Col span={24} xxl={12}>
												<div className='row'>
													<span className='sum-text'>{record.tongSoTinChiNoToanKhoa ?? '--'}</span>
													{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.tinchinotoankhoa' })}
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
										<span className='sum-text'>{record.trinhDo ?? '--'}</span>
									</div>
								</Card>
							</Col>
							<Col span={24} md={12}>
								<Card className='ket-qua-card'>
									<div className='ket-qua-content'>
										<div className='title'>{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.hocluc' })}</div>
										<span className='sum-text' style={{ color: colorLoaiHocLuc[record.hocLuc] }}>
											{record.hocLuc ?? '--'}
										</span>
									</div>
								</Card>
							</Col>
						</Row>

						{recordSVLopHC?.sinhVienSsoId && recHocKy?.ma ? (
							<TableDiemHocPhan sinhVienSsoId={recordSVLopHC?.sinhVienSsoId} maHocKy={recHocKy?.ma} />
						) : null}
					</>
				) : (
					<Empty description='Không có dữ liệu !' style={{ marginTop: 50, marginBottom: 32 }} />
				)}
			</Spin>
		</CardLopHanhChinh>
	);
};

export default KetQuaHocKyPage;
