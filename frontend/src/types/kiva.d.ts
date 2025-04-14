declare module '@kiva/kv-components/vue' {
  import { DefineComponent } from 'vue';

  export const KvButton: DefineComponent<{
    variant?: string;
    size?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    type?: string;
  }>;

  export const KvChip: DefineComponent<{
    size?: string;
  }>;

  export const KvProgressBar: DefineComponent<{
    value: number;
    max?: number;
  }>;

  export const KvContentfulImg: DefineComponent<{
    src: string;
    alt: string;
    loading?: string;
  }>;

  export const KvLoadingSpinner: DefineComponent<{
    size?: string;
  }>;
}
