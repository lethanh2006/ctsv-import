import StepDotChamDiemRenLuyen from '@/pages/DiemRenLuyen/Dot/Step';
import DanhSachMinhChung from '@/pages/DiemRenLuyen/MinhChung/CauHinh/DanhSach';
import KhaiBaoMinhChung from '@/pages/DiemRenLuyen/MinhChung/KhaiBao';
import { LeftOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { history, useIntl, useModel } from 'umi';

const DetailDanhSachKhaiBao = ({
	match: {
		params: { id },
	},
}: {
	match: { params: { id: string } };
}) => {
	const intl = useIntl();
	const { getByIdModel, record: recordLopHanhChinh } = useModel('daotaov2.lophanhchinh.lophanhchinh');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('25%');
	const handlePaneSizeChange = (size: any) => setPaneSize(size[0]);

	// const accessDuyetTongMinhChung = useCheckAccess('ctsv|diem-ren-luyen|minh-chung|khai-bao|duyet-tong');
	useEffect(() => {
		if (id) getByIdModel(id, true);
	}, [id]);

	return (
		<>
			<Card
				title={
					<>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<Button
								type={'link'}
								icon={<LeftOutlined />}
								onClick={() => {
									history.push('/diem-ren-luyen/minh-chung/danh-sach-khai-bao');
								}}
							>
								{intl.formatMessage({ id: 'minhchung.action.quaylai' })}
							</Button>
							<div>
								{`${intl.formatMessage({ id: 'minhchung.danhsach.title' })} ${
									recordLopHanhChinh?._id ? `(${recordLopHanhChinh?.ten})` : ''
								}`}
							</div>
						</div>
					</>
				}
			>
				<div style={{ marginBottom: 12 }}>
					<StepDotChamDiemRenLuyen />
				</div>
				<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
					<Pane initialSize={paneSize} minSize='20%'>
						<DanhSachMinhChung idLopHanhChinh={id} />
					</Pane>

					<Pane minSize='40%'>
						<KhaiBaoMinhChung idLopHanhChinh={id} />
					</Pane>
				</SplitPane>
			</Card>
		</>
	);
};

export default DetailDanhSachKhaiBao;
