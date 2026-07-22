export interface Table {
  id: string;
  name: string;
  location: {
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
  };
  environment: 'Indoor' | 'Outdoor';
  tableCount: number;
  netQuality: 'Professional' | 'Standard' | 'Portable/Rec';
  surfaceType: 'ITTF Approved Wood' | 'Concrete' | 'Composite/Weatherproof';
  pricing: {
    isFree: boolean;
    costDetails: string; // e.g., "Free public park", "$20/hr per table", "Cover charge"
  };
  amenities: {
    paddlesProvided: boolean;
    ballsProvided: boolean;
    lighting: 'Excellent (Indoor/Floodlights)' | 'Good' | 'Limited (Daylight only)';
    drinksAvailable: boolean;
  };
  hours: string; // e.g., "Dawn to Dusk" or "Tue-Sun 4 PM - 11 PM"
  notes?: string; // Community tips, wind factors for outdoors, vibe, etc.
}