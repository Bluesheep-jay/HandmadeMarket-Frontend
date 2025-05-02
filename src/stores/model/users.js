import { api } from '@/services/api';

export default {
  namespaced: true,
  
  state: {
    users: [],
    loading: false,
    error: null
  },
  
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  
  actions: {
    async fetchUsers({ commit }) {
      try {
        commit('SET_LOADING', true);
        const response = await api.get('/users');
        commit('SET_USERS', response.data);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch users');
        console.error('Error fetching users:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async createUser({ commit, dispatch }, userData) {
      try {
        commit('SET_LOADING', true);
        await api.post('/users', userData);
        dispatch('fetchUsers');
        commit('SET_ERROR', null);
        return { success: true };
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to create user');
        console.error('Error creating user:', error);
        return { success: false, error: error.message };
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async updateUser({ commit, dispatch }, { id, userData }) {
      try {
        commit('SET_LOADING', true);
        await api.put(`/users/${id}`, userData);
        dispatch('fetchUsers');
        commit('SET_ERROR', null);
        return { success: true };
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to update user');
        console.error('Error updating user:', error);
        return { success: false, error: error.message };
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async deleteUser({ commit, dispatch }, id) {
      try {
        commit('SET_LOADING', true);
        await api.delete(`/users/${id}`);
        dispatch('fetchUsers');
        commit('SET_ERROR', null);
        return { success: true };
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to delete user');
        console.error('Error deleting user:', error);
        return { success: false, error: error.message };
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  
  getters: {
    getUsers: state => state.users,
    getUserById: state => id => state.users.find(user => user.id === id),
    isLoading: state => state.loading,
    hasError: state => !!state.error,
    errorMessage: state => state.error
  }
};