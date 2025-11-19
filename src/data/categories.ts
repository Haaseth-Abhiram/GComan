import { Beaker, Droplets, Wrench, Zap, FlaskConical, TestTube, Factory, Building2, Wheat, Microscope, Sparkles, FlaskRound, Flame, Wind, Wine, Shield, SprayCan } from 'lucide-react';
import { Category } from './productTypes';

export const categories: Category[] = [
  { id: 'all', name: 'All Products', icon: FlaskConical },
  { id: 'oilfield', name: 'Oilfield & Refinery', icon: Factory },
  { id: 'water-treatment', name: 'Water Treatment Chemicals', icon: Droplets },
  { id: 'lubricants', name: 'Lubricants & Greases', icon: Wrench },
  { id: 'corrosion-inhibitor', name: 'Corrosion Inhibitor', icon: Shield },
  { id: 'tank-cleaners', name: 'Tank Cleaners', icon: SprayCan },
  { id: 'ro-chemicals', name: 'RO Chemicals', icon: Droplets },
  { id: 'cooling-water', name: 'Cooling Water Chemicals', icon: Droplets },
  { id: 'swimming-pool', name: 'Swimming Pool Chemicals', icon: Droplets },
  { id: 'construction', name: 'Construction', icon: Building2 },
  { id: 'food-beverage', name: 'Food & Beverage', icon: Wine },
  { id: 'soap-detergent', name: 'Soap & Detergent', icon: Sparkles },
  { id: 'calcium-carbonate', name: 'Calcium Carbonate', icon: FlaskConical },
  { id: 'additives', name: 'Additives', icon: Zap },
  { id: 'lab-equipment', name: 'Lab Equipment', icon: TestTube },
  { id: 'lab-chemicals', name: 'Lab Chemicals', icon: Beaker },
  { id: 'agro', name: 'Agro Products', icon: Wheat },
  { id: 'solvents', name: 'Solvents', icon: FlaskRound },
  { id: 'inorganic', name: 'Inorganic Chemicals', icon: Microscope },
  { id: 'chlorinated', name: 'Chlorinated Solvents', icon: Flame },
  { id: 'ethanolamines', name: 'Ethanolamines', icon: Beaker },
  { id: 'glycols', name: 'Glycols', icon: Wind },
  { id: 'alcohols', name: 'Alcohols', icon: FlaskRound },
];
