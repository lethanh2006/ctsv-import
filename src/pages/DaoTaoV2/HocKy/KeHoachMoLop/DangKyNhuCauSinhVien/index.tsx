import { MenuOutlined } from '@ant-design/icons';
import { Button, Modal, Segmented, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import DotDangKyNhuCauPage from '../DotDangKyNhuCau';
import SelectDotDangKyNhuCau from '../DotDangKyNhuCau/Select';
import PhieuDangKyNhuCauPage from './PhieuDangKy';
import SinhVienChuaDangKyPage from './SinhVienKhongDangKy';

const NhuCauSinhVienPage = () => {
	const { record: recordKyHoc } = useModel('daotaov2.hocky.hocky');
	const { record: recDotDangKy, danhSach: danhSachDot, setRecord: setDot } = useModel('daotaov2.hocky.dotdangkynhucau');
	const [visibleDotDangKy, setVisibleDotDangKy] = useState(false);
	const [activeKey, setActiveKey] = useState('1');

	useEffect(() => {
		if (!recDotDangKy?._id) setActiveKey('1');
	}, [recDotDangKy?._id]);

	return (
		<>
			<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
				<SelectDotDangKyNhuCau
					style={{ width: 200 }}
					condition={{ maHocKy: recordKyHoc?.ma }}
					isSetRecord
					allowClear
					value={recDotDangKy?._id}
					onChange={(val) => setDot(danhSachDot.find((item) => item._id === val))}
				/>
				<Tooltip title='Quản lý đợt đăng ký nhu cầu'>
					<Button icon={<MenuOutlined />} onClick={() => setVisibleDotDangKy(true)} />
				</Tooltip>

				<Segmented
					value={activeKey}
					onChange={(value) => setActiveKey(value.toString())}
					options={[
						{ value: '1', label: 'Sinh viên đã đăng ký' },
						...(recDotDangKy?._id ? [{ value: '2', label: 'Sinh viên chưa đăng ký' }] : []),
					]}
				/>
			</div>

			{activeKey === '1' ? <PhieuDangKyNhuCauPage /> : <SinhVienChuaDangKyPage />}

			<Modal
				open={visibleDotDangKy}
				onCancel={() => setVisibleDotDangKy(false)}
				width={1000}
				footer={null}
				styles={{ padding: 0 }}
			>
				<DotDangKyNhuCauPage />
			</Modal>
		</>
	);
};

export default NhuCauSinhVienPage;
