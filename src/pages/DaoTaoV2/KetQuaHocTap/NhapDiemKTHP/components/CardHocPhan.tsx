import CardFilterHocPhanHocKy from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HocPhan/components/CardFilterHocPhan';
import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import SelectDonVi from '@/pages/DaoTaoV2/ToChucNhanSu/DonVi/Select';
import { Card, Space } from 'antd';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useIntl, useModel } from 'umi';

/** Card filter Học phần */
const CardHocPhan = (props: {
	child: (getData: () => void) => JSX.Element;
	title?: string;
	hideTrangThai?: boolean;
}) => {
	const intl = useIntl();
	const { setRecord: setHocPhan, getModel, record: recHocPhan } = useModel('daotaov2.hocphan.decuonghphk');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recDonVi, setRecord: setDonVi, danhSach: danhSachDonVi } = useModel('daotaov2.tochucnhansu.donvi');
	const { child, hideTrangThai } = props;
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('30%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	const getData = () =>
		recHocKy?.ma &&
		getModel({ maDonVi: recDonVi?.maDonVi, maHocKy: recHocKy?.ma, active: true }).then((data) => {
			// Nếu chưa focus vào học phần nào thì focus học phần đầu tiên
			if (!recHocPhan?._id) setHocPhan(data?.[0]);
		});

	return (
		<Card title={props.title ?? `${intl.formatMessage({ id: 'ketquahoctap.nhapdiemKTHP.title' })}`}>
			<Space wrap style={{ marginBottom: 8 }}>
				<FilterHocKy isSetHocKy />
				<SelectDonVi
					value={recDonVi?.maDonVi}
					style={{ width: 350 }}
					onChange={(val) => setDonVi(danhSachDonVi.find((item) => item.maDonVi === val))}
					allowClear
					placeholder='Chọn đơn vị quản lý'
				/>
			</Space>

			<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
				<Pane initialSize={paneSize} minSize='20%'>
					<CardFilterHocPhanHocKy trangThaiDiem={!hideTrangThai} size='small' required />
				</Pane>

				<Pane minSize='40%'>{child(getData)}</Pane>
			</SplitPane>
		</Card>
	);
};

export default CardHocPhan;
