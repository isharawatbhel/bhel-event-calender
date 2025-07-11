export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: 'wellness' | 'technical' | 'team-building' | 'sports' | 'celebration' | 'training' | 'meeting';
  time?: string;
  location?: string;
  organizer?: string;
}

export interface CalendarDay {
  date: Date;
  events: Event[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}