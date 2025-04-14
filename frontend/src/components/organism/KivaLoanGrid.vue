<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import KivaLoanCard from '../molecule/KivaLoanCard.vue';
import { useLoan } from '@/composables/useLoan';
const { loans, loadLoans, loadingLoans: loading } = useLoan();

onMounted(() => {
  loadLoans();
});

const handleLoanClick = (loanId: number) => {
  // router.push(`/loan/${loanId}`);
  alert(`Loan ${loanId} clicked`);
};
</script>

<template>
  <div class="kiva-style-container">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>

    <div v-else-if="loans.length === 0" class="no-loans-container">
      <div class="no-loans-text">No loans found</div>
    </div>

    <div v-else class="kiva-style-grid">
      <div 
      v-for="loan in loans"
      :key="loan.id"
      class="kiva-style-grid-item"
      >
        <KivaLoanCard 
        :id="loan.id"
        :name="loan.name"
        :loanAmount="loan.loanAmount"
        :fundedAmount="loan.loanFundraisingInfo.fundedAmount"
        :imageUrl="loan.image.url"
        :whySpecial="loan.whySpecial"
        :location="loan.geocode?.country?.name || ''"
        :categories="loan.themes || []"
        @click="handleLoanClick(loan.id)"
        />

      </div>
    </div>
  </div>
</template>

<style scoped>
.kiva-style-container {
  width: 100%;
  padding: 0;
  max-width: 100vw;
}

.kiva-style-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
}

@media (min-width: 480px) {
  .kiva-style-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media (min-width: 768px) {
  .kiva-style-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .kiva-style-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .kiva-style-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
  }
}

.loading-container,
.no-loans-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #26b6a1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.kiva-style-grid-item {
  height: 100%;
}
</style>
