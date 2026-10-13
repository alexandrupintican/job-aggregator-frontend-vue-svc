import { initVault } from "@/plugins/vault";
import { PageAliases } from "@/utils/pages";
import { ref, Ref } from "vue";

// types=
type Vault = {
  usePages: {
    pageRef: Ref<PageAliases>;
    setPage(page: PageAliases): void;
  };
};

export default function usePages() {
  const storage = initVault<Vault>("usePages");
  const usePages = storage.get("usePages");

  if (usePages) {
    return usePages;
  }

  const pageRef: Ref<PageAliases> = ref(PageAliases.HOME_PAGE);

  function setPage(page: PageAliases): void {
    if (pageRef.value === page) {
      return;
    }

    pageRef.value = page;
  }

  return storage.storeAndGet("usePages", {
    pageRef,
    setPage,
  });
}
