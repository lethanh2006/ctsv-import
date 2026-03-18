import { EOperatorType } from '@/components/Table/constant';
import {
	ETinhTrangSucKhoe,
	colorETinhTrangSucKhoe,
	fieldTinhTrangSucKhoe,
	i18nTinhTrangSucKhoe,
} from '@/services/DotKhamSuKhoe/constant';

import { Card, Col, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const StatKetQuaKhamSucKhoe = () => {
	const intl = useIntl();
	const { setFilters, filters, thongKeSucKhoeSinhVienModel, thongKe } = useModel('hosotheodoisuckhoe.suckhoesinhvien');
	const { record } = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');

	useEffect(() => {
		if (record?._id) thongKeSucKhoeSinhVienModel(record?._id);
	}, [record?._id]);

	const handleTrangThai = (tinhTrangSucKhoe?: ETinhTrangSucKhoe) => {
		const temp = [...(filters ?? [])].filter((item) => item.field !== 'tinhTrangSucKhoe');
		if (tinhTrangSucKhoe)
			temp.push({
				active: true,
				field: 'tinhTrangSucKhoe',
				operator: EOperatorType.INCLUDE,
				values: [tinhTrangSucKhoe],
			});
		setFilters(temp);
	};

	return (
		<>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={12} md={6}>
					<Card className='card-stat-small' onClick={() => handleTrangThai()} style={{ cursor: 'pointer' }}>
						<span className='num'>{thongKe?.total ?? '--'}</span>
						<span>{intl.formatMessage({ id: 'ketquakhamsuckhoe.stat.tongso' })}</span>
					</Card>
				</Col>

				{Object.values(ETinhTrangSucKhoe).map((item) => (
					<Col span={12} md={6} key={item}>
						<Card className='card-stat-small' style={{ cursor: 'pointer' }} onClick={() => handleTrangThai(item)}>
							<span className='num' style={{ color: colorETinhTrangSucKhoe[item] }}>
								{thongKe?.[fieldTinhTrangSucKhoe[item]] ?? '--'}
							</span>
							<span>{intl.formatMessage({ id: i18nTinhTrangSucKhoe[item] })}</span>
						</Card>
					</Col>
				))}
			</Row>
		</>
	);
};

export default StatKetQuaKhamSucKhoe;
