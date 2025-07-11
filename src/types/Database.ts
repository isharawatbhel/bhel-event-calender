export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          category: 'wellness' | 'technical' | 'team-building' | 'sports' | 'celebration' | 'training' | 'meeting';
          time: string | null;
          location: string | null;
          organizer: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          date: string;
          category: 'wellness' | 'technical' | 'team-building' | 'sports' | 'celebration' | 'training' | 'meeting';
          time?: string | null;
          location?: string | null;
          organizer?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          date?: string;
          category?: 'wellness' | 'technical' | 'team-building' | 'sports' | 'celebration' | 'training' | 'meeting';
          time?: string | null;
          location?: string | null;
          organizer?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}