import { api } from '@/services/api';

export default {
  namespaced: true,
  
  state: {
    monthlyRevenue: {},
    topCategories: [],
    loading: false,
    error: null
  },
  
  mutations: {
    SET_MONTHLY_REVENUE(state, data) {
      state.monthlyRevenue = data;
    },
    SET_TOP_CATEGORIES(state, data) {
      state.topCategories = data;
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
        const response = await api.get(`/admin/monthly-revenue/${year}`);
        commit('SET_MONTHLY_REVENUE', response.data);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch monthly revenue');
        console.error('Error fetching monthly revenue:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchTopCategories({ commit }, { month, year }) {
      try {
        commit('SET_LOADING', true);
        const response = await api.get(`/admin/top-categories`, {
          params: { month, year }
        });
        commit('SET_TOP_CATEGORIES', response.data);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch top categories');
        console.error('Error fetching top categories:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  
  getters: {
    getMonthlyRevenue: state => state.monthlyRevenue,
    getTopCategories: state => state.topCategories,
    isLoading: state => state.loading,
    hasError: state => !!state.error,
    errorMessage: state => state.error
  }
};