import { Segmented } from 'antd';

import { useState } from 'react';
import TableSinhVienKhaiBao from './TableSinhVien';

const DanhSachSinhVienKhaiBaoPage = () => {
	const [activeKey, setActiveKey] = useState('1');

	return (
		<>
			<Segmented
				value={activeKey}
				onChange={(value) => setActiveKey(value.toString())}
				options={[
					{ value: '1', label: 'Sinh viên chưa khai báo' },
					{ value: '2', label: 'Sinh viên nội trú' },
					{ value: '3', label: 'Sinh viên ngoại trú' },
				]}
				style={{ marginBottom: 12 }}
			/>
			{activeKey === '1' ? (
				<TableSinhVienKhaiBao />
			) : activeKey === '2' ? (
				<TableSinhVienKhaiBao isNoiTru />
			) : (
				<TableSinhVienKhaiBao isNoiTru={false} />
			)}
		</>
	);
};

export default DanhSachSinhVienKhaiBaoPage;
