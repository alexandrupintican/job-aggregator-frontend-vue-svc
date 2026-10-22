import { initVault } from "@/plugins/vault";
import { ref } from "vue";
import type { Ref } from "vue";
import { LayoutAliases } from "@/utils/enums";

// types
type Vault = {
  useLayout: {
    layoutRef: Ref<LayoutAliases>;
    setLayout(layout: LayoutAliases): void;
  };
};

export default function useLayout() {
  const storage = initVault<Vault>("useLayout");
  const useLayout = storage.get("useLayout");

  if (useLayout) {
    return useLayout;
  }

  const layoutRef: Ref<LayoutAliases> = ref(LayoutAliases.DEFAULT_LAYOUT);

  function setLayout(layout: LayoutAliases): void {
    if (layoutRef.value === layout) {
      return;
    }

    layoutRef.value = layout;
  }

  return storage.storeAndGet("useLayout", {
    layoutRef,
    setLayout,
  });
}
