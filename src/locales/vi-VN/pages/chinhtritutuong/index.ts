import danhgiaketqua from './danhgiaketqua';
import huongnghiepvieclam from './huongnghiepvieclam';
import thongke from './thongke';
import tuansinhhoatcongdan from './tuansinhhoatcongdan';
import tutuongchinhtri from './tutuongchinhtri';

export default {
	...tuansinhhoatcongdan,
	...huongnghiepvieclam,
	...tutuongchinhtri,
	...danhgiaketqua,
	...thongke,
};
