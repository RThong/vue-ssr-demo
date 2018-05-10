<template>
	<div class="test">{{text}}</div>
</template>
<script>
	export default {
		data(){
			return {
				text: 'home'
			}
		}
	}
</script>
<style lang="stylus" scoped>
	.test{
		color: red;
	}
</style>