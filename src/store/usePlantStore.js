import { create } from 'zustand'

// Valores iniciais usados antes de integrar o backend.
const initialProfiles = {
  geral: {
    id: 'geral',
    label: 'Geral',
    thresholds: {
      soilMoisture: { a: 30, b: 45, c: 65, d: 75 },
      soilPh: { a: 5.5, b: 6, c: 7, d: 7.5 },
      airHumidity: { a: 40, b: 55, c: 70, d: 80 },
      temperature: { a: 15, b: 18, c: 26, d: 30 },
      light: { a: 20, b: 40, c: 70, d: 90 },
    },
  },
  cacto: {
    id: 'cacto',
    label: 'Cacto',
    thresholds: {
      soilMoisture: { a: 15, b: 25, c: 40, d: 55 },
      soilPh: { a: 5.5, b: 6, c: 7, d: 7.5 },
      airHumidity: { a: 20, b: 35, c: 50, d: 60 },
      temperature: { a: 18, b: 22, c: 30, d: 35 },
      light: { a: 40, b: 60, c: 85, d: 100 },
    },
  },
}

const initialSensors = {
  soilMoisture: 50,
  soilPh: 6.5,
  airHumidity: 55,
  temperature: 24,
  light: 68,
}

const initialIrrigation = {
  mode: 'manual',
  targetMoisture: 55,
  scheduledTime: '07:30',
  lastWaterings: [
    { date: '23/05', time: '07:30' },
    { date: '22/05', time: '18:10' },
    { date: '21/05', time: '07:15' },
  ],
}

const usePlantStore = create((set, get) => ({
  profiles: initialProfiles,
  selectedProfileId: 'geral',
  sensors: initialSensors,
  irrigation: initialIrrigation,
  setProfile: (profileId) => {
    const profile = get().profiles[profileId]
    if (!profile) return
    set({ selectedProfileId: profileId })
  },
  setSensorValue: (key, value) =>
    set((state) => ({
      sensors: {
        ...state.sensors,
        [key]: value,
      },
    })),
  setIrrigationMode: (mode) =>
    set((state) => ({
      irrigation: {
        ...state.irrigation,
        mode,
      },
    })),
  setTargetMoisture: (targetMoisture) =>
    set((state) => ({
      irrigation: {
        ...state.irrigation,
        targetMoisture,
      },
    })),
  setScheduledTime: (scheduledTime) =>
    set((state) => ({
      irrigation: {
        ...state.irrigation,
        scheduledTime,
      },
    })),
  addWatering: (entry) =>
    set((state) => ({
      irrigation: {
        ...state.irrigation,
        lastWaterings: [entry, ...state.irrigation.lastWaterings].slice(0, 3),
      },
    })),
}))

export default usePlantStore
