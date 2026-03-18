import ButtonExtend from '@/components/Table/ButtonExtend';
import SelectKhoaNganh from '@/pages/DaoTaoV2/NamHoc/KhoaNganh/components/Select';
import { Space } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useModel } from 'umi';
import NhuCauHocPhanPage from '../NhuCauHocPhan';
import ModalXinYKien from './ModalXinYKien';

const YKienHocPhanPage = () => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const {
		record: recKhoaNganh,
		setRecord: setKhoaNganh,
		danhSach: danhSachKhoaNganh,
	} = useModel('daotaov2.namhoc.khoanganh');
	const [visibleSurvey, setVisibleSurvey] = useState(false);

	return (
		<>
			<Space wrap style={{ marginBottom: 12 }}>
				<SelectKhoaNganh
					style={{ width: 300 }}
					// isSetRecord
					value={recKhoaNganh?.ma}
					onChange={(val) => setKhoaNganh(danhSachKhoaNganh.find((item) => item.ma === val))}
					allowClear
				/>

				{recHocKy?.tgBdLayYKienKhgd && recHocKy.tgKtLayYKienKhgd ? (
					<a href='#!' onClick={() => setVisibleSurvey(true)}>
						Thời gian đóng góp ý kiến KHGD từ {dayjs(recHocKy.tgBdLayYKienKhgd).format('DD/MM/YYYY')} đến{' '}
						{dayjs(recHocKy.tgKtLayYKienKhgd).format('DD/MM/YYYY')}
					</a>
				) : recHocKy?._id ? (
					<ButtonExtend onClick={() => setVisibleSurvey(true)}>Xin ý kiến kế hoạch giảng dạy</ButtonExtend>
				) : null}
			</Space>

			<NhuCauHocPhanPage maKhoaNganh={recKhoaNganh?.ma} />

			<ModalXinYKien visible={visibleSurvey} setVisible={setVisibleSurvey} />
		</>
	);
};

export default YKienHocPhanPage;
