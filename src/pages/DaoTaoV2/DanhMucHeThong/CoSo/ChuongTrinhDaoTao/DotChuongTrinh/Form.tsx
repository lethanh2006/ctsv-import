import { Button, Card, Descriptions } from 'antd';
import { useModel } from 'umi';
import TableSoSanhHocPhan from './TableSoSanh';

const FormDotChuongTrinh = (props: { getData?: () => void }) => {
	const { record, setVisibleForm } = useModel('daotaov2.chuongtrinhdaotao.dotchuongtrinh');

	return (
		<Card title='Cập nhật chương trình'>
			<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
				<Descriptions.Item label='Mã chương trình'>{record?.ma}</Descriptions.Item>
				<Descriptions.Item label='Tên chương trình'>{record?.ten}</Descriptions.Item>
				<Descriptions.Item label='Trình độ đào tạo'>
					{record?.trinhDoDaoTao?.ten ?? record?.maTrinhDoDaoTao}
				</Descriptions.Item>
				<Descriptions.Item label='Ngành đào tạo'>{`${record?.nganh?.dmNganh?.ma ?? record?.nganh?.ma ?? ''} - ${
					record?.nganh?.ten ?? ''
				}`}</Descriptions.Item>
				<Descriptions.Item label='Năm ban hành'>{record?.namBanHanh}</Descriptions.Item>
			</Descriptions>

			<TableSoSanhHocPhan getData={props.getData} />

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
			</div>
		</Card>
	);
};

export default FormDotChuongTrinh;
