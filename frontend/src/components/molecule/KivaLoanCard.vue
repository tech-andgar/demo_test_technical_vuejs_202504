<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  id: number;
  name: string;
  loanAmount: number;
  fundedAmount: number;
  imageUrl: string;
  whySpecial: string;
  location?: string;
  categories?: string[];
}>();

const emit = defineEmits<{
  (e: 'click'): void
}>();

const imageError = ref(false);
const imageLoading = ref(false);
const selectedAmount = ref(25);

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

const amountToGo = computed(() => {
  return props.loanAmount - props.fundedAmount;
});

const handleLend = (event: Event) => {
  event.stopPropagation();
  // Implementar la funcionalidad de préstamo aquí
  alert(`Lending $${selectedAmount.value} to ${props.name}`);
};

const handleDropdownClick = (event: Event) => {
  event.stopPropagation();
};
</script>

<template>
  <div class="kiva-style-card" @click="handleClick" role="button" tabindex="0" @keydown.enter="handleClick">
    <div class="loan-image-container">
      <div class="image-loading" v-if="imageLoading" aria-hidden="true">
        <div class="loading-spinner" aria-hidden="true"></div>
      </div>
      <img v-if="!imageError && props.imageUrl" :src="props.imageUrl" :alt="props.name" class="loan-image" 
        @error="handleImageError" @load="handleImageLoad" :class="{ 'hidden': imageLoading }" loading="lazy" />
      <div v-if="imageError || !props.imageUrl" class="loan-placeholder" role="img"
        :aria-label="`${props.name} Placeholder for loan image`">
        <span>{{ props.name.charAt(0) || 'L' }}</span>
      </div>
      
      <!-- Location badge -->
      <div v-if="props.location" class="location-badge">
        <span class="location-icon">📍</span> {{ props.location }}
      </div>
    </div>
    
    <div class="loan-container">
      <!-- Loan purpose -->
      <h3 class="loan-purpose">${{ props.loanAmount }} helps {{ props.name }} {{ props.whySpecial }}</h3>
      
      <!-- Categories -->
      <div class="categories" v-if="props.categories && props.categories.length > 0">
        <span v-for="(category, index) in props.categories" :key="index" class="category-tag">
          {{ category }}
        </span>
      </div>
      
      <!-- Action row -->
      <div class="action-row">
        <div class="progress-column">
          <div class="amount-to-go">${{ amountToGo }} to go</div>
          <div class="loan-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="progressPercentage">
            <div class="progress-bar" :style="{ width: `${progressPercentage}%` }"></div>
          </div>
        </div>
        
        <div class="action-column" @click.stop>
          <div class="amount-selector">
            <select v-model="selectedAmount" class="amount-dropdown" @click="handleDropdownClick" @change="handleDropdownClick">
              <option value="25">$25</option>
              <option value="50">$50</option>
              <option value="100">$100</option>
              <option value="200">$200</option>
            </select>
          </div>
          
          <button class="lend-button" @click="handleLend">Lend</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kiva-style-card {
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  background-color: white;
}

.kiva-style-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.loan-image-container {
  position: relative;
  height: 230px;
  overflow: hidden;
}

.loan-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.location-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background-color: white;
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.location-icon {
  margin-right: 4px;
}

.loan-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
  font-size: 2rem;
  color: #666;
}

.loan-container {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.loan-purpose {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0 0 1.5rem 0;
  color: #333;
  line-height: 1.4;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 1.5rem;
}

.category-tag {
  background-color: #f5f5f5;
  color: #666;
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 4px;
}

.action-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.progress-column {
  flex: 1;
  min-width: 0;
}

.action-column {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.amount-to-go {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.loan-progress {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
}

.progress-bar {
  height: 100%;
  background-color: #4faf9c;
}

.amount-selector {
  width: 80px;
}

.amount-dropdown {
  width: 100%;
  padding: 0.75rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  height: 58px;
}

.lend-button {
  padding: 1rem 2rem;
  background-color: #4faf9c;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-weight: 500;
  font-size: 1.125rem;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  height: 58px;
  min-width: 120px;
}

.lend-button:hover {
  background-color: #3d9d8a;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4faf9c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.hidden {
  display: none;
}
</style>
