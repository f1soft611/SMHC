import { create } from 'zustand';

type DateRange = 'today' | 'week' | 'month';

interface PlantUiState {
  selectedSiteId: string;
  dateRange: DateRange;
  setSelectedSiteId: (siteId: string) => void;
  setDateRange: (range: DateRange) => void;
}

export const usePlantUiStore = create<PlantUiState>((set) => ({
  selectedSiteId: 'SITE-01',
  dateRange: 'today',
  setSelectedSiteId: (siteId) => set({ selectedSiteId: siteId }),
  setDateRange: (range) => set({ dateRange: range }),
}));
