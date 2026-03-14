import axios from "axios";

export const axiosServices = axios.create({
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
	},
	withCredentials: true,
});


axiosServices.interceptors.response.use(
	(response) => response,
	(error) => {
		Promise.reject((error.response && error.response.data) || 'Wrong Services')
	}
);
