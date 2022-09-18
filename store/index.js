import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import {
	SAVE
} from "./mutations_type.js"
import {
	getUser
} from '@/utils/API/user.js'

const store = new Vuex.Store({
	state: {
		uid: '',
		userInfo: {},
		token: '',
		isLogin: false,
	},
	getters: {},
	mutations: {
		[SAVE](state, [key, val]) {
			state[key] = val
		},
		outLog(state,val){
			state.uid=''
			state.token=''
			state.userInfo={}
		}
	},
	actions: {
		getUserInfo(state, token) {
			return getUser({
				token
			}).then((res) => {
				console.log(res);
				let {
					uid,
					userInfo,
				} = res
				state.commit('save', ['uid', uid])
				state.commit('save', ['token', token])
				state.commit('save', ['userInfo', userInfo])
				state.commit("save", ["isLogin", true]);
			})
		}
	},
	modules: {}

})

export default store
