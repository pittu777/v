
export function formatINR(paise: number):string{
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(paise / 100);
}

export function isLowStock(currentStock: number, threshold: number):boolean{
    return currentStock > 0 && currentStock <= threshold;
}


