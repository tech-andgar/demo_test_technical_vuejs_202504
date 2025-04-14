<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import KivaLoanCard from '../molecule/KivaLoanCard.vue';
import { KivaButton, KivaLoadingSpinner, KivaText } from '../atoms';
import ErrorMessage from '../molecule/ErrorMessage.vue';
import { useLoan } from '@/composables/useLoan';

/**
 * Grid component for displaying Kiva loans
 *
 * This component:
 * - Loads loan data using the useLoan composable
 * - Displays loans in a responsive grid layout
 * - Shows loading state when fetching data
 * - Shows empty state when no loans are found
 */

const { loans, loadLoans, loadingLoans: loading, error, errorMessage, retry } = useLoan();

/**
 * Fetch loans on component mount
 */
onMounted(() => {
  loadLoans();
});

/**
 * Handle click on a loan card
 *
 * @param loanId - ID of the clicked loan
 */
const handleLoanClick = (loanId: number) => {
  // router.push(`/loan/${loanId}`);
  alert(`Loan ${loanId} clicked`);
};
</script>

<template>
  <div class="kiva-style-container">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <KivaLoadingSpinner />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <ErrorMessage 
        :message="errorMessage" 
        :retry-enabled="true"
        @retry="retry" 
      />
    </div>

    <!-- Empty state -->
    <div v-else-if="loans.length === 0" class="no-loans-container">
      <KivaText variant="h3" size="xl" align="center">No loans found</KivaText>
      <KivaButton variant="primary" class="mt-4" @click="() => loadLoans()">
        Try again
      </KivaButton>
    </div>

    <!-- Loan grid -->
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
        :fundingPercentage="loan.getFundingPercentage()"
        :imageUrl="loan.image.url"
        :whySpecial="loan.getShortDescription(120)"
        :location="loan.getCountryName()"
        :remainingAmount="loan.getRemainingAmount()"
        :isFullyFunded="loan.isFullyFunded()"
        :categories="loan.themes || []"
        @click="handleLoanClick(loan.id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main container styles */
.kiva-style-container {
  width: 100%;
  padding: 0;
  max-width: 100vw;
}

/* Grid layout with responsive breakpoints */
.kiva-style-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
}

/* Responsive breakpoints for different screen sizes */
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

/* Loading and empty state styles */
.loading-container,
.no-loans-container,
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
}

.mt-4 {
  margin-top: 1rem;
}

.kiva-style-grid-item {
  height: 100%;
}

.no-loans-text {
  color: #6b7280;
  font-size: 1rem;
}
</style>
