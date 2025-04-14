<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { KivaText } from '../atoms';

/**
 * Componente base para filtros de tipo dropdown con checkboxes
 * 
 * Se usa como base para los filtros específicos como SectorFilter y CountryFilter
 * Proporciona la interfaz de usuario básica y comportamiento común
 */

// Props
interface BaseFilterItem {
  id: number | string;
  name: string;
  count?: number;
}

interface Props {
  /** Lista de elementos a mostrar */
  items: BaseFilterItem[];
  /** Lista de elementos seleccionados por ID */
  selectedItems?: (number | string)[];
  /** Mostrar el contador junto al nombre del elemento */
  showCount?: boolean;
  /** Texto a mostrar cuando no hay elementos seleccionados */
  placeholder?: string;
  /** Si el componente está deshabilitado */
  disabled?: boolean;
  /** Si está cargando la lista de elementos */
  loading?: boolean;
  /** Mensaje a mostrar cuando no hay elementos disponibles */
  emptyMessage?: string;
  /** Mensaje a mostrar cuando está cargando */
  loadingMessage?: string;
  /** Texto para el botón aplicar */
  applyText?: string;
  /** Texto para el botón limpiar */
  clearText?: string;
  /** Identificador único para el filtro */
  filterId?: string;
  /** Si el dropdown está abierto (controlado desde el exterior) */
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
  isDropdownOpen: false
});

// Emits
const emit = defineEmits<{
  /** Emitido cuando cambia la selección de elementos */
  (e: 'update:selection', selection: (number | string)[]): void;
  /** Emitido cuando se aplica el filtro */
  (e: 'apply', selection: (number | string)[]): void;
  /** Emitido cuando se cambia el estado del dropdown */
  (e: 'toggle-dropdown', isOpen: boolean, filterId: string): void;
}>();

// Estado local
const selectedOptions = ref<(number | string)[]>(props.selectedItems || []);
const isOpen = ref(props.isDropdownOpen);

// Sincronizar el estado isOpen con la prop isDropdownOpen
watch(() => props.isDropdownOpen, (newVal) => {
  isOpen.value = newVal;
});

// Gestiona la selección/deselección de un elemento
const toggleItem = (itemId: number | string) => {
  if (selectedOptions.value.includes(itemId)) {
    selectedOptions.value = selectedOptions.value.filter(id => id !== itemId);
  } else {
    selectedOptions.value.push(itemId);
  }
};

// Aplica el filtro actual
const applyFilter = () => {
  emit('update:selection', selectedOptions.value);
  emit('apply', selectedOptions.value);
  toggleDropdown(false);
};

// Limpia todos los filtros
const clearFilter = () => {
  selectedOptions.value = [];
  emit('update:selection', []);
  emit('apply', []);
  toggleDropdown(false);
};

// Determina si un elemento está seleccionado
const isSelected = (itemId: number | string): boolean => {
  return selectedOptions.value.includes(itemId);
};

// Gestiona la apertura/cierre del dropdown
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
          <span v-if="props.showCount && item.count" class="item-count">
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
