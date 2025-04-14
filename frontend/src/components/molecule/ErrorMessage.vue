<script setup lang="ts">
defineProps({
  message: {
    type: String,
    required: true,
  },
  retryEnabled: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['retry']);

const handleRetry = () => {
  emit('retry');
};
</script>

<template>
  <div class="error-container" role="alert" aria-live="assertive">
    <div class="error-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
      </svg>
    </div>
    <div class="error-content">
      <p class="error-message">{{ message }}</p>
      <button v-if="retryEnabled" class="retry-button" @click="handleRetry">
        Retry
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-container {
  display: flex;
  align-items: flex-start;
  background-color: #fef2f2;
  border-radius: 0.375rem;
  padding: 1rem;
  margin: 1rem 0;
  border-left: 4px solid #ef4444;
}

.error-icon {
  flex-shrink: 0;
  color: #ef4444;
  margin-right: 0.75rem;
  margin-top: 0.25rem;
}

.error-content {
  flex: 1;
}

.error-message {
  color: #991b1b;
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.retry-button {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background-color: #ef4444;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #dc2626;
}
</style> 
