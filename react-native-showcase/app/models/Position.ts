import Item from "./Item";

export class Position extends Item {
    quantity: number;
    constructor(
        id: number,
        name: string,
        description: string,
        image: string,
        price: number,
        category: string,
        quantity: number
    ) {
        super(id, name, description, image, price, category);
        this.quantity = quantity;
    }
}