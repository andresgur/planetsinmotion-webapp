import { sin, cos, asin, acos, atan, sqrt } from 'mathjs';

/**
 * Computes the angle alpha.
 *
 * @param {number} Rs - Radius of the star or eclipsed object.
 * @param {number} Rp - Radius of the planet or transiting object.
 * @param {number} beta - Angle between the line connecting the two bodies' centers and the line connecting the eclipsed body's center and the point of contact.
 * @returns {number} - The angle alpha for each input.
 */
export function getAlpha(Rs, Rp, beta) {

    const alpha = asin((Rp * sin(Math.PI - beta)) / Rs);
    
    return alpha;
}

/**
 * Calculates the angle beta.
 *
 * @param {number} R0 - Radius of the main object.
 * @param {number} Rplanet - Radius of the eclipsing planet object with properties `ry`, `rz`, and `R`.
 * @param {number} ry - Array of positions in the y-axis.
 * @param {number} rz - Array of positions in the z-axis.
 * @returns {number} - The angle beta transit.
 */
export function getBeta(R0, Rplanet, planetry, planetrz, ry=0, rz=0) {
    const deltaY = Math.abs(planetry - ry)
    const deltaZ = planetrz - rz
    const beta = Math.PI - solveBeta(deltaY, deltaZ, R0, Rplanet);
    return beta;
};

function betaFunc(beta_i, ry_cosy, Rs, Rp) {
    const alpha = getAlpha(Rs, Rp, beta_i);
    const projectedStar = Rs * cos(alpha);
    const argument = (projectedStar - ry_cosy) / Rp;
    return beta_i - acos(argument)
}

/**
 * Solves for the angle beta using a numerical method.
 *
 * @param {number} dy - Distance between the two bodies on the y-axis
 * @param {number} dz - Distance between the two bodies on the z-axis
 * @param {number} Rs - Radius of the star.
 * @param {number} Rp - Radius of the planet.
 * @param {number} [errTol=0.001] - Error tolerance for the solution.
 * @returns {Array} - The solved angle beta for each input.
 */
export function solveBeta(dy, dz, Rs, Rp, errTol = 0.001, max_N = 100) {
        let betaA = 0;
        let betaB = Math.PI;
        const phi = atan(dz / dy);
        // when deltay is close to 0 we get 0 = 0 in one of the equations, so best to use the vertical component of the equation
        const dy_cosphi = dy > 1e-3 ? dy / cos(phi) : dz / sin(phi)
        
        let betaC = (betaA + betaB) / 2

        let fC = betaFunc(betaC, dy_cosphi, Rs, Rp)
        // Check if the function is discontinuous at the midpoint
        if (isNaN(fC)) {
            // if so redefine the initial guess for betaA
            betaA = findInitBeta(betaC, dy_cosphi, Rs, Rp)
        }
        
        let err = (betaB - betaA) / 2;
        let fA = betaFunc(betaA, dy_cosphi, Rs, Rp);

        for (let i = 0; i < max_N; i++) {
            betaC = (betaA + betaB) / 2;
            fC = betaFunc(betaC, dy_cosphi, Rs, Rp);
            if (fC * fA < 0) {
                betaB = betaC;
            } else {
                betaA = betaC;
                fA = fC;
            }
            err = (betaB - betaA) / 2;
            if (err < errTol || fC === 0) {
                return betaC;
            }
        }
        return null; // Return null if no solution is found
    }

/**
* Find initial guess value for beta when the function _betafunc is discontinuous.
*/
function findInitBeta(init_beta, ry_cosphi, Rs, Rp) {
    
    let beta_a = init_beta
    let f_a = betaFunc(beta_a, ry_cosphi, Rs, Rp)
    while (isNaN(f_a)) {
        beta_a += 0.05;
        f_a = betaFunc(beta_a, ry_cosphi, Rs, Rp);
    }
    return beta_a
}

export function getTransitArea(star, planet, index) {
    const beta = getBeta(star._R, planet._R, planet.ry[index], planet.rz[index], star.ry[index], star.rz[index]);
    const alpha = getAlpha(star._R, planet._R, beta);
    const area = transitArea(star._R, planet._R, beta, alpha);
    return area
}

export function getDistance(pointA, pointB=[0, 0]) {
    const distance = sqrt((pointA[0] - pointB[0]) ** 2 + (pointA[1] - pointB[1]) ** 2);
    return distance;
}

/**
 * Computes the transit area.
 *
 * @param {number} Rs - Radii of the eclipsed body (e.g. the star).
 * @param {number} Rp - Radii of the eclipsing body (e.g. planet).
 * @param {number} beta - Array of angles beta.
 * @param {number} alpha - Array of angles alpha.
 * @returns {area} - The transit area.
 */
export function transitArea(Rs, Rp, beta, alpha){
    const planetArea = pizza_triangle(Rp, beta);
    const starArea = pizza_triangle(Rs, alpha);
    const area = planetArea + starArea;
    return area;
};

function pizza_triangle(R, half_angle) {
    const area =  R**2 * (half_angle - cos(half_angle) * sin(half_angle));
    return area;
}
    /**
     * Calculate one of the sub area (of a total of three) forming the overlapping area of three circles during partial-partial-partial transits  
    * @param {number} Rs - Radius of the star or eclipsed object (associated with alpha).
    * @param {number} Rp1 - Radius of the first planet (planet 1).
    * @param {number} Rp2 - Radius of the second planet (planet 2).
    * @param {Array<number>} p1 - Point of contact between the two circles (planet 1 and planet 2) as [x, y].
    * @param {Array<number>} p2 - Point of contact between the second planet and the star as [x, y].
    * @param {Array<number>} p3 - Point of contact between the star and the first planet as [x, y].
    * @returns {number} - The calculated overlapping area of the three circles.
    */

export function circle_circle_circle_area(Rs, Rp1, Rp2, p1, p2, p3) {

    const d1 = getDistance(p1, p2);
    const d2 = getDistance(p2, p3);
    const d3 = getDistance(p3, p1);

    const theta1 = cos_law(Rp1, Rp1, d1);
    const theta2 = cos_law(Rp2, Rp2, d3);
    const theta3 = cos_law(Rs, Rs, d2);
    
    // pizza - triangles
    const areaPlanet1 = pizza_triangle(Rp1, theta1 / 2);
    const areaPlanet2 = pizza_triangle(Rp2, theta2 / 2);
    const areaStar = pizza_triangle(Rs, theta3 / 2);
    
    // central triangle;
    const triangle = triangle_area(d1, d2, d3);
    const area = areaPlanet1 + areaPlanet2 + areaStar + triangle;
    return area;
}
/**
 * Calculates the area of a triangle given the lengths of its sides using Heron's formula.
 *
 * @param {number} a - Length of side 1.
 * @param {number} b - Length of side 2.
 * @param {number} c - Length of side 3.
 * @returns {number} - The area of the triangle.
 */
function triangle_area(a, b, c){
    const s = (a + b + c) / 2.;
    const area = sqrt(s* (s- a) * (s - b) * (s - c));
    return area;
}


function cos_law(a, b, c) {
    const gamma = acos((a**2 + b**2 - c**2) / (2 * a * b));
    return gamma;

}