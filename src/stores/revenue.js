import { adminService } from '@/services/admin.service';

export default {
  namespaced: true,
  
  state: {
    monthlyRevenueForYear: {},
    loading: false,
    error: null
  },
  
  mutations: {
    SET_MONTHLY_REVENUE(state, data) {
      state.monthlyRevenueForYear = data;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  
  actions: {
    async fetchMonthlyRevenue({ commit }, year) {
      try {
        commit('SET_LOADING', true);
        const data = await adminService.getMonthlyRevenueForYear(year);
        commit('SET_MONTHLY_REVENUE', data);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch monthly revenue');
        console.error('Error fetching monthly revenue:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  
  getters: {
    monthlyRevenueData: state => state.monthlyRevenueForYear,
    isLoading: state => state.loading,
    hasError: state => !!state.error,
    errorMessage: state => state.error
  }
};