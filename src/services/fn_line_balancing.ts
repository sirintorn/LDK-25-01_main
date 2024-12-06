import { ILineDetail } from '../models/m_line_detail';

export class FnLineBalancing{

    /*
        1. Takttime = 60/unit per hour
        2. Unit per hour = Takttime * 60
        3. Cycle time max = ค่า cycletime ที่สูงสุดจาก details ทั้งหมด
        4. %OTP Bottleneck = (Takttime / Cycle time max) * 100
        5. %Balance = (Total Cycle Time * 100%) / (Cycle Time Max * Workstations)
        6. Bottleneck Station = สถานีงานที่เป็นคอขวดในสายการผลิต หรือหมายถึงสถานีงานที่มี Cycle Time Max
        7. Bootleneck Output = 60 /  Cycle Time Max
        8. Total Workstation = จำนวนสถานีงานทั้งหมด
        9. Column Status ใน table = (Sum Cycle Time ของสถานีงานนั้น / Takttime) * 100
            9.1. ค่ามากกว่า takttime แสดง bg red
            9.2. ค่าเท่ากับ takttime แสดง bg yellow
            9.3. (80% ของ takttime) > Column Status < 100 แสดง bg green
            9.4. ค่าน้อยกว่าหรือเท่ากับ 80% ของ takttime bg สีส้ม
    */

    // 1.
    static unitPerHourToTaktTime(unit_per_hour: number){
        return 60 / (!isNaN(unit_per_hour) ? unit_per_hour : -1);
    }

    //2.
    static taktTimeToUnitPerHour(takt_time: number){
        return (!isNaN(takt_time) ? takt_time : 0) * 60;
    }

    //3.
    static findCycleTimeMax(lineDetails: ILineDetail[]){
        let cycle_time_max = 0;
        let target_index = -1;

        if(lineDetails && lineDetails.length > 0){
            for (let i = 0; i < lineDetails.length; i++) {
                const item = lineDetails[i];
                if(item.cycle_time > cycle_time_max){
                    cycle_time_max = item.cycle_time;
                    target_index = i
                }
            }
        }

        return {
            cycle_time_max: cycle_time_max,
            target_index: target_index
        };
    }

    //3.1
    static totalCycleTime(lineDetails: ILineDetail[]){
        let total_cycle_time = 0;

        if(lineDetails && lineDetails.length > 0){
            for (let i = 0; i < lineDetails.length; i++) {
                const item = lineDetails[i];
                total_cycle_time += (item.cycle_time ?? 0);
            }
        }

        return total_cycle_time;
    }

    //4.
    static percentOTPBottleneck(takt_time: number, cycle_time_max: number){
        return ( (!isNaN(takt_time) ? takt_time : 0) / (!isNaN(cycle_time_max) ? cycle_time_max : -1) )  * 100;
    }

    //5.
    static percentBalance(total_cycle_time: number, cycle_time_max: number, workstation_count: number){
        return ( (!isNaN(total_cycle_time) ? total_cycle_time : 0) / ( (!isNaN(cycle_time_max) ? cycle_time_max : -1) * (!isNaN(workstation_count) ? workstation_count  : 1) )) * 100;
    }

    //6.
    static findBottleneckStation(lineDetails: ILineDetail[]){
        let ctMax = this.findCycleTimeMax(lineDetails);
        if(ctMax.target_index != -1){
            return lineDetails[ctMax.target_index].station;
        }else{
            return null;
        }
    }

    //7.
    static bottleneckOutput(cycle_time_max: number){
        return 60 / (!isNaN(cycle_time_max)  ? cycle_time_max : -1);
    }

    //8.
    static totalWorkstation(lineDetails: ILineDetail[]){
        let workstations: any = {};
        let total_count = 0;
        let each_count = [];

        if(lineDetails && lineDetails.length > 0){
            for (let i = 0; i < lineDetails.length; i++) {
                const item = lineDetails[i];
                if(workstations[item.station]){
                    workstations[item.station].count++;
                }else{
                    workstations[item.station] = {
                        count: 0
                    };
                }
            }
        }

        for(let key in workstations){
            total_count++;
            each_count.push({
                station: key,
                count: workstations[key].count
            })
        }

        return {
            total_count: total_count,
            each_count: each_count

        };
    }

    //9.
    static detailStatus(takttime: number, targetDetail: ILineDetail, lineDetails: ILineDetail[]){
        let result = {
            bg: 'white'
        };

        if(targetDetail && lineDetails){
            const t_station = targetDetail.station;
            const similar = lineDetails.filter(val => val.station == t_station);
            const tot_ct = this.totalCycleTime(similar);
            const val = (tot_ct / (!isNaN(takttime) ? takttime : -1)) * 100;

            //9.1
            if(val > takttime){
                result.bg = 'red';
            }
            //9.2
            else if(val == takttime){
                result.bg = 'yellow';
            }
            //9.3
            else if( val > (0.8 * takttime) && val < (1.0 * takttime)){
                result.bg = 'green';
            }
            //9.4
            else if(val <= (0.8 * takttime)){
                result.bg = 'orange';
            }
        }

        return result
    }
}
