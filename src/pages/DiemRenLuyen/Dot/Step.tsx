import { Steps } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const StepDotChamDiemRenLuyen = () => {
	const intl = useIntl();
	const { record } = useModel('diemrenluyen.dot');
	const [step, setStep] = useState(0);
	const steps = [
		{
			thoiGian: record?.thoiGianTiepNhanMinhChung?.thoiGianBatDau,
			thoiGianKetThuc: record?.thoiGianTiepNhanMinhChung?.thoiGianKetThuc,
			title: intl.formatMessage({ id: 'lophanhchinh.minhchung.stat.capnhat' }),
		},
		{
			thoiGian: record?.thoiGianSVChamDiem?.thoiGianBatDau,
			thoiGianKetThuc: record?.thoiGianSVChamDiem?.thoiGianKetThuc,
			title: intl.formatMessage({ id: 'lophanhchinh.minhchung.stat.svdanhgia' }),
		},
		{
			thoiGian: record?.thoiGianBCSChamDiem?.thoiGianBatDau,
			thoiGianKetThuc: record?.thoiGianBCSChamDiem?.thoiGianKetThuc,
			title: intl.formatMessage({ id: 'lophanhchinh.minhchung.stat.bancansu' }),
		},
		{
			thoiGian: record?.thoiGianCoVanChamDiem?.thoiGianBatDau,
			thoiGianKetThuc: record?.thoiGianCoVanChamDiem?.thoiGianKetThuc,
			title: intl.formatMessage({ id: 'lophanhchinh.minhchung.stat.cvht' }),
		},

		// {
		// 	thoiGian: record?.thoiGianPhongCTSVChamDiem?.thoiGianBatDau,
		// 	thoiGianKetThuc: record?.thoiGianPhongCTSVChamDiem?.thoiGianKetThuc,
		// 	title: 'Phòng CTSV đánh giá',
		// },
		// { thoiGian: record?.thoiGianCVHTChamDiem?.thoiGianKetThuc, title: 'Kết thúc đánh giá' },
	];

	useEffect(() => {
		let s = -1;
		steps.some((item) => {
			if (dayjs().isBefore(item.thoiGian)) return true;
			s++;
			return false;
		});
		setStep(s);
	}, [record]);

	if (record)
		return (
			<Steps progressDot current={step} style={{ marginBottom: 12 }}>
				{steps.map((item) => (
					<Steps.Step
						description={item.title}
						title={
							<b style={{ fontSize: 13 }}>
								{dayjs(item.thoiGian).format('HH:mm DD/MM/YYYY')}
								{item?.thoiGianKetThuc ? ` - ${dayjs(item.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}` : ''}
							</b>
						}
						key={item.title}
					/>
				))}
			</Steps>
		);
	return <></>;
};

export default StepDotChamDiemRenLuyen;
