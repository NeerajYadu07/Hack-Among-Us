const fetchGeolocation = async (ip) => {
	const response = await fetch(
		`https://api.ip2location.io/?key=1C79036AD3050007DB7ED779B4E2BEB8&ip=${ip}`
	);
	if (!response.ok) throw new Error(`Failed to fetch data for IP: ${ip}`);
	return response.json();
};

export const getGeoLocation = async (req, res) => {
	try {
		const ips = req.body;
		console.log(ips);

		const response = await Promise.all(
			ips.map((ip) => fetchGeolocation(ip))
		);
		const data = response;

		return res.status(200).json(data);
	} catch (error) {
		console.log(error);
	}
};
