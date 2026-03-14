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
		password: 'password',
		email: 'admin@mail.com',
		image: '/images/avatars/1.png'
	}
]
