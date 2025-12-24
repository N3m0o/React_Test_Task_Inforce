export interface ProductSize {
    width: number;
    height: number;
}

export interface Product {
    id: number;
    imageUrl: string;
    name: string;
    count: number;
    size: ProductSize;
    weight: string;
    comments: string[];
}
