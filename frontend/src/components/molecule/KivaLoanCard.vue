<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Loan } from '@/models/Loan';

import { KivaText, KivaBadge, KivaProgressBar, KivaImage } from '../atoms';

interface Props {
  id?: number;
  name?: string;
  loanAmount?: number;
  fundedAmount?: number;
  fundingPercentage?: number;
  imageUrl?: string;
  whySpecial?: string;
  location?: string;
  remainingAmount?: number;
  isFullyFunded?: boolean;
  categories?: string[];
  loan?: Loan;
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  name: undefined,
  loanAmount: undefined,
  fundedAmount: undefined,
  fundingPercentage: undefined,
  imageUrl: undefined,
  whySpecial: undefined,
  location: undefined,
  remainingAmount: undefined,
  isFullyFunded: undefined,
  categories: () => [],
  loan: undefined
});

// Computados para obtener los valores desde props o loan
const getId = computed(() => props.id ?? props.loan?.id);
const getName = computed(() => props.name ?? props.loan?.getPrimaryBorrowerName());
const getLoanAmount = computed(() => props.loanAmount ?? props.loan?.loanAmount ?? 0);
const getFundedAmount = computed(() => props.fundedAmount ?? props.loan?.loanFundraisingInfo.fundedAmount ?? 0);
const getWhySpecial = computed(() => props.whySpecial ?? props.loan?.whySpecial ?? '');
const getImageUrl = computed(() => props.imageUrl ?? props.loan?.image.url ?? '');
const getLocation = computed(() => props.location ?? props.loan?.getCountryName());
const getCategories = computed(() => props.categories ?? props.loan?.themes ?? []);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const selectedAmount = ref(25);

const handleClick = () => {
  emit('click');
};

const progressPercentage = computed(() => {
  if (props.fundingPercentage !== undefined) {
    return props.fundingPercentage;
  }
  
  if (props.loan) {
    return props.loan.getFundingPercentage();
  }

  if (getLoanAmount.value === 0) return 0;
  const percentage = (getFundedAmount.value / getLoanAmount.value) * 100;
  return Math.min(percentage, 100);
});

const amountToGo = computed(() => {
  if (props.remainingAmount !== undefined) {
    return props.remainingAmount;
  }
  
  if (props.loan) {
    return props.loan.getRemainingAmount();
  }
  
  return getLoanAmount.value - getFundedAmount.value;
});

const handleLend = (event: Event) => {
  event.stopPropagation();
  alert(`Lending $${selectedAmount.value} to ${getName.value}`);
};

const handleDropdownClick = (event: Event) => {
  event.stopPropagation();
};
</script>

<template>
  <div class="kiva-style-card" @click="handleClick" role="button" tabindex="0" @keydown.enter="handleClick">
    <div class="loan-image-container">
      <KivaImage 
        :contentfulSrc="getImageUrl" 
        :alt="getName" 
        :ariaLabel="getName" 
        width="480"
        height="300"
        class="loan-image" 
        loading="lazy"
      />

      <!-- Location badge -->
      <KivaBadge v-if="getLocation" class="location-badge" size="small">
        <span class="location-icon">📍</span> {{ getLocation }}
      </KivaBadge>
    </div>

    <div class="loan-container">
      <!-- Loan purpose -->
      <KivaText variant="h3" size="lg" weight="medium" class="loan-purpose">
        ${{ getLoanAmount }} helps {{ getName }} {{ getWhySpecial }}
      </KivaText>

      <!-- Categories -->
      <div class="categories" v-if="getCategories && getCategories.length > 0">
        <KivaBadge 
          v-for="(category, index) in getCategories" 
          :key="index" 
          size="small" 
          class="category-tag"
        >
          {{ category }}
        </KivaBadge>
      </div>

      <!-- Action row -->
      <div class="action-row">
        <div class="progress-column">
          <div class="amount-row">
            <KivaText size="sm" class="amount-to-go">${{ amountToGo }} to go</KivaText>
          </div>
          <KivaProgressBar 
            :value="progressPercentage" 
            :max="100" 
            :ariaLabel="`Loan progress: ${Math.round(progressPercentage)}% funded`"
          />
        </div>

        <div class="action-group" @click.stop>
          <div class="amount-selector">
            <select v-model="selectedAmount" class="amount-dropdown" @click="handleDropdownClick"
              @change="handleDropdownClick">
              <option value="25">$25</option>
              <option value="50">$50</option>
              <option value="100">$100</option>
              <option value="200">$200</option>
            </select>
          </div>

          <button 
            class="lend-button"
            @click="handleLend"
          >
            Lend
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kiva-style-card {
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  background-color: white;
  border: 1px solid #e5e7eb;
}

.kiva-style-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.loan-image-container {
  position: relative;
  height: 230px;
  overflow: hidden;
}

.loan-image {
  width: 100%;
  height: 100%;
}

.location-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.92);
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.location-icon {
  margin-right: 4px;
  color: #ef4444;
  font-size: 1rem;
}

.loan-container {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.loan-purpose {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  line-height: 1.4;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 1.5rem;
}

.action-row {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

.progress-column {
  flex: 1;
}

.amount-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
}

.amount-to-go {
  color: #374151;
  font-weight: 600;
  font-size: 1rem;
}

.action-group {
  display: flex;
  position: relative;
}

.amount-selector {
  position: relative;
  width: 90px;
}

.amount-dropdown {
  display: block;
  width: 100%;
  padding: 0.5rem 0.5rem;
  padding-right: 2rem;
  font-size: 1.25rem;
  border: 1px solid #d1d5db;
  border-top-left-radius: 9999px;
  border-bottom-left-radius: 9999px;
  border-right: none;
  appearance: none;
  background-color: white;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.6rem center;
  background-repeat: no-repeat;
  background-size: 0.8em 0.8em;
  height: 48px;
  text-align: center;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  z-index: 1;
  color: #374151;
}

.amount-dropdown:focus {
  outline: none;
  border-color: #26b6a1;
  box-shadow: 0 0 0 3px rgba(38, 182, 161, 0.2);
}

.lend-button {
  background-color: #4faf4e;
  color: white;
  padding: 0.75rem 1.5rem;
  height: 48px;
  width: 120px;
  font-weight: 500;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 9999px;
  border-bottom-right-radius: 9999px;
  font-size: 1.1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-left: -1px;
  z-index: 0;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.lend-button:hover {
  background-color: #3f8c3e;
}

:deep(.kv-progress-bar) {
  height: 8px !important;
  background-color: #e9e9e9 !important;
  border-radius: 999px !important;
  overflow: hidden;
}

:deep(.kv-progress-bar__inner) {
  background-color: #4faf4e !important;
  border-radius: 999px !important;
}
</style>
