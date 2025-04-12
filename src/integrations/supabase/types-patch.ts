declare module '@/integrations/supabase/types' {
  interface Database {
    public: {
      Tables: {
        waitlist: {
          Row: {
            id: string;
            name: string;
            email: string;
            created_at: string;
          };
          Insert: {
            id?: string;
            name: string;
            email: string;
            created_at?: string;
          };
          Update: {
            id?: string;
            name?: string;
            email?: string;
            created_at?: string;
          };
          Relationships: [];
        };
      };
    };
  }
}
