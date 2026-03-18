import { Card, Steps } from 'antd';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import Form from './Form';
import FileList from './FileList';

const ModalVanBanHuongDan = () => {
  const { record, edit } = useModel('tienich.vanbanhuongdan');
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    setCurrentStep(0);
  }, [record?._id]);

  const onChangeStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} văn bản hướng dẫn`}>
      <Steps
        current={currentStep}
        type="navigation"
        style={{ marginBottom: 18, paddingTop: 0 }}
        onChange={record?._id ? onChangeStep : undefined}
      >
        <Steps.Step title="Thông tin thư mục" />
        <Steps.Step title="Danh sách văn bản" disabled={!record?._id} />
      </Steps>

      {currentStep === 0 ? <Form afterAddNew={() => setCurrentStep(1)} /> : <FileList />}
    </Card>
  );
};

export default ModalVanBanHuongDan;
