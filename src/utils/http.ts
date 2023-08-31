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
	config.headers = {...config.headers, 
		Authorization: `Bearer ${token}`
	}
	return config;
}, (error:any)=>{
	return Promise.reject(error);
});

http.interceptors.response.use((response:any) => {
	return response;
}, (error:any)=>{
	if((error.response && error.response.status == 401) || (error.response && error.response.status == 403)){
		Router.push("/");
	}
	return Promise.reject(error);
});

export default http;
