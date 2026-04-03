import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';

export async function putApproveMyCCT(idmycct: string, payLoad: any) {
	return axios.post(`${ipCCT}/my-cct/${idmycct}/review`, payLoad);
}

export async function getAnalyticsMyCCT(condition?: any) {
	return axios.get(`${ipCCT}/my-cct/statistics`, { params: { condition: condition } });
}

export async function getAnalyticsMyCCTRound(roundId: string, condition?: any) {
	return axios.get(`${ipCCT}/my-cct/statistics/round/${roundId}`, { params: { condition: condition } });
}
