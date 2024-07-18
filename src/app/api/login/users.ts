export type UserTable = {
	id: number
	name: string
	email: string
	image: string
	password: string
}

// =============== Fake Data ============================

export const users: UserTable[] = [
	{
		id: 1,
		name: 'John Doe',
		password: 'admin',
		email: 'admin@materialize.com',
		image: '/images/avatars/1.png'
	}
]
