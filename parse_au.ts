function getBalls(numbersStrOrArr: string[] | string): string[] {
    if (!numbersStrOrArr) return [];
    if (Array.isArray(numbersStrOrArr)) {
        if (numbersStrOrArr.length > 1) return numbersStrOrArr;
        if (numbersStrOrArr.length === 1) {
            const item = String(numbersStrOrArr[0]);
            if (item.includes(",")) return item.split(",").map(s => s.trim()).filter(Boolean);
            if (item.includes(" ")) return item.split(" ").map(s => s.trim()).filter(Boolean);
            if (item.includes("-")) return item.split("-").map(s => s.trim()).filter(Boolean);
            return item.split("");
        }
        return [];
    }
    const s = String(numbersStrOrArr || "");
    if (s.includes(",")) return s.split(",").map(x => x.trim()).filter(Boolean);
    if (s.includes(" ")) return s.split(" ").map(x => x.trim()).filter(Boolean);
    if (s.includes("-")) return s.split("-").map(x => x.trim()).filter(Boolean);
    return s.split("");
}

console.log(getBalls(["10, 15, 20"]));
console.log(getBalls(["123456"]));
console.log(getBalls(["10", "15", "20"]));
