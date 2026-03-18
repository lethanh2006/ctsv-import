import StepDotChamDiemRenLuyen from '@/pages/DiemRenLuyen/Dot/Step';
import DanhSachMinhChung from '@/pages/DiemRenLuyen/MinhChung/CauHinh/DanhSach';
import KhaiBaoMinhChung from '@/pages/DiemRenLuyen/MinhChung/KhaiBao';
import { Card } from 'antd';
import { useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useIntl } from 'umi';

const DanhSachKhaiBao = (props: { tenLop?: string; idLop?: string }) => {
	const intl = useIntl();
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('20%');
	const handlePaneSizeChange = (size: any) => setPaneSize(size[0]);
	const minhChungDrlRef = useRef(null);

	const MainContent = (
		<>
			<StepDotChamDiemRenLuyen />
			<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
				<Pane initialSize={paneSize} minSize='20%'>
					<DanhSachMinhChung idLopHanhChinh={props?.idLop} ref={minhChungDrlRef} />
				</Pane>

				<Pane minSize='40%'>
					<KhaiBaoMinhChung
						idLopHanhChinh={props?.idLop}
						getDataMinhChung={() => {
							if (minhChungDrlRef?.current) {
								//@ts-ignore
								minhChungDrlRef?.current?.getDataLoaiMinhChung();
							}
						}}
					/>
				</Pane>
			</SplitPane>
		</>
	);

	return (
		<>
			{props.idLop ? (
				MainContent
			) : (
				<Card title={intl.formatMessage({ id: 'lophanhchinh.minhchung.title' })}>{MainContent}</Card>
			)}
		</>
	);
};
export default DanhSachKhaiBao;
