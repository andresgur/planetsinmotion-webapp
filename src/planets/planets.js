import {Star} from '../star.js'
import {Planet} from '../planet.js'
import { M_earth, R_earth, M_J, R_J, DaysToSeconds} from '../constants.js'

// Data: [mass (kg), radius (km), orbital period (days)]
const planetData = {
  Mercury: [3.3011e23, 2439.7, 87.969],
  Venus:   [4.8675e24, 6051.8, 224.701],
  Earth:   [5.97237e24, 6371.0, 365.256],
  Mars:    [6.4171e23, 3389.5, 686.980],
  Jupiter: [1.8982e27, 69911, 4332.59],
  Saturn:  [5.6834e26, 58232, 10759.22],
  Uranus:  [8.6810e25, 25362, 30688.5],
  Neptune: [1.02413e26, 24622, 60182],
  Pluto:   [1.303e22, 1188.3, 90560]
};


const Mfactor = 1e24 * 1000;
const Rfactor = 100000; // Convert km to cm
const phase0 = 0.5;

const Sun = new Star()

// Mercury
export const Mercury = new Planet(
  Mfactor / M_J,         // mass (M_J)
  2440.5 * Rfactor / R_J,          // radius (R_J)
  87.969,       // period (s)
  Sun,
  7.004,                        // inclination (deg)
  0.2056,                       // eccentricity
  0, 0, phase0, 
  "#b2b2b2", // pale gray
   "Mercury",                     
);


// Venus
export const Venus = new Planet(
  4.8673 * Mfactor / M_J,
  6051.8 * Rfactor / R_J,
  224.701,
  Sun,
  3.395,
  0.0068,
  0, 0, phase0, 
  "#e6d8ad",                      // pale yellow
  "Venus",
);

export const Earth = new Planet(
    M_earth / M_J, R_earth / R_J, 
    365.256, 
    Sun, 
    0, 0.0167,
    0, 0, phase0, 
    "#3399ff", 
    "Earth");

// Mars
export const Mars = new Planet(
  0.64169 * Mfactor / M_J,
  3396.2 * Rfactor / R_J,
  686.980,
  Sun,
  1.850,                        // inclination
  0.0935,                       // eccentricity
  0, 0, phase0, 
  "#c1440e",                     // rusty red
  "Mars"
);

// Jupiter
export const Jupiter = new Planet(
  1,
  1,
  4332.589,
  Sun,
  1.304,                        // inclination
  0.0487,                       // eccentricity
  0, 0, phase0,
  "#e2b07a",                     // pale orange
  "Jupiter"
);

// Saturn
export const Saturn = new Planet(
  568.32 * Mfactor / M_J,
  60268 * Rfactor / R_J,
  10755.699,
  Sun,
  2.486,                        // inclination
  0.0520,                       // eccentricity
  0, 0, phase0, 
  "#f7e7b4",                     // pale yellow
  "Saturn"
);

// Uranus
export const Uranus = new Planet(
  86.811 * Mfactor / M_J,
  25559 * Rfactor / R_J,
  30685.4,
  Sun,
  0.770,                        // inclination
  0.0469,                       // eccentricity
  0, 0, phase0, 
  "#b5e3e3",                     // pale cyan
  "Uranus"
);

// Neptune
export const Neptune = new Planet(
  102.409 * Mfactor / M_J,
  24764 * Rfactor / R_J,
  60189,
  Sun,
  1.770,                        // inclination
  0.0097,                       // eccentricity
  0, 0, phase0,
  "#4976d1",                     // deep blue
  "Neptune"
);


// Pluto (dwarf planet)
export const Pluto = new Planet(
  0.01303 * Mfactor / M_J,
  1188.3 * Rfactor / R_J,
  90560,
  Sun,
  17.16,                        // inclination
  0.244,                       // eccentricity
  0, 0, phase0,
  "#b97a56",                     // pale brown-red
  "Pluto"
);




export const planetPresets = {
    Mercury,
    Venus,
    Earth,
    Mars,
    Jupiter,
    Saturn,
    Uranus,
    Neptune,
    Pluto
};