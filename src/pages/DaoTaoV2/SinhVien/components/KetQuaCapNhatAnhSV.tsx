import TableStaticData from '@/components/Table/TableStaticData';
import { Button, Modal, Tabs } from 'antd';
import { useIntl, useModel } from 'umi';

const KetQuaCapNhatAnhSV = () => {
	const intl = useIntl();
	const { visibleKetQuaImportAnh, setVisibleKetQuaImportAnh } = useModel('daotaov2.sinhvien.sinhvien');

	const model: any = useModel('daotaov2.sinhvien.sinhvien');
	const MapKeyName: any = {
		listImageSuccess: intl.formatMessage({ id: 'hosonguoihoc.ketquacapnhatanhthesv.thanhcong' }),
		listImageError: intl.formatMessage({ id: 'hosonguoihoc.ketquacapnhatanhthesv.gaploi' }),
		listImageNotfound: intl.formatMessage({ id: 'hosonguoihoc.ketquacapnhatanhthesv.khongtimthaysinhvien' }),
	};
	return (
		<Modal
			destroyOnClose
			styles={{ paddingTop: 4 }}
			width={700}
			title={intl.formatMessage({ id: 'hosonguoihoc.ketquacapnhatanhthesv.title' })}
			open={visibleKetQuaImportAnh}
			footer={
				<Button type='primary' onClick={() => setVisibleKetQuaImportAnh(false)}>
					{intl.formatMessage({ id: 'global.button.dong' })}
				</Button>
			}
		>
			<Tabs>
				{['listImageSuccess', 'listImageError', 'listImageNotfound'].map((item) => (
					<Tabs.TabPane key={item} tabKey={item} tab={`${MapKeyName[item]} (${model?.[item]?.length ?? 0})`}>
						<TableStaticData
							addStt
							columns={[
								{
									title: intl.formatMessage({ id: 'hosonguoihoc.ketquacapnhatanhthesv.tenanh' }),
									dataIndex: 'filename',
									width: 200,
									align: 'center',
								},
								{
									title: intl.formatMessage({ id: 'hosonguoihoc.ketquacapnhatanhthesv.lydo' }),
									dataIndex: 'reason',
									width: 200,
									hide: item !== 'listImageError',
								},
							]}
							data={model?.[item] ?? []}
						/>
					</Tabs.TabPane>
				))}
			</Tabs>
		</Modal>
	);
};

export default KetQuaCapNhatAnhSV;
