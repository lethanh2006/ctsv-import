import { useModel } from 'umi';
import FormBieuMau from './FormTaoBieuMau';
import FormTaoQuyTrinh from './FormTaoQuyTrinh';
import FormThongTinChung from './FormThongTinChung';
import { useEffect } from 'react';

const Form = () => {
  const { current, loaiDichVu } = useModel('dvmc.dichvumotcuav2');
  const { setRecord } = useModel('dvmc.thanhtoan');

  useEffect(() => {
    return () => {
      setRecord(undefined);
    };
  }, []);

  return (
    <>
      <div>
        {current === 2 && <FormTaoQuyTrinh />}
        {current === 1 && <FormBieuMau />}
        {current === 0 && loaiDichVu === 'DVMC' && <FormThongTinChung />}
      </div>
    </>
  );
};

export default Form;
