<template>
	<view>
		<cl-card :label="company"  :more-text="express_no">
			<cl-timeline>
				<cl-timeline-item
					v-for="(item, index) in list"
					:key="index"
					:timestamp="item.time"
					:content="item.context"
				></cl-timeline-item>
			</cl-timeline>
		</cl-card>
	</view>
</template>

<script>

</script>

<style></style>
