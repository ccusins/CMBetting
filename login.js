import createKindeClient from "@kinde-oss/kinde-auth-pkce-js"; 

(async () => {
	const kinde = await createKindeClient({
		client_id: "b7222bd7cab3437cb5e92f686bb4a224",
		domain: "https://cmbetting.kinde.com",
		redirect_uri: window.location.origin
	});
})


