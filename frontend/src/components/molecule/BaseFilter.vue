<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { KivaText } from '../atoms';

/**
 * Base component for dropdown filters with checkboxes
 *
 * Used as a base for specific filters like SectorFilter and CountryFilter
 * Provides the basic user interface and common behavior
 */

// Props
interface BaseFilterItem {
  id: number | string;
  name: string;
  count?: number;
}

interface Props {
  /** List of items to display */
  items: BaseFilterItem[];
  /** List of selected items by ID */
  selectedItems?: (number | string)[];
  /** Show the counter next to the item name */
  showCount?: boolean;
  /** Text to display when no items are selected */
  placeholder?: string;
  /** If the component is disabled */
  disabled?: boolean;
  /** If the list of items is loading */
  loading?: boolean;
  /** Message to display when no items are available */
  emptyMessage?: string;
  /** Message to display when loading */
  loadingMessage?: string;
  /** Text for the apply button */
  applyText?: string;
  /** Text for the clear button */
  clearText?: string;
  /** Unique identifier for the filter */
  filterId?: string;
  /** If the dropdown is open (controlled from outside) */
  isDropdownOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selectedItems: () => [],
  showCount: true,
  placeholder: 'Select items',
  disabled: false,
  loading: false,
  emptyMessage: 'No items available',
  loadingMessage: 'Loading...',
  applyText: 'Apply',
  clearText: 'Clear',
  filterId: '',
  isDropdownOpen: false,
});

// Emits
const emit = defineEmits<{
  /** Emitted when the item selection changes */
  (e: 'update:selection', selection: (number | string)[]): void;
  /** Emitted when the filter is applied */
  (e: 'apply', selection: (number | string)[]): void;
  /** Emitted when the dropdown state changes */
  (e: 'toggle-dropdown', isOpen: boolean, filterId: string): void;
}>();

// Local state
const selectedOptions = ref<(number | string)[]>(props.selectedItems || []);
const isOpen = ref(props.isDropdownOpen);

// Synchronize isOpen state with isDropdownOpen prop
watch(
  () => props.isDropdownOpen,
  (newVal) => {
    isOpen.value = newVal;
  }
);

// Handles item selection/deselection
const toggleItem = (itemId: number | string) => {
  if (selectedOptions.value.includes(itemId)) {
    selectedOptions.value = selectedOptions.value.filter((id) => id !== itemId);
  } else {
    selectedOptions.value.push(itemId);
  }
};

// Applies the current filter
const applyFilter = () => {
  emit('update:selection', selectedOptions.value);
  emit('apply', selectedOptions.value);
  toggleDropdown(false);
};

// Clears all filters
const clearFilter = () => {
  selectedOptions.value = [];
  emit('update:selection', []);
  emit('apply', []);
  toggleDropdown(false);
};

// Determines if an item is selected
const isSelected = (itemId: number | string): boolean => {
  return selectedOptions.value.includes(itemId);
};

// Handles dropdown opening/closing
const toggleDropdown = (open?: boolean) => {
  const newState = open !== undefined ? open : !isOpen.value;
  isOpen.value = newState;
  emit('toggle-dropdown', newState, props.filterId);
};
</script>

<template>
  <div class="base-filter" :class="{ 'disabled': props.disabled }">
    <div class="filter-header" @click="!props.disabled && toggleDropdown()">
      <KivaText variant="h6" size="md">
        {{ props.placeholder }}
        <span v-if="selectedOptions.length > 0" class="selected-count">
          ({{ selectedOptions.length }})
        </span>
      </KivaText>
      <span class="toggle-icon">
        {{ isOpen ? '▲' : '▼' }}
      </span>
    </div>
    
    <div v-if="isOpen && !props.disabled" class="dropdown-container">
      <div v-if="props.loading" class="loading-message">
        <KivaText>{{ props.loadingMessage }}</KivaText>
      </div>
      
      <div v-else-if="props.items.length === 0" class="empty-message">
        <KivaText>{{ props.emptyMessage }}</KivaText>
      </div>
      
      <div v-else class="item-list">
        <div class="filter-info" v-if="props.showCount">
          <small class="info-text">Numbers indicate the total loans available in each category (including all statuses), without applying other filters</small>
        </div>
        <div 
          v-for="item in props.items" 
          :key="item.id"
          @click="toggleItem(item.id)"
          class="item-entry"
          :class="{ 'selected': isSelected(item.id) }"
        >
          <div class="checkbox">
            <span v-if="isSelected(item.id)" class="checkmark">✓</span>
          </div>
          <span class="item-name">{{ item.name }}</span>
          <span v-if="props.showCount && item.count" 
                class="item-count" 
                :class="{ 'muted-count': !isSelected(item.id) }" 
                :title="`Total loans in ${item.name} (without other filters)`">
            ({{ item.count }})
          </span>
        </div>
      </div>
      
      <div class="filter-actions">
        <button class="btn-clear" @click="clearFilter">{{ props.clearText }}</button>
        <button class="btn-apply" @click="applyFilter">{{ props.applyText }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.base-filter {
  position: relative;
  width: 100%;
  max-width: 300px;
  font-family: var(--kiva-font-family, 'Arial, sans-serif');
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.toggle-icon {
  font-size: 0.75rem;
  color: #6b7280;
}

.selected-count {
  font-size: 0.875rem;
  color: #10b981;
  margin-left: 0.25rem;
}

.dropdown-container {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 300px;
  margin-top: 0.25rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
}

.loading-message,
.empty-message {
  padding: 1rem;
  text-align: center;
  color: #6b7280;
}

.filter-info {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

.info-text {
  color: #6b7280;
  font-size: 0.75rem;
  font-style: italic;
}

.item-list {
  max-height: 220px;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.item-entry {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.item-entry:hover {
  background-color: #f9fafb;
}

.item-entry.selected {
  background-color: #ecfdf5;
}

.checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  margin-right: 0.75rem;
}

.selected .checkbox {
  background-color: #10b981;
  border-color: #10b981;
}

.checkmark {
  color: white;
  font-size: 0.75rem;
  line-height: 1;
}

.item-name {
  flex: 1;
  font-size: 0.875rem;
}

.item-count {
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 0.5rem;
}

.muted-count {
  color: #9ca3af;
  font-style: italic;
}

.filter-actions {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-clear,
.btn-apply {
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-clear {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #6b7280;
}

.btn-apply {
  background-color: #10b981;
  border: 1px solid #10b981;
  color: white;
}

.btn-clear:hover {
  background-color: #f9fafb;
}

.btn-apply:hover {
  background-color: #059669;
}

.base-filter.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.base-filter.disabled .filter-header {
  cursor: not-allowed;
  background-color: #f3f4f6;
}
</style> 
