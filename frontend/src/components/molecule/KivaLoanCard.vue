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

const progressPercentage = computed(() => {
  if (props.loanAmount === 0) return 0;
  const percentage = (props.fundedAmount / props.loanAmount) * 100;
  return Math.min(percentage, 100);
});

</script>

<template>
  <div class="kiva-style-card" @click="handleClick" role="button" tabindex="0" @keydown.enter="handleClick">
    <div class="loan-image-container">
      <div class="image-loading" v-if="imageLoading" aria-hidden="true">
        <div class="loading-spinner" aria-hidden="true"></div>
        <div class="spinner" aria-hidden="true"></div>
      </div>
      <img v-if="!imageError && props.imageUrl" :src="props.imageUrl" :alt="props.name" class="loan-image" @error="handleImageError"
        @load="handleImageLoad" :class="{ 'hidden': imageLoading }" loading="lazy"
        aria-describedby="loan-image-description" />
      <div v-if="imageError || !props.imageUrl" class="loan-placeholder" role="img"
        :aria-label="`${props.name} Placeholder for loan image`">
        <span>{{ props.name.charAt(0) || 'L' }}</span>
      </div>
    </div>
    <div class="loan-container">
      <h3 class="loan-name">{{ props.name }}</h3>
      <p class="loan-special" id="kvia-loan-description">{{ props.whySpecial }}</p>
      <div class="loan-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="progressPercentage">
        <div class="progress-bar" :style="{ width: `${progressPercentage}%` }"></div>
        <div class="progress-text">
          <span>{{ fundedAmount }} of {{ loanAmount }} funded</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kiva-style-card {
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  overflow: hidden;
}
.progress-container {
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  background-color: #26b6a1;
}

.progress-text {
  font-size: 0.8rem;
  color: #666;
}
</style>