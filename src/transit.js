import { getTransitArea, getBeta} from './trigonometry.js'
import { Body } from './body.js';
import {atan2, sin, cos} from 'mathjs';

export class Transit {
    /**
     * Parameters
     * ----------
     * @param {Body} eclipsedBody - The body being eclipsed
     * @param {Body} eclipsingBody - The eclipsing body
     * @param {boolean} checkFront - Whether to also check for the eclipsing body being in front of the eclipsed body
     */
    constructor(eclipsedBody, eclipsingBody, checkFront=true) {

        this.eclipsedBody = eclipsedBody;
        this.eclipsingBody = eclipsingBody;
        this.checkFront = checkFront;
        this.datapoints = eclipsingBody.rx.length;
        [this.fullTransitIndexes, this.partialTransitIndexes ] = this.getTransits(this.eclipsingBody, this.eclipsedBody, this.checkFront);
        this.workoutTransits()
        
    }
    
    workoutTransits() {
        console.log("Number of full transits: ", this.fullTransitIndexes.length);
        console.log("Number of partial transits: ", this.partialTransitIndexes.length);
        this.eclipsedArea = this.getEclipsedArea(this.fullTransitIndexes, this.partialTransitIndexes)
        this.visibleFraction = this.eclipsedArea.map(area => 1 - area / this.eclipsedBody.Area)

        this.transitDuration = this.partialTransitIndexes.length + this.fullTransitIndexes.length;

        this.transitDepth = Math.max(...this.eclipsedArea) / this.eclipsedBody.Area;
        
    }

    /**
     * Calculates the area eclipsed by this body on the input body (e.g., a star).
     *
     * @param {Body} body - The body being eclipsed (e.g., the star).
     *
     * Notes:
     * - The method calculates the eclipsed area based on the relative positions and radii of the two bodies.
     * - It distinguishes between full transits (where the entire planet is within the star's disk) and partial transits.
     * - The calculation uses the angles `alpha` (angle between the centers of the two bodies) and `beta` (angle between the center of the planet and the edge of the star).
     */
    getEclipsedArea(fullTransitIndexes, partialTransitIndexes) {
        
        var eclipsedArea = new Array(this.datapoints).fill(1);
        partialTransitIndexes.forEach(index => {

                eclipsedArea[index] = getTransitArea(this.eclipsedBody, this.eclipsingBody, index);
        });

        fullTransitIndexes.forEach(index => {
            // Set transit area for full transits
            eclipsedArea[index] = this.eclipsingBody.Area; // Full transit area is the area of the planet
            
        });
        return eclipsedArea
    }
    /**
     * Parameters
     * ----------
     * @param {Body} body - The eclipsing body (e.g. planet)
     * 
     * Returns
     * -------
     * Array of indices, the first index is the indexes where full transit occurs, the second where partial transit occurs
     * 
    */
    getTransits(body, star, checkInFront = true) {

         // Array of all indices
        const indices = Array.from({ length: this.datapoints }, (_, i) => i);

        const inFrontIndices = indices.filter(i => body.rx[i] > star.rx[i] || !checkInFront);

        const fullTransitIndices = inFrontIndices.filter(i => star.getProjectedDistance(body, i) + body._R <= star._R);

        const partialTransitIndices = inFrontIndices.filter(i =>
            (star.getProjectedDistance(body, i) - body._R < star._R) &&
            (star.getProjectedDistance(body, i) + body._R >= star._R)
        );
        return [fullTransitIndices, partialTransitIndices];
    }

    /**
     * Get the contact points between the transiting body and the eclipsed body at a given index.
     * @param {Number} index 
     * @returns 
     */
    getContactPoints(index) {
        const beta = getBeta(this.eclipsedBody._R, this.eclipsingBody._R, this.eclipsingBody.ry[index], 
            this.eclipsingBody.rz[index], this.eclipsedBody.ry[index], this.eclipsedBody.rz[index]);
        const ry = this.eclipsingBody.ry[index];
        const rz = this.eclipsingBody.rz[index];
        const phi = atan2(rz - this.eclipsedBody.rz[index], ry - this.eclipsedBody.ry[index]);
        const origin = [ry, rz]
        const point_up = [this.pointy(origin[0], 1, beta, phi), this.pointz(origin[1], 1, beta, phi)];
        const point_down = [this.pointy(origin[0], -1, beta, phi), this.pointz(origin[1], -1, beta, phi)];
        return [point_up, point_down]
    }

    pointy(origin, sign, beta, phi) {
        return origin - this.eclipsingBody._R * cos(beta + sign * phi);
    }
    pointz(origin, sign, beta, phi) {
        return origin - sign * this.eclipsingBody._R * sin(beta + sign * phi);
    }


}