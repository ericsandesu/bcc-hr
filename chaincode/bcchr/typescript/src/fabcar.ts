/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from 'fabric-contract-api';
import { Car } from './car';
import { Attendance } from './attendance';

export class FabCar extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const cars: Car[] = [
            {
                color: 'blue',
                make: 'Toyota',
                model: 'Prius',
                owner: 'Tomoko',
            },
            {
                color: 'red',
                make: 'Ford',
                model: 'Mustang',
                owner: 'Brad',
            },
            {
                color: 'green',
                make: 'Hyundai',
                model: 'Tucson',
                owner: 'Jin Soo',
            },
            {
                color: 'yellow',
                make: 'Volkswagen',
                model: 'Passat',
                owner: 'Max',
            },
            {
                color: 'black',
                make: 'Tesla',
                model: 'S',
                owner: 'Adriana',
            },
            {
                color: 'purple',
                make: 'Peugeot',
                model: '205',
                owner: 'Michel',
            },
            {
                color: 'white',
                make: 'Chery',
                model: 'S22L',
                owner: 'Aarav',
            },
            {
                color: 'violet',
                make: 'Fiat',
                model: 'Punto',
                owner: 'Pari',
            },
            {
                color: 'indigo',
                make: 'Tata',
                model: 'Nano',
                owner: 'Valeria',
            },
            {
                color: 'brown',
                make: 'Holden',
                model: 'Barina',
                owner: 'Shotaro',
            },
        ];

        for (let i = 0; i < cars.length; i++) {
            cars[i].docType = 'car';
            await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
            console.info('Added <--> ', cars[i]);
        }

        const attendances: Attendance[] = [
            {
                punchIn : '8:30:42',
                punchOut : '17:30:02',
            },
            {
                punchIn : '9:30:16',
                punchOut : '18:40:32',
            }, 
            {
                punchIn : '7:35:34',
                punchOut : '19:45:52',
            }
        ];

//        var dateFormat = require('dateformat');

        for (let i = 0; i < attendances.length; i++) {
 /*           var now = new Date();
            now.setDate(now.getDate()-i);
            now.setHours(now.getHours()-i);
            now.setMinutes(now.getMinutes()-i);
            now.setSeconds(now.getSeconds()-i);
            now.setMilliseconds(now.getMilliseconds()-i);
            console.log(dateFormat(now, 'yyyymmddHHMMss'));
 */           await ctx.stub.putState('ATTENDANCE' + i, Buffer.from(JSON.stringify(attendances[i])));
//            await ctx.stub.putState('ATTENDANCE' + dateFormat(now, 'yyyymmddHHMMss'), Buffer.from(JSON.stringify(attendances[i])));
            console.info('Added <--> ', attendances[i]);
        }
 
        console.info('============= END : Initialize Ledger ===========');
    }

    public async queryCar(ctx: Context, carNumber: string): Promise<string> {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    public async createCar(ctx: Context, carNumber: string, make: string, model: string, color: string, owner: string) {
        console.info('============= START : Create Car ===========');

        const car: Car = {
            color,
            docType: 'car',
            make,
            model,
            owner,
        };

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ===========');
    }

    public async createAttendance(ctx: Context, attendanceNumber: string, punchIn: string, punchOut: string) {
        console.info('============= START : Create Attendance ===========');

        const attendance: Attendance = {
            punchIn,
            punchOut,
        };

        await ctx.stub.putState(attendanceNumber, Buffer.from(JSON.stringify(attendance)));
        console.info('============= END : Create Attendance ===========');
    }

    public async queryAllCars(ctx: Context): Promise<string> {
        const startKey = 'CAR0';
        const endKey = 'CAR999';
 //       const startKey = 'ATTENDANCE0';
 //       const endKey = 'ATTENDANCE99';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    public async queryAllAttendances(ctx: Context): Promise<string> {
        const startKey = 'ATTENDANCE0';
        const endKey = 'ATTENDANCE99';
/*
        var dateFormat = require('dateformat');
        var i: number = 2;
        var now = new Date();
        now.setDate(now.getDate()-i);
        now.setHours(now.getHours()-i);
        now.setMinutes(now.getMinutes()-i);
        now.setSeconds(now.getSeconds()-i);
        now.setMilliseconds(now.getMilliseconds()-i);
        console.log(dateFormat(now, 'yyyymmddHHMMss'));

        const startKey = 'ATTENDANCE'+dateFormat(now, 'yyyymmddHHMMss');

        var i: number = 5;
        var now = new Date();
        now.setDate(now.getDate()+i);
        now.setHours(now.getHours()+i);
        now.setMinutes(now.getMinutes()+i);
        now.setSeconds(now.getSeconds()+i);
        now.setMilliseconds(now.getMilliseconds()+i);
        console.log(dateFormat(now, 'yyyymmddHHMMss'));

        const endKey  = 'ATTENDANCE'+dateFormat(now, 'yyyymmddHHMMss');
*/
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    public async changeCarOwner(ctx: Context, carNumber: string, newOwner: string) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car: Car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

    public async punchOut(ctx: Context, attendanceNumber: string, punchOut: string) {
        console.info('============= START : punchOut ===========');

        const attendanceAsBytes = await ctx.stub.getState(attendanceNumber); // get the car from chaincode state
        if (!attendanceAsBytes || attendanceAsBytes.length === 0) {
            throw new Error(`${attendanceNumber} does not exist`);
        }
        const attendance: Attendance = JSON.parse(attendanceAsBytes.toString());
        attendance.punchOut = punchOut;

        await ctx.stub.putState(attendanceNumber, Buffer.from(JSON.stringify(attendance)));
        console.info('============= END : punchOut ===========');
    }


}
