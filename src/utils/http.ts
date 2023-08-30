import axios from "axios";
import Router from "next/router";

const http = axios.create({
	baseURL: process.env.API_URL,
	timeout: 30000,
	headers:{
		Accept: "application/json",
		"Content-Type": "application/json"
	}
});

http.interceptors.request.use((config:any) => {
	const token = ""; 
	let new_config = {
		...config.headers,
		Authorization: `Bearer ${token}`
	}
	return new_config
}, (error)=>{
	return Promise.reject(error);
});

http.interceptors.response.use((response:any) => {
	return response;
}, (error)=>{
	if((error.response && error.response.status == 401) || (error.response && error.response.status == 403)){
		Router.push("/");
	}
	return Promise.reject(error);
});

export default http;
