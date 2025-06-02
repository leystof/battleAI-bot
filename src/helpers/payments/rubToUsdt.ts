import {arMoney} from "@/services/payments/ARMoney";

export async function rubToUsdt(
    rub: number,
    option: {
        fee: number;
        source: "armoney";
    }
): Promise<number> {
    let rate: number;

    switch (option.source) {
        // case "ByBit":
        //     rate = await getBybitRate(); // например, 93.5
        //     break;
        case "armoney":
            rate = await arMoney.getRubRate(); // например, 94.2
            break;
        default:
            throw new Error("Unknown source");
    }

    const rubAfterFee = rub - rub * (option.fee / 100);

    const usdt = rubAfterFee / rate;

    return Number(usdt.toFixed(2));
}
