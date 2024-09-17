export default class User {
    id: number;
    username: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    role: string;

    constructor(
        id: number,
        username: string,
        name: string,
        email: string,
        password: string,
        avatar: string,
        role: string
    ) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.password = password;
        this.avatar = avatar;
        this.role = role;
    }
}