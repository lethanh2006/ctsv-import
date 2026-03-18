import type { KeHoachNamHoc } from '@/services/DaoTaoV2/NamHoc/KeHoachNamHoc/typings';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const XepLichHeader = (props: { width?: number }) => {
	const { getAllModel: getTietHoc, danhSach } = useModel('daotaov2.danhmuc.tiethoc');
	const [header, setHeader] = useState<KeHoachNamHoc.TGridHeader>();

	const getDataHeader = (danhSachTietHoc: TietHoc.IRecordCoSo[]) => {
		let tietHocs: number[] = [];
		const thus: KeHoachNamHoc.THeadGroup[] = [];
		_.range(1, 8).map((thu) => {
			thus.push({ span: danhSachTietHoc.length, title: thu === 7 ? 'Chủ nhật' : `Thứ ${thu + 1}` });
			tietHocs = tietHocs.concat(danhSachTietHoc.map((i) => i.tietHoc + (thu - 1) * danhSachTietHoc.length));
		});
		setHeader({ weeks: tietHocs, months: thus, days: [] });
	};

	useEffect(() => {
		getTietHoc(undefined, { tietHoc: 1 }, { maNhomTietHoc: APP_CONFIG_INIT_MA_NHOM_TIET_HOC }).then((data) =>
			getDataHeader(data),
		);
	}, []);

	return (
		<div className='title-row'>
			<div className='row-thoi-khoa-bieu'>
				<div className='cell title-cell first-cell'>Thứ</div>
				{header?.months.map((item) => (
					<div
						className='cell title-cell border-right'
						key={item.title}
						style={{ width: (props.width ?? 60) * item.span + item.span - 1 }}
					>
						{item.title}
					</div>
				))}
			</div>
			<div className='row-thoi-khoa-bieu'>
				<div className='cell title-cell first-cell'>Tiết học</div>
				{header?.weeks.map((tiet) => (
					<div className={`cell title-cell ${tiet % danhSach.length === 0 ? 'border-right' : ''}`} key={tiet}>
						{((tiet - 1) % danhSach.length) + 1}
					</div>
				))}
			</div>
		</div>
	);
};

export default XepLichHeader;
