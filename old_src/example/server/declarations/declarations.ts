
/** Auth **/

export type Auth = {
	id: number;
}

type GetAuth = (id?: number) => Promise<unknown>

export type AuthClient = {
	getAuth: GetAuth
}

/** ----- **/

/** User **/

export type User = {
	id: number;
	name: string;
	obj: {
		test: boolean;
		foo: number;
		obj: {
			test: boolean;
			foo: number;
		}[];
		custom: Auth;
	};
}

type GetUser = (id?: number) => Promise<User>
type GetUsers = () => Promise<unknown>
type UpdateUser = (id?: number) => Promise<unknown>

export type UserClient = {
	getUser: GetUser
	getUsers: GetUsers
	updateUser: UpdateUser
}

/** ----- **/