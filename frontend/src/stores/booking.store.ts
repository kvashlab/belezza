import { create } from 'zustand';
import { Professional } from '../types/professional.types';
import { Service } from '../types/service.types';

export type BookingStep = 'servicos' | 'equipe' | 'data-hora' | 'dados' | 'pagamento' | 'confirmacao';

interface BookingStore {
  professional: Professional | null;
  selectedServices: Service[];
  selectedTeamMember: any | null;
  selectedDate: string | null;
  selectedTime: string | null;
  step: BookingStep;
  
  setProfessional: (professional: Professional) => void;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  setTeamMember: (member: any) => void;
  setDateTime: (date: string, time: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  setStep: (step: BookingStep) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  professional: null,
  selectedServices: [],
  selectedTeamMember: null,
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
  
  setTeamMember: (member) => set({ selectedTeamMember: member }),

  setDateTime: (date, time) => set({ selectedDate: date, selectedTime: time }),
  
  nextStep: () => set((state) => {
    const steps: BookingStep[] = ['servicos', 'equipe', 'data-hora', 'dados', 'pagamento', 'confirmacao'];
    const currentIndex = steps.indexOf(state.step);
    if (currentIndex < steps.length - 1) {
      return { step: steps[currentIndex + 1] };
    }
    return state;
  }),
  
  previousStep: () => set((state) => {
    const steps: BookingStep[] = ['servicos', 'equipe', 'data-hora', 'dados', 'pagamento', 'confirmacao'];
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
    selectedTeamMember: null,
    selectedDate: null,
    selectedTime: null,
    step: 'servicos',
  }),
}));
