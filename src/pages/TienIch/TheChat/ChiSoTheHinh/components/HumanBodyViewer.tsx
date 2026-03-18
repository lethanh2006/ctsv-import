import type { TheChat } from '@/services/TienIch/TheChat/typing';
import { Descriptions, Divider, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ChiTietKetQuaDanhGia from '../../Dot/KetQuaTheChat/components/KetQua';
import '../style.less';

const HumanBodyViewer = (props: { ssoId: string }) => {
	const { ssoId } = props;
	const { record: recDot } = useModel('tienich.thechat.dot');
	const { record: recTheHinh, getOneModel, loading: loadingChiSo } = useModel('tienich.thechat.chisothehinh');
	const { getAllModel, loading: loadingKetQua } = useModel('tienich.thechat.ketquathechat');

	const [danhSachKetQua, setDanhSachKetQua] = useState<TheChat.IKetQuaTheChat[]>([]);

	useEffect(() => {
		if (recDot?._id && ssoId) {
			getOneModel({ dotDanhGiaTheChatId: recDot?._id, ssoIdSinhVien: ssoId });
			getAllModel(
				undefined,
				undefined,
				{ dotDanhGiaTheChatId: recDot?._id, ssoIdSinhVien: ssoId },
				undefined,
				undefined,
				false,
			).then((res) => setDanhSachKetQua(res));
		}
	}, [ssoId, recDot?._id]);

	return (
		<Spin spinning={loadingChiSo || loadingKetQua}>
			<Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}>
				<Descriptions.Item label='Mã sinh viên'>
					{recTheHinh?.maSv ?? danhSachKetQua?.[0]?.maSv ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Họ tên'>{recTheHinh?.tenSv ?? danhSachKetQua?.[0]?.tenSv ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Lớp hành chính'>
					{recTheHinh?.lopHanhChinh ?? danhSachKetQua?.[0]?.lopHanhChinh ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Khóa ngành'>
					{recTheHinh?.tenKhoaNganh ?? danhSachKetQua?.[0]?.tenKhoaNganh ?? '--'}
				</Descriptions.Item>
			</Descriptions>

			{danhSachKetQua?.length ? (
				<div style={{ marginTop: 12 }}>
					<ChiTietKetQuaDanhGia danhSachKetQua={danhSachKetQua} />
				</div>
			) : null}

			{recTheHinh?._id && (
				<div style={{ fontSize: '14px', lineHeight: '1.8', color: '#333' }}>
					<Divider orientation='left'>Chỉ số thể hình</Divider>
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
						<div className='height-card' style={{ background: '#DCFFFF' }}>
							<div className='left'>
								<img
									src='/images/thechat/chieucao.png'
									alt='height icon'
									className='icon-vertical'
									style={{ color: '#18BBC2' }}
								/>

								<div className='label'>Chiều cao</div>
							</div>

							<div className='right'>
								<span className='value' style={{ color: '#26C2C8' }}>
									{recTheHinh?.chieuCao}
								</span>
								<span className='unit'>cm</span>
							</div>
						</div>

						<div className='height-card' style={{ background: '#F8DDD3' }}>
							<div className='left'>
								<img
									src='/images/thechat/cannang.png'
									alt='height icon'
									className='icon-vertical'
									style={{ color: '#E20404' }}
								/>

								<div className='label'>Cân nặng</div>
							</div>

							<div className='right'>
								<span className='value' style={{ color: '#E20404' }}>
									{recTheHinh?.canNang}
								</span>
								<span className='unit'>kg</span>
							</div>
						</div>
					</div>

					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
						<div className='height-card' style={{ background: '#FFE7BF' }}>
							<div className='left'>
								<img
									src='/images/thechat/vongeo.png'
									alt='height icon'
									className='icon-vertical'
									style={{ color: '#FFAF0B' }}
								/>

								<div className='label'>Vòng eo</div>
							</div>

							<div className='right'>
								<span className='value' style={{ color: '#FFAF0B' }}>
									{recTheHinh?.vongEo}
								</span>
								<span className='unit'>cm</span>
							</div>
						</div>
						<div className='height-card' style={{ background: '#ECD7F5' }}>
							<div className='left'>
								<img
									src='/images/thechat/vongmong.png'
									alt='height icon'
									className='icon-vertical'
									style={{ color: '#A61ADE' }}
								/>

								<div className='label'>Vòng mông</div>
							</div>

							<div className='right'>
								<span className='value' style={{ color: '#A61ADE' }}>
									{recTheHinh?.vongMong}
								</span>
								<span className='unit'>cm</span>
							</div>
						</div>
					</div>

					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
						<div className='height-card' style={{ background: '#CDE1F4' }}>
							<div className='left'>
								<img
									src='/images/thechat/BMI.png'
									alt='height icon'
									className='icon-vertical'
									style={{ color: '#0047FF' }}
								/>

								<div className='label'>BMI</div>
							</div>

							<div className='right'>
								<span className='value' style={{ color: '#0047FF' }}>
									{recTheHinh?.bmi}
								</span>
							</div>
						</div>

						<div className='height-card' style={{ background: '#DAEFDA' }}>
							<div className='left'>
								<img
									src='/images/thechat/WHR.png'
									alt='height icon'
									className='icon-vertical'
									style={{ color: '#399500' }}
								/>

								<div className='label'>WHR</div>
							</div>

							<div className='right'>
								<span className='value' style={{ color: '#399500' }}>
									{recTheHinh?.vongMong}
								</span>
							</div>
						</div>
					</div>

					<div
						style={{
							marginTop: '15px',
							fontSize: '13px',
							background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
							padding: '14px',
							borderRadius: '8px',
							color: '#2e7d32',
							lineHeight: '1.6',
							border: '1px solid #c8e6c9',
						}}
					>
						{recTheHinh?.danhGiaChung}
					</div>
				</div>
			)}
		</Spin>
	);
};

export default HumanBodyViewer;
