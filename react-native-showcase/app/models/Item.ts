export default class Item {
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
    category: string;


    constructor(
        id: number,
        name: string,
        description: string,
        image: string,
        price: number,
        category: string
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.price = price;
        this.category = category;



    }
}