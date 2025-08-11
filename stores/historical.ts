import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useHistoricalStore = defineStore("historical", () => {
  // State
  const lastUpdateDate = ref<string | null>(null);
  const selectedYear = ref<number | null>(null);
  const selectedCity = ref<{ name: string; country: string; lat: number; lng: number } | null>(null);
  const isPlaying = ref<boolean>(false);
  const playerInterval = ref<NodeJS.Timeout | null>(null);

  // Getters
  const availableYears = computed(() =>
    Array.from(
      { length: new Date().getFullYear() - 1940 + 1 },
      (_, i) => 1940 + i
    )
  );

  const stats = computed(() => ["min", "mean", "max"]);

  // Actions
  const setLastUpdateDate = (date: string) => {
    lastUpdateDate.value = date;
  };

  const setYear = (year: number) => {
    selectedYear.value = year;
  };

  const previousYear = () => {
    if (selectedYear.value) {
      const currentIndex = availableYears.value.indexOf(selectedYear.value);
      if (currentIndex > 0) {
        selectedYear.value = availableYears.value[currentIndex - 1];
        return true;
      }
      return false;
    }
  };

  const nextYear = () => {
    if (selectedYear.value) {
      const currentIndex = availableYears.value.indexOf(selectedYear.value);
      if (currentIndex < availableYears.value.length - 1) {
        selectedYear.value = availableYears.value[currentIndex + 1];
        return true;
      }
      return false;
    }
    return false;
  };

  const firstYear = () => {
    if (availableYears.value.length > 0) {
      selectedYear.value = availableYears.value[0];
    }
  };

  const lastYear = () => {
    if (availableYears.value.length > 0) {
      selectedYear.value =
        availableYears.value[availableYears.value.length - 1];
    }
  };

  const initializeDefaults = () => {
    const currentYear = new Date().getFullYear();
    selectedYear.value = currentYear;
  };

  const togglePlayback = () => {
    isPlaying.value = !isPlaying.value;
    if (isPlaying.value) {
      playerInterval.value = setInterval(() => {
        if (!isPlaying.value || !nextYear()) {
          clearInterval(playerInterval.value!);
          isPlaying.value = false;
        }
      }, 250);
    } else {
      clearInterval(playerInterval.value!);
    }
  };

  return {
    // State
    lastUpdateDate,
    selectedYear,
    selectedCity,
    isPlaying,
    // Getters
    availableYears,
    stats,
    // Actions
    setLastUpdateDate,
    setYear,
    previousYear,
    nextYear,
    firstYear,
    lastYear,
    initializeDefaults,
    togglePlayback,
  };
});
