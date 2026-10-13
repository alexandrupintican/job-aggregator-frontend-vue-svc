import { computed, ref } from "vue";

// Common 2026 responsive design breakpoints
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
} as const;

const width = ref(typeof window !== "undefined" ? window.innerWidth : 0);

function updateWidth(): void {
  width.value = window.innerWidth;
}

if (typeof window !== "undefined") {
  window.addEventListener("resize", updateWidth);
}

export const isMobile = computed(() => width.value < breakpoints.sm);

export const isTablet = computed(
  () => width.value >= breakpoints.sm && width.value < breakpoints.lg,
);

export const isLaptop = computed(
  () => width.value >= breakpoints.lg && width.value < breakpoints.xl,
);

export const isDesktop = computed(
  () => width.value >= breakpoints.xl && width.value < breakpoints.xxl,
);

export const isWidescreen = computed(() => width.value >= breakpoints.xxl);

export const isSmallDevice = computed(() => isMobile.value || isTablet.value);
