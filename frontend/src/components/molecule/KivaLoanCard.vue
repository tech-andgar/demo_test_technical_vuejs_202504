<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  id: number;
  name: string;
  loanAmount: number;
  fundedAmount: number;
  imageUrl: string;
  whySpecial: string;
}>();

const emit = defineEmits<{
  (e: 'click'): void
}>();

const imageError = ref(false);
const imageLoading = ref(false);

function handleImageError() {
  imageError.value = true;
  imageLoading.value = false;
}

function handleImageLoad() {
  imageLoading.value = false;
}

const handleClick = () => {
  emit('click');
}

</script>

<template>
  <div class="kiva-style-card" @click="handleClick" role="button" tabindex="0" @keydown.enter="handleClick">
    <div class="loan-image-container">
      <div class="image-loading" v-if="imageLoading" aria-hidden="true">
        <kv-spinner />
        <div class="spinner" aria-hidden="true"></div>
      </div>
      <img v-if="!imageError && !imageUrl" :src="imageUrl" :alt="name" class="loan-image" @error="handleImageError"
        @load="handleImageLoad" :class="{ 'hidden': imageLoading }" loading="lazy"
        aria-describedby="loan-image-description" />
      <div v-if="imageError || !imageUrl" class="loan-placeholder" role="img"
        :aria-label="`${name} Placeholder for loan image`">
        <span>{{ name.charAt(0) || 'L' }}</span>
      </div>
    </div>
  </div>
</template>