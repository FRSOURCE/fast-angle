<script lang="ts" setup>
import DefaultLayout from '~/layouts/default.vue'
</script>

<template>
  <DefaultLayout>
    <div class="flex-grow" :class="$style.wrapper">
      <RouterView />
    </div>
  </DefaultLayout>
</template>

<style lang="scss" module>
.wrapper {
  max-width: 920px;
  margin: 20px auto 0;
  text-align: justify;
}
</style>
