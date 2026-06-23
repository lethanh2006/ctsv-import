import StatisticsCard from '@/components/StatisticsCard';
import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ThongKePhongKTX = () => {
    const intl = useIntl();
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { getThongKe, record: thongKeData, loading } = useModel('kytucxa.thongkephong');

	useEffect(() => {
		if (recHocKy?.ma) {
			getThongKe({ maHocKy: recHocKy?.ma });
		}
	}, [recHocKy?.ma]);

    const statData = [
        {
            title: intl.formatMessage({ id: 'kytucxa.phong.thongke.tongSoPhong' }),
            value: thongKeData?.tongQuan?.tongSoPhong || 0,
            valueColor: '#1890ff',
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.phong.thongke.soPhongChoThue' }),
            value: thongKeData?.tongQuan?.soLuongPhongChoThue || 0,
            valueColor: '#52c41a',
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.phong.thongke.tongSucChua' }),
            value: thongKeData?.tongQuan?.tongSucChua || 0,
            valueColor: '#722ed1',
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.phong.thongke.svDaDangKy' }),
            value: thongKeData?.tongQuan?.soLuongSinhVienDaDangKy || 0,
            valueColor: '#fa8c16',
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.phong.thongke.choConTrong' }),
            value: thongKeData?.tongQuan?.soLuongChoConTrong || 0,
            valueColor: '#f5222d',
        },
    ];

	return (
		<div style={{ marginBottom: 24 }}>
			<div style={{ marginBottom: 16 }}>
				<FilterHocKy isSetHocKy width={300} hideExpand />
			</div>
			<StatisticsCard 
                title=""
                data={statData} 
                loading={loading}
                hideCard={true}
                colSpan={{ flex: '1 1 180px' } as any}
                rowGutter={16}
            />
		</div>
	);
};

export default ThongKePhongKTX;
