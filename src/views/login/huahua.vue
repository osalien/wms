<template>

</template>

<script>
export default {
name: "huahua"
}
if(stroe.getters.roles.length===0){
  store.dispatch('GetInfo').then(res => {
    const roles = res.data.role;
    next();
  })
}

</script>

<style scoped>
</style>
