import {arMoney} from "@/services/payments/ARMoney";

export async function rubToUsdt(
    rub: number,
    option: {
        percent: number;
        extraPercent?: number;
        rate?: number;
        source: "armoney";
    }
): Promise<number> {
    let rate: number;

    switch (option.source) {
        // case "ByBit":
        //     rate = await getBybitRate(); // например, 93.5
        //     break;
        case "armoney":
            rate = (option.rate) ? option.rate : 82
            break;
        default:
            throw new Error("Unknown source");
    }

    const togetherPercent = Number(option.percent) + Number(option.extraPercent)
    const rubAfterFee = rub - rub * (togetherPercent / 100);

    console.log(rubAfterFee)
    const usdt = rubAfterFee / rate;

    return Number(usdt.toFixed(2));
}
