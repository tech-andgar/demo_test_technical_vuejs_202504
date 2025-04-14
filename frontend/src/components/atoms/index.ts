// @ts-ignore
import KvButton from '@kiva/kv-components/dist/components/KvButton.vue';
// @ts-ignore
import KvProgressBar from '@kiva/kv-components/dist/components/KvProgressBar.vue';
// @ts-ignore
import KvContentfulImg from '@kiva/kv-components/dist/components/KvContentfulImg.vue';
// @ts-ignore
import KvLoadingSpinner from '@kiva/kv-components/dist/components/KvLoadingSpinner.vue';

import KivaText from './KivaText.vue';
import KivaBadge from './KivaBadge.vue';
import Spinner from './Spinner.vue';

// Importar desde molecule para mantener compatibilidad
import KivaLoanCard from '../molecule/KivaLoanCard.vue';

export {
  KvButton as KivaButton,
  KivaBadge,
  KvProgressBar as KivaProgressBar,
  KvContentfulImg as KivaImage,
  KvLoadingSpinner as KivaLoadingSpinner,
  KivaText,
  KivaLoanCard,
  Spinner
};
