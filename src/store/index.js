import Vue from 'vue'
import Vuex from 'vuex'
import {getUserInfo,getValidator} from '../utils/asyncData.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username:'',
    userName:''
  },
  mutations: {
    SET_USERNAME(state, value) {
      state.username = value;
    },
    SET_USERNAME2(state, value) {
      state.userName = value;
    }
  },
  actions: {
    async login({commit}, username) {
      const response = await getUserInfo(username);
      if (response.code === 1) {
        commit("SET_USERNAME", username);
        localStorage.setItem('token', response.token)
        return Promise.resolve(response.useInfo)
      } else {
        return Promise.reject(response)
      }
    },
    async preLogin({commit}) {
      const response = await getValidator();
      if (response.code === 1) {
        commit('SET_USERNAME2', response.useInfo);
        localStorage.setItem('token', response.token)
      }
      return response.code;
    }
  },
  modules: {
  }
})
