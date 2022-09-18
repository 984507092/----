<template>
	<u-picker :show="show" ref="uPicker" :columns="multiArray" @close="show =false" @cancel="show=false"
		@change="handleValueChange" @confirm="$emit('getRegion',values);show = false" title="所在地区" confirmColor="#FF0000" closeOnClickOverlay>
	</u-picker>
</template>

<script>
	const CHINA_REGIONS = require('./regions.json')
	export default {
		props: {
			defaultRegion: [String, Array]
		},
		data() {
			return {
				preIndex: 23, //当前选中省的下标
				cityIndex: 0, //当前选中市的下标
				values: ['贵州省','贵阳市','南明区'], //当前选中的省市区
				show: false, //弹出层是否显示
			}
		},
		mounted() {
			this.$refs.uPicker.setIndexs([23, 0, 0],[23,0,0])
			uni.$on('showPopup',()=>{
				this.show  = true
			})
		},
		computed: {
			multiArray() {
				return [CHINA_REGIONS, this.cityArr, this.districtArr].map(arr => arr.map(item => item.name))
			},
			cityArr() {
				return CHINA_REGIONS[this.preIndex].childs
			},
			districtArr() {
				return CHINA_REGIONS[this.preIndex].childs[this.cityIndex].childs
			},
		},
		methods: {
			handleValueChange(e) {
				const {
					columnIndex, //滑动的第几列
					value, //当前选中的省市区数组
					indexs, // 当前变化列的数组下标
					index, //选中省在当前列的下标
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					picker = this.$refs.uPicker
				} = e
				// 当第一列值发生变化时，变化第二列(后一列)对应的选项
				if (columnIndex === 0) {
					this.preIndex = index
					this.cityIndex = 0
					// picker为选择器this实例，变化第二列对应的选项
					picker.setColumnValues(1, this.cityArr)
				}
				if (columnIndex === 1) {
					this.cityIndex = index
					// picker为选择器this实例，变化第三列对应的选项
					picker.setColumnValues(2, this.districtArr)
				}
				this.values = [CHINA_REGIONS[indexs[0]]?.name,this.cityArr[indexs[1]]?.name,this.districtArr[indexs[2]]?.name]
			},
		},
	}
</script>

<style lang="scss">

</style>