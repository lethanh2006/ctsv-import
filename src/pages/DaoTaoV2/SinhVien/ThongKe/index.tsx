import { PieChartOutlined, TableOutlined } from '@ant-design/icons';
import { Card, Collapse, Tabs } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectHocKy from '../../HocKy/HocKy/components/SelectHocKy';
import CoVanHocTap from './CoVanHocTap';
import ThongKeDanToc from './DanToc';
import ThongKeHoKhau from './HoKhau';
import ThongKeNganh from './Nganh';
import ThongKeTonGiao from './TonGiao';

const ThongKeSinhVien = () => {
	const intl = useIntl();
	const { record: recHocKy, setRecord: setRecHocKy, danhSach } = useModel('daotaov2.hocky.hocky');
	const [mode, setMode] = useState<'table' | 'donut'>('table');
	return (
		<Card title={intl.formatMessage({ id: 'thongke.title' })}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<SelectHocKy
					style={{ width: 300, marginBottom: 8 }}
					value={recHocKy?._id}
					onChange={(val) => setRecHocKy(danhSach.find((item) => item._id === val))}
					isSetRecord
				/>
				<Tabs onChange={(val: any) => setMode(val)}>
					<Tabs.TabPane key={'table'} tabKey='table' tab={<TableOutlined />} />
					<Tabs.TabPane key={'donut'} tabKey='donut' tab={<PieChartOutlined />} />
				</Tabs>
			</div>
			<Collapse>
				<Collapse.Panel header={intl.formatMessage({ id: 'thongke.dantoc' })} key={'dantoc'}>
					<ThongKeDanToc mode={mode} />
				</Collapse.Panel>
				<Collapse.Panel header={intl.formatMessage({ id: 'thongke.tongiao' })} key={'tongiao'}>
					<ThongKeTonGiao mode={mode} />
				</Collapse.Panel>
				<Collapse.Panel header={intl.formatMessage({ id: 'thongke.nganh' })} key={'nganh'}>
					<ThongKeNganh mode={mode} />
				</Collapse.Panel>
				<Collapse.Panel header={intl.formatMessage({ id: 'thongke.hokhau' })} key={'hokhau'}>
					<ThongKeHoKhau mode={mode} />
				</Collapse.Panel>
				<Collapse.Panel header={intl.formatMessage({ id: 'thongke.cvht' })} key={'cvht'}>
					<CoVanHocTap mode={mode} />
				</Collapse.Panel>
			</Collapse>
		</Card>
	);
};

export default ThongKeSinhVien;
