import api from "./api.service";

class CommissionRateHistoryService {
    constructor() {
        this.path = "commission-rate-history";
    }
    
    async getAll() {
        return (await api.get(`/${this.path}`)).data;
    }
    
    async addCOmmissionRateHistory(commissionRateHistory) {
        return (await api.post(`/${this.path}`, commissionRateHistory)).data;
    }

}
export default new CommissionRateHistoryService();