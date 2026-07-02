import { create } from 'zustand';
import { Professional } from '../types/professional.types';
import { Service } from '../types/service.types';

interface BookingStore {
  professional: Professional | null;
  selectedServices: Service[];
  selectedDate: string | null;
  selectedTime: string | null;
  step: 'servicos' | 'data-hora' | 'dados' | 'pagamento' | 'confirmacao';
  
  setProfessional: (professional: Professional) => void;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  setDateTime: (date: string, time: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  setStep: (step: 'servicos' | 'data-hora' | 'dados' | 'pagamento' | 'confirmacao') => void;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  professional: null,
  selectedServices: [],
  selectedDate: null,
  selectedTime: null,
  step: 'servicos',

  setProfessional: (professional) => set({ professional }),
  
  addService: (service) => set((state) => ({ 
    selectedServices: state.selectedServices.find(s => s.id === service.id) 
      ? state.selectedServices 
      : [...state.selectedServices, service] 
  })),
  
  removeService: (serviceId) => set((state) => ({ 
    selectedServices: state.selectedServices.filter(s => s.id !== serviceId) 
  })),
  
  setDateTime: (date, time) => set({ selectedDate: date, selectedTime: time }),
  
  nextStep: () => set((state) => {
    const steps: BookingStore['step'][] = ['servicos', 'data-hora', 'dados', 'pagamento', 'confirmacao'];
    const currentIndex = steps.indexOf(state.step);
    if (currentIndex < steps.length - 1) {
      return { step: steps[currentIndex + 1] };
    }
    return state;
  }),
  
  previousStep: () => set((state) => {
    const steps: BookingStore['step'][] = ['servicos', 'data-hora', 'dados', 'pagamento', 'confirmacao'];
    const currentIndex = steps.indexOf(state.step);
    if (currentIndex > 0) {
      return { step: steps[currentIndex - 1] };
    }
    return state;
  }),

  setStep: (step) => set({ step }),

  reset: () => set({
    professional: null,
    selectedServices: [],
    selectedDate: null,
    selectedTime: null,
    step: 'servicos',
  }),
}));
