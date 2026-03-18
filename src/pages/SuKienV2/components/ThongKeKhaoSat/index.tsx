import { ELoaiKhaoSatSuKien } from '@/services/SuKienV2/constant';
import { exportKetQuaKhaoSatSuKien } from '@/services/TienIch/DotKhaoSat';
import { ExportOutlined } from '@ant-design/icons';
import { Button, Segmented } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ThongKe from './components/thongKe';

const ThongKeKhaoSat = () => {
	const { record: recSuKien, handleGetThongKeKhaoSat } = useModel('sukienv2');
	const [dataSeg, setDataSeg] = useState<'dang-ky' | 'check-in' | 'check-out'>(
		recSuKien?.idKhaoSatDangKy ? 'dang-ky' : recSuKien?.idKhaoSatCheckIn ? 'check-in' : 'check-out',
	);
	const [loading, setLoading] = useState<boolean>(false);
	const getData = () => {
		if (recSuKien?.idKhaoSatDangKy && dataSeg === 'dang-ky')
			handleGetThongKeKhaoSat(recSuKien?.idKhaoSatDangKy, recSuKien?._id, ELoaiKhaoSatSuKien.DANG_KY);
		else if (recSuKien?.idKhaoSatCheckIn && dataSeg === 'check-in')
			handleGetThongKeKhaoSat(recSuKien?.idKhaoSatCheckIn, recSuKien?._id, ELoaiKhaoSatSuKien.CHECK_IN);
		else if (recSuKien?.idKhaoSatCheckOut && dataSeg === 'check-out')
			handleGetThongKeKhaoSat(recSuKien?.idKhaoSatCheckOut, recSuKien?._id, ELoaiKhaoSatSuKien.CHECK_OUT);
	};

	useEffect(() => {
		getData();
	}, [recSuKien, dataSeg]);

	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
				<Button
					loading={loading}
					type='primary'
					onClick={() => {
						setLoading(true);
						exportKetQuaKhaoSatSuKien({
							idKhaoSat:
								dataSeg === 'check-in'
									? (recSuKien?.idKhaoSatCheckIn ?? '')
									: dataSeg === 'dang-ky'
										? (recSuKien?.idKhaoSatDangKy ?? '')
										: (recSuKien?.idKhaoSatCheckOut ?? ''),
							idSuKien: recSuKien?._id ?? '',
						}).then((res) => fileDownload(res.data, `Kết quả khảo sát_${dataSeg}.xlsx`));
						setLoading(false);
					}}
					// type={'link'}
					icon={<ExportOutlined />}
				>
					Xuất kết quả khảo sát
				</Button>
				<Segmented
					value={dataSeg}
					onChange={(val) => {
						setDataSeg(val as any);
					}}
					options={[
						{ value: 'dang-ky', label: 'Đăng ký', disabled: !recSuKien?.idKhaoSatDangKy },
						{ value: 'check-in', label: 'Checkin', disabled: !recSuKien?.idKhaoSatCheckIn },
						{ value: 'check-out', label: 'Checkout', disabled: !recSuKien?.idKhaoSatCheckOut },
					]}
				/>
			</div>
			<ThongKe />
		</>
	);
};
export default ThongKeKhaoSat;
